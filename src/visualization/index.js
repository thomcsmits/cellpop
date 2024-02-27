import * as d3 from "d3";

import { renderHeatmap } from "./heatmap";
import { renderTopBar } from "./barTop";
import { renderLeftBar } from "./barSide";
import { renderGraph } from "./graph";

// visualization
export function getMainVis(data) {
	// set the dimensions of the graph
	let widthRatio = 0.9;
	let heightRatio = 0.6; 

	let widthRight = data.colNames.length * 25;
	let heightBottom =  data.rowNames.length * 40;

	let width = widthRight / widthRatio;
	let height = heightBottom / heightRatio;

	let widthLeft = width - widthRight;
	let heightTop = height - heightBottom;

	// height = height + 400;

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
		graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 0, bottom: 0, left: 0}},
		detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 50, bottom: 50, left: 0}},
		textSize: {title: '20px', label: '30px', tick: '10px'}
		// barLeft: {offsetWidth: 100, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 50, right: 0, bottom: 0, left: 100}},
	};
	
	// var dimensionsHeatmap = {width: widthRight, height: heightBottom, margin: {top: 50, right: 50, bottom: 50, left: 50}}
	// var marginHeatmap = {top: 100, right: 100, bottom: 100, left: 150};

	// add a (temporary) button for switch between % and n
	let buttonFraction = document.createElement('button');
	buttonFraction.textContent = 'Change fraction/absolute';
	document.body.appendChild(buttonFraction);
	buttonFraction.addEventListener('click', () => alert('hi'))

	// add a button for resetting the bottom thing
	let buttonReset = document.createElement('button');
	buttonReset.textContent = 'Reset stacked bar charts';
	document.body.appendChild(buttonReset);
	buttonReset.addEventListener('click', () => d3.selectAll('.bardetail').remove())

	// append the svg object to the body of the page
	let svg = d3.select("#app")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("class", "main")
    
        
	// create main heatmap
	let [x, y, colorRange] = renderHeatmap(data, dimensions)

	// create top barchart
	renderTopBar(data, dimensions, x)

	// create left barchart
	renderLeftBar(data, dimensions, y)

	// // create graph
	// renderGraph(data, dimensions)

	svg.attr("resize", "both")

	console.log(svg)

	return svg
}
