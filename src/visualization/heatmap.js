import * as d3 from "d3";

import { createBarChart } from "./barExtensions";
import { renderLeftBar } from "./barSide";
import { dragstarted, dragged, dragended } from "./drag";
import { defineTooltip, addTooltip, removeTooltip } from "./tooltips";


export function renderHeatmap(data, dimensions) {
	// Remove any prior heatmaps
	d3.select("g.heatmap").remove();

	// Create svg element
	let svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + eval(dimensions.heatmap.offsetWidth + dimensions.heatmap.margin.left) + "," + eval(dimensions.heatmap.offsetHeight + dimensions.heatmap.margin.top) + ")")
			.attr("class", "heatmap")


	// Get dimensions
	let width = dimensions.heatmap.width - dimensions.heatmap.margin.left - dimensions.heatmap.margin.right;
	let height = dimensions.heatmap.height - dimensions.heatmap.margin.top - dimensions.heatmap.margin.bottom;

	// Add x-axis
	let x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.colNames)
		.padding(0.01);

	svg.append("g")
		.attr("class", "axisbottom")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end")
			.style("font-size", dimensions.textSize.tick);

	svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + dimensions.heatmap.margin.bottom - 10)
        .text("Cell type")
		.style("font-size", dimensions.textSize.label);


	// Add y-axis
	let y = d3.scaleBand()
		.range([ height, 0 ])
		.domain(data.rowNames)
		.padding(0.01);

	svg.append("g")
		.attr("class", "axisright")
		.attr("transform", "translate(" + width + ",0)")
		.call(d3.axisRight(y))
		.selectAll("text")
			.style("font-size", dimensions.textSize.tick);

    svg.append("text")
		.attr("class", "y-label")
		.attr("text-anchor", "end")
		.attr("x", -height/2)
		.attr("y", width + 100)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Samples")
		.style("font-size", dimensions.textSize.label);

	// add metadata scale
	// let y_meta = d3.scaleOrdinal()
	// 	.domain(['right', 'left'])
	// 	.range([0, 300, height])

	// svg.append("g")
	// 	.attr("class", "axisright")
	// 	.attr("transform", "translate(" + eval(width+100) + ",0)")
	// 	.call(d3.axisRight(y_meta))
	// 	.selectAll("text")
	// 		.attr("transform", "translate(0,150)")
	// 		.style("font-size", dimensions.textSize.tick);

	// svg.append("text")
	// 	.attr("class", "y-label")
	// 	.attr("text-anchor", "end")
	// 	.attr("x", -height/2)
	// 	.attr("y", width + 150)
	// 	.attr("dy", ".75em")
	// 	.attr("transform", "rotate(-90)")
	// 	.text("Metadata")
	// 	.style("font-size", dimensions.textSize.label);


	// Add color
	let colorRange = d3.scaleLinear()
		.range(["white", "#69b3a2"])
		.domain([0,2000])


	// Add rows and columns behind
	let colsBehind = svg.selectAll()
		.data(data.colNamesWrapped, function(d) {return d.col;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-cols")
			.attr("x", function(d) { return x(d.col) })
			.attr("y", 0)
			.attr("width", x.bandwidth() )
			.attr("height", height )
			.style("fill", colorRange(0))


	let rowsBehind = svg.selectAll()
		.data(data.rowNamesWrapped, function(d) {return d.row;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-rows")
			.attr("x", 0)
			.attr("y", function(d) { return y(d.row) })
			.attr("width", width )
			.attr("height", y.bandwidth() )
			.style("fill", colorRange(0))


	// Read the data
	let rects = svg.selectAll()
		.data(data.countsMatrix, function(d) {return d.row+":"+d.col;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-rects")
			.attr("x", function(d) { return x(d.col) })
			.attr("y", function(d) { return y(d.row) })
			.attr("width", x.bandwidth() )
			.attr("height", y.bandwidth() )
			.style("fill", function(d) { return colorRange(d.value)} )


    // Add highlight
    svg.append("rect")
		.attr("class", "highlight")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("stroke", "black")
		.attr("fill", "none")
		.attr("pointer-events", "none")
		.attr("visibility", "hidden")

	defineTooltip()


	// Define mouse functions
    const mouseover = function(event,d) {
        if (event.ctrlKey) {
			if (event.target.classList[0].includes('heatmap-rects')) {}
			addTooltip(event, d);
        } else {
        	addHighlight(event.target.y.animVal.value, event.target.height.animVal.value);
        }
    }
    const mouseleave = function(event,d) {
		removeTooltip();
        removeHighlight(event,d);
    }

    rects.on("mouseover", mouseover);
	rowsBehind.on("mouseover", mouseover);
    rects.on("mouseleave", mouseleave);
	rowsBehind.on("mouseleave", mouseleave);


	function createBarExtension(d) {
		let target = d.target.__data__;
		if (d.target.__data__.row) {
			target = d.target.__data__.row
		}
		// console.log(d3.selectAll(".bardetail"))
		// if (d3.selectAll(".bardetail").size() >= 2) {
		// 	d3.select(".bardetail").remove();
		// }
		createBarChart(data, target, dimensions, x);
	}

	// Define drag behavior
	let drag = d3.drag()
	.on("start", function(event, d) { 
		dragstarted(event, d); 
	})
    .on("drag", function(event, d) {
		// Update data
		data = dragged(event, d, data, y);
		// Update the y-domain
		y = y.domain(data.rowNames);
		svg.select("g.axisright").remove()
		svg.append("g")
			.attr("class", "axisright")
			.call(d3.axisRight(y))
			.attr("transform", "translate(" + width + ",0)")

		// Update left bar
		renderLeftBar(data, dimensions, y);
	})
    .on("end", function(event, d) { 
		dragended(event, d, data, y); 
	})
	// .clickDistance(10)
	// .clickBehaviour(createBarExtension)


	// Apply drag behavior to rows
	// rowsBehind.call(drag).on("click", createBarExtension);
	rects.on("click", createBarExtension)//call(drag);
	// rects.call(drag).on("click", createBarExtension);

    return [x,y,colorRange];
}


// heatmap highlight
function addHighlight(y, currHeight) {
	d3.select(".highlight")
		.attr("visibility", "shown")
		.attr("y", y)
		.attr("height", currHeight)
		.raise()
}

function removeHighlight(event, d) {
	// makes sure the highlight stays when dragging
	if (event.defaultPrevented) {
		return;
	}

	d3.select(".highlight")
		.attr("visibility", "hidden")
}