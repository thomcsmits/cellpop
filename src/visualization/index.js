import * as d3 from "d3";

import { renderHeatmap } from "./heatmap";
import { renderTopBar } from "./barTop";
import { renderLeftBar } from "./barSide";

// visualization
export function getMainVis(data) {
    console.log("here")
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
	renderLeftBar(data, dimensions, y)

	
	console.log("svg here", svg)
	return svg
}
