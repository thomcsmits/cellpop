import * as d3 from "d3";
import { CellPopData, CellPopDimensions } from "../cellpop-schema";

export function renderGraph(dataFull: CellPopData, dimensions: CellPopDimensions, x: d3.ScaleBand<string>) {
	// Remove any prior barcharts
	d3.select("g.graph").remove();

	// Create svg element
	const svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + dimensions.graph.offsetWidth + "," + dimensions.graph.offsetHeight + ")")
			.attr("class", "graph")

    // Get dimensions
	const width = dimensions.graph.width - dimensions.graph.margin.left - dimensions.graph.margin.right;
	const height = dimensions.graph.height - dimensions.graph.margin.top - dimensions.graph.margin.bottom;

    
    // Random data
    // Random data
    const data = {
        name: "cell", 
        children: [
            {
                name: "C4",
                children: [
                    {
                        name: "C3",
                        children: [
                            {
                                name: "C1"
                            },
                            {
                                name: "C2"
                            }
                        ]
                    },
                ]
            },
            {
                name: "C6",
                children: [
                    {
                        name: "C5"
                    }
                ]
            },
        ]
    }

    let colNames = ['C1', 'C2', 'C5']
    let colNamesShown = colNames;

    // Create a layer for the links and a layer for the nodes.
    const gLink = svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
    .attr("class", "nodes")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");


    // create root, nodes and links
    const root = d3.hierarchy(data);
    const nodes = root.descendants().reverse();
    const links = root.links();

    // d3.cluster creates a dendrogram, such that the y-coordinates of all levels align
    // the x will be overridden
    var tree = d3.cluster().size([1, height]);
    tree(root);


    root.eachAfter(node => {
        if (colNames.includes(node.data.name)) {
            // add x.bandwidth()/2 so that the node ends in the middle of the row
            node.x = x(node.data.name) + x.bandwidth()/2;
        }
        else if (node.data.children) {
            // if (node.data.children.map(d => d.hidden).length === node.data.children.length) {
            // } else {
                let x_total = 0;
                node.children.forEach(child => {
                    x_total += child.x;
                })
                node.x = x_total / node.data.children.length;
            // }
        } else {
            console.warn(`Node ${node.data.name} is a leaf but not in the dataset.`)
        }
    
        // reverse the y-coordinates
        node.y = dimensions.graph.height - node.y;
    
        node.collapsed = false;
        node.hidden = false;
    
        // console.log(node.x, node.y)
    })


    function update() {
        // remove all current elements
        d3.selectAll('circle').remove()
        d3.selectAll('path').remove()

        // create nodes
        const node = gNode.selectAll()
            .data(nodes.filter(d => !d.hidden), d => d.id)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return d.x })
            .attr("cy", function(d) { return d.y })
            .attr("fill", "black");

        // create links
        const line = d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveLinear);

        const link = gLink.selectAll("path")
            .data(links.filter(l => !l.source.hidden && !l.target.hidden), d => d.target.id)
            .enter()
            .append("path")
            .attr("d", d => line([d.source, d.target]))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        
        // add interaction
        node.on('click', change);
    }
    update();
}


function change(event,d) {
    if (d.collapsed) {
        showNode(event,d)
    } else {
        hideNode(event,d)
    }
}


function hideNode(event,d) {
    d.collapsed = true;
    setVisibilityChildren(d, true);
    d3.select(event.target).attr('fill', 'red');
    update();
}


function showNode(event,d) {
    d.collapsed = false;
    setVisibilityChildren(d, false);
    d3.select(event.target).attr('fill', 'black');
    update();
}


function setVisibilityChildren(node, hidden) {
    if (node.children) {
        node.children.forEach(d => d.hidden = hidden);
        node.children.forEach(d => setVisibilityChildren(d, hidden));
    }
}
