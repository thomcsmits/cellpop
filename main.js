import * as d3 from "d3";
import { AnnDataSource, ObsSetsAnndataLoader } from '@vitessce/zarr';

// data
var uuids = ['ad693f99fb9006e68a53e97598da1509',
    '173de2e80adf6a73ac8cff5ccce20dfc',
	'b95f34761c252ebbd1e482cd9afae73f',
	'5a5ca03fa623602d9a859224aa40ace4',
	'3c1b10bc912c60c9afc36b7423695236',
	'1dc16eb0270ff73291dd45b6a96aa3c0',
	'b05c21f9c94ce1a22a9694cd0fe0291e',
	'8cdb42ed1194255c74c8462b99bbd7ef',
	'fe0ded5fc0355c95239f9c040dd31e99',
	'367fee3b40cba682063289505b922be1',
	'b99fc30c4195958fbef217fa9ed9ec8f',
	'898138b7f45a67c574e9955fb400e9be',
	'f220c9e7bcaea3a87162cbe61287ea4d',
	'e5f7a14d93659bd0b8dc2819ffa9bc4b',
	'56cbda4789f04d79c0c3dffe21816d48',
	'0b6f63f2bd61a8c091fc7afc0f318ad1',
	'62efbe0a6abd0bcf53ab9ab29e7cd73f',
	'4b62d9d2c248323ce029859f953fdc57',
	'c81b0dc9d16eb825a7d6bce6e1b3678f',
	'5ee240959c96b49d960702755478b9fc',
	'7c9e07c96d144536525b1f889acee14d',
	'dd7ccbc306692fc5ff5e61c22845da21',
	'9a7e6be288b27ddbd3366c4ae41bbcd2',
	'018a905cdbdff684760859f594d3fd77',
	'af5741dad7aecf7960a129c3d2ae642a',
	'6e1db473492095ccc2f1393d7259b9c0',
	'fae9a1f2e7abefca2203765a3c7a5ba1',
	'8d631eee88855ac59155edca2a3bc1ca',
	'1ea6c0ac5ba60fe35bf63af8699b6fbe']

// for dev purposes
uuids.splice(5)

// get hubmap url to zarr
function getURL(uuid) {
	return `https://assets.hubmapconsortium.org/${uuid}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`;
}
const urls = uuids.map(getURL);

// Get list of obssets
const obsSetsList = [];
for (let i = 0; i < urls.length; i++) { 
    const url = urls[i]
    const source = new AnnDataSource({ url });
    const config = {
        url,
        fileType: 'obsSets.anndata.zarr',
        options: [
            {
                name: 'Cell Ontology Annotation',
                path: 'obs/predicted_CLID' //'obs/predicted_label'
            }
        ],
    };
    const loader = new ObsSetsAnndataLoader(source, config);
    const { data: { obsSets } } = await loader.load();
    obsSetsList.push(obsSets);
}
console.log('obssets', obsSetsList)


function wrangleData(obsSetsList, urls, rowNames) {
	// get the actual data
	const obsSetsListChildren = obsSetsList.map((o) => o.tree[0].children);
	const obsSetsListChildrenCounts = obsSetsListChildren.map(getCountsPerType);

	// get a list of all types
	const allTypes = [...new Set(obsSetsListChildrenCounts.map(i => Object.keys(i)).flat())].sort();

	// const matrix = obsSetsListChildrenCounts.map((o) => getMatrixColumn(o, allTypes));

	const obsSetsListChildrenCountsMatrix = [];
	for (let i = 0; i < urls.length; i++) {
		const sampleName = uuids[i];
		for (const [key, value] of Object.entries(obsSetsListChildrenCounts[i])) {
			const cellID = key;
			obsSetsListChildrenCountsMatrix.push({row: sampleName, col: cellID, value: value});
		}
	}
  	return {counts: obsSetsListChildrenCounts, countsMatrix: obsSetsListChildrenCountsMatrix, colNames: allTypes, rowNames: rowNames, obsSetsList: obsSetsList};
}


// // get the matrix column for each entry
// function getMatrixColumn(o, allTypes) {
//   const matrixColumn = new Array(allTypes.length).fill(0);
//   for (const [key, value] of Object.entries(o)) {
//       let index = allTypes.indexOf(key)
//       matrixColumn[index] = value;
//   }
//   return matrixColumn;
// }

// get the counts per cell type
function getCountsPerType(o) {
	let dict = new Object();
	for(const t of o) {
		dict[t.name] = t.set.length;
	}
	return dict;
}

let data = wrangleData(obsSetsList, urls, uuids);
console.log('data', data)

let svg = getMainVis(data);


// // visualization
function getMainVis(data) {
	// set the of the graph

	let widthRatio = 0.9;
	let heightRatio = 0.6; 

	console.log(data.colNames)
	let widthRight = data.colNames.length * 25;
	let heightBottom =  data.rowNames.length * 40;

	let width = widthRight / widthRatio;
	let height = heightBottom / heightRatio;

	let widthLeft = width - widthRight;
	let heightTop = height - heightBottom;

	// let widthFull = 800;
	// let heightFull = 800;
	// let widthLeft = 200;
	// let widthRight = 600;
	// let heightTop = 200;
	// let heightBottom = 600;

	// let height = heightFull;
	// let width = widthFull;

	// var width = data.countsMatrix.length * 5;
	// var height = data.counts.length * 20;
	// var margin = {top: 100, right: 100, bottom: 100, left: 150};
	let dimensions = {
		global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
		heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 50, bottom: 100, left: 0}},
		barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
		barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
		detailBar: {offsetWidth: 0, offsetHeight: 0, width: width / 2, height: height, margin: {top: 50, right: 50, bottom: 50, left: 100}},
		// barLeft: {offsetWidth: 100, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 50, right: 0, bottom: 0, left: 100}},
	};
	
	// var dimensionsHeatmap = {width: widthRight, height: heightBottom, margin: {top: 50, right: 50, bottom: 50, left: 50}}
	// var marginHeatmap = {top: 100, right: 100, bottom: 100, left: 150};

	// append the svg object to the body of the page
	let svg = d3.select("#app")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		// .attr("transform",
		// 	"translate(" + margin.left + "," + margin.top + ")")
		.attr("class", "main")


	// create main heatmap
	let svgHeatmap = svg.append("g")
    .attr("transform",
        "translate(" + eval(dimensions.heatmap.offsetWidth + dimensions.heatmap.margin.left) + "," + eval(dimensions.heatmap.offsetHeight + dimensions.heatmap.margin.top) + ")")
    .attr("class", "heatmap")

	let [x, y, colorRange] = renderHeatmap(svgHeatmap, data, dimensions)

	// create top barchart
	let svgBarTop = svg.append("g")
		.attr("transform",
			"translate(" + eval(dimensions.barTop.offsetWidth + dimensions.barTop.margin.left) + "," + eval(dimensions.barTop.offsetHeight + dimensions.barTop.margin.top) + ")")
		.attr("class", "bartop")

	renderTopBar(svgBarTop, data, dimensions, x)

	// create left barchart
	let svgBarLeft = svg.append("g")
		.attr("transform",
			"translate(" + eval(dimensions.barLeft.offsetWidth + dimensions.barLeft.margin.left) + "," + eval(dimensions.barLeft.offsetHeight + dimensions.barLeft.margin.top) + ")") //rotate(90)")
		// .attr("transform", 
		// 	"rotate(90)")
		.attr("class", "barleft")

	renderLeftBar(svgBarLeft, data, dimensions, y)
	// svgBarLeft.append('rect')
	// 	.attr('x', 0)
	// 	.attr('y', 0)
	// 	.attr('width', dimensions.barLeft.width - dimensions.barLeft.margin.left - dimensions.barLeft.margin.right)
	// 	.attr('height', dimensions.barLeft.height - dimensions.barLeft.margin.top - dimensions.barLeft.margin.bottom)
	// 	.attr('stroke', 'blue')
	// 	.attr('fill', 'blue')

	// let svgBarcharts = svg.append("g")
	// 	.attr("transform",
	// 		"translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")
	// 	.attr("class", "barextends");
	
	console.log('svg here', svg)
	return svg
}

function renderHeatmap(svg, data, dimensions) {
	let width = dimensions.heatmap.width - dimensions.heatmap.margin.left - dimensions.heatmap.margin.right;
	let height = dimensions.heatmap.height - dimensions.heatmap.margin.top - dimensions.heatmap.margin.bottom;

	// Add x-axis
	let x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.colNames)
		.padding(0.01);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + dimensions.heatmap.margin.bottom - 10)
        .text("Cell type");


	// Add y-axis
	let y = d3.scaleBand()
		.range([ height, 0 ])
		.domain(data.rowNames)
		.padding(0.01);

	svg.append("g")
		.call(d3.axisRight(y))
		.attr("transform", "translate(" + width + ",0)")
		//.style("text-anchor", "end");

    svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr('x', -30)
		.attr("y", -200)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Samples");

	// Add color
	let colorRange = d3.scaleLinear()
		.range(["white", "#69b3a2"])
		.domain([0,2000])


	//Read the data
	let rects = svg.selectAll()
		.data(data.countsMatrix, function(d) {return d.row+':'+d.col;})
		.enter()
		.append("rect")
			.attr("x", function(d) { return x(d.col) })
			.attr("y", function(d) { return y(d.row) })
			.attr("width", x.bandwidth() )
			.attr("height", y.bandwidth() )
			.style("fill", function(d) { return colorRange(d.value)} )

    // highlight
    svg.append('rect')
		.attr("class", "highlight")
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', width)
		.attr('height', height)
		.attr('stroke', 'black')
		.attr('fill', 'none')
		.attr('pointer-events', 'none')
		.attr('visibility', 'hidden')


    // create a tooltip
    // const tooltip = svg
    //   .append("text")
    //   // .style("opacity", 0)
    //   .attr("class", "tooltip")
    //   .style("background-color", "white")
    //   .style("border", "solid")
    //   .text('yay<br>yay2')
    //   // .html('<p>yay</p>')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   // .attr('width', 100)
    //   // .attr('height', 100)
    //   // .style("z-index", "10")
    //   .style("border-width", "2px")
    //   .style("border-radius", "5px")
    //   .style("padding", "5px")
    //   .attr('pointer-events', 'none')
    //   // .attr('visibility', 'hidden')
    //   // .style('left', '200px')

    // create a tooltip
    const tooltip = d3.select("#app")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "white")
		.style("border", "solid")
		// .style("z-index", "10")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "5px")
		.attr('pointer-events', 'none')
		.attr('visibility', 'hidden')
		.style('left', '200px')


    const mouseover = function(event,d) {
        if (event.ctrlKey) {
        tooltip
            .html(`Row: ${d.row}<br>Column: ${d.col}<br>Value: ${d.value}`)
            .style("opacity", 1)
            // .style("left", (event.x)/2 + "px")
            // .style("top", (event.y)/2 + "px")
        } else {
        addHighlight(event.target.y.animVal.value, event.target.height.animVal.value);
        }
    }
    const mouseleave = function(d) {
        tooltip.style("opacity", 0)
        removeHighlight();
    }

    rects.on('mouseover', mouseover)
    rects.on('mouseleave', mouseleave)


    function addHighlight(y, currHeight) {
        svg.selectAll('.highlight')
            .attr('visibility', 'shown')
            .attr('y', y)
            .attr('height', currHeight)
    }

    function removeHighlight() {
        svg.selectAll('.highlight')
            .attr('visibility', 'hidden')
    }


    function addTooltip(x, y, text) {
        svg.selectAll('.tooltip')
        .attr('x', 0)
        .attr('y',0)
        .text('hello')
        .attr('visibility', 'shown')
    }

    function removeTooltip() {
    svg.selectAll('.tooltip')
    .attr('visibility', 'hidden')
    }

    rects.on('click', function(d) {
    console.log(d)
    console.log(d.target.__data__.row)
    console.log(d3.selectAll(".bar").size())
    if (d3.selectAll(".bar").size() >= 2) {
        d3.select(".bar").remove();
    }
    createBarChart(data, d.target.__data__.row, dimensions)
    // d3.select(this)
    })

    return [x,y,colorRange];
}


// add bar chart

function createBarChart(dataFull, selectedRow, dimensions) {
    const data = dataFull.countsMatrix.filter((o) => o.row === selectedRow)
    
    const width = 250
    const height = 150

    let svgBar = d3.select("#app")
    .append("svg")
        // .attr("width", width + dimensions.margin.left + dimensions.margin.right)
        // .attr("height", height + dimensions.margin.top + dimensions.margin.bottom)
		.attr("width", dimensions.detailBar.width + dimensions.detailBar.margin.left + dimensions.detailBar.margin.right)
		.attr("height", dimensions.detailBar.height + dimensions.detailBar.margin.top + dimensions.detailBar.margin.bottom)
        .attr("class", "bar")
    .append("g")
        .attr("transform",
            "translate(" + dimensions.detailBar.margin.left + "," + dimensions.detailBar.margin.top + ")");
			// "translate(" + 10 + "," +10 + ")");
    
    svgBar.append("text")
		.attr("class", "title")
		.attr("text-anchor", "start")
		.attr("x", 20)
		.text(selectedRow);
        

    // X axis
    const x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.map(d => d.col))
		.padding(0.2);
		svgBar.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

    svgBar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 10)
        .attr("y", height + 75)
        .text("Cell type");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height, 0]);
    svgBar.append("g")
    .call(d3.axisLeft(y));

    svgBar.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr('x', -30)
    .attr("y", -60)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Number of cells");

    // Bars
    svgBar.selectAll("mybar")
    .data(data)
    .join("rect")
        .attr("x", d => x(d.col))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#69b3a2")

    return svg
}
console.log('svg', svg)


/**
 * Find the upper bound for the axis for an array with values.
 * arr: array with values
 * Returns the first 5- or 1- value that is higher
 * E.g. if the max value is 97, it returns 100. If the max value is 147, it returns 500.
 */
function getUpperBound(arr) {
	const maxValue = Math.max(...arr);
	const lengthValue = maxValue.toString().length;
	const bound10 = Math.pow(10, lengthValue);
	const bound5 = bound10 / 2;
	const bound25 = bound5 /2;
	if (maxValue < bound25) {
		return bound25
	}
	if (maxValue < bound5) {
		return bound5;
	}
	return bound10;
}




function renderTopBar(svg, dataFull, dimensions, x) {
	let width = dimensions.barTop.width - dimensions.barTop.margin.left - dimensions.barTop.margin.right;
	let height = dimensions.barTop.height - dimensions.barTop.margin.top - dimensions.barTop.margin.bottom;

	const data = []
	for (const col of dataFull.colNames) {
		data.push({col: col, countTotal: dataFull.countsMatrix.filter(r => r.col === col).map(r => r.value).reduce((a, b) => a + b, 0)})
	}
	// console.log(data)
	// console.log('here', data)

	let upperbound = getUpperBound(data.map(c => c.countTotal));

	// import x-axis
	// const x = eval(axes.x);
	
	// Add y-axis
	const y = d3.scaleLinear()
		.range([ height, 0 ])
		.domain([ 0, upperbound])

	svg.append("g")
		.call(d3.axisLeft(y));

    // svg.append("text")
	// 	.attr("class", "y label")
	// 	.attr("text-anchor", "end")
	// 	.attr('x', 0)
	// 	.attr("y", -60)
	// 	.attr("dy", ".75em")
	// 	.attr("transform", "rotate(-90)")
	// 	.text("Total number of cells");

    // Bars
    svg.selectAll("mybar")
		.data(data)
		.join("rect")
			.attr("x", d => x(d.col))
			.attr("y", d => y(d.countTotal))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.countTotal))
			.attr("fill", "black")

	// console.log('made it')	
		
    // return svg


}


function renderLeftBar(svg, dataFull, dimensions, y) {
	let width = dimensions.barLeft.width - dimensions.barLeft.margin.left - dimensions.barLeft.margin.right;
	let height = dimensions.barLeft.height - dimensions.barLeft.margin.top - dimensions.barLeft.margin.bottom;

	const data = []
	for (let i = 0; i < dataFull.rowNames.length; i++) {
		data.push({row: dataFull.rowNames[i], countTotal: Object.values(dataFull.counts[i]).reduce((a, b) => a + b, 0)})
	}

	let upperbound = getUpperBound(data.map(c => c.countTotal));

	// Add y-axis
	const x = d3.scaleLinear()
		.range([ width, 0 ])
		.domain([ 0, upperbound])

	const y_changed = y//.padding(0.25)
	console.log(y_changed)

	svg.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")")
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

    // // Bars
    svg.selectAll("mybar")
		.data(data)
		.join("rect")
			.attr("x", d => x(d.countTotal))
			.attr("y", d => y_changed(d.row))
			.attr("width", d => width - x(d.countTotal))
			.attr("height", y_changed.bandwidth())
			.attr("fill", "black")
		
}