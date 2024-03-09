import * as d3 from "d3";

import { renderHeatmap } from "./heatmap";
import { renderTopBar, renderTopViolin } from "./barTop";
import { renderLeftBar } from "./barSide";
import { renderGraph } from "./graph";
import { getPossibleMetadataSelections, sortByMetadata } from "./metadata";

// visualization
export function getMainVis(data) {
	console.log('data', data);
	const app = document.getElementById('app');

	// set the dimensions of the graph
	let widthRatio = 0.9;
	let heightRatio = 0.8; 

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
		heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 200, bottom: 100, left: 0}},
		barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
		barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
		graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
		detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
		textSize: {title: '20px', label: '30px', tick: '10px'}
		// barLeft: {offsetWidth: 100, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 50, right: 0, bottom: 0, left: 100}},
	};
	
	// var dimensionsHeatmap = {width: widthRight, height: heightBottom, margin: {top: 50, right: 50, bottom: 50, left: 50}}
	// var marginHeatmap = {top: 100, right: 100, bottom: 100, left: 150};

	// add a (temporary) button for switch between % and n
	let buttonFractionOn = document.createElement('button');
	buttonFractionOn.textContent = 'Change to fraction';
	app.appendChild(buttonFractionOn);
	buttonFractionOn.addEventListener('click', () => renderHeatmap(data, dimensions, true));

	let buttonFractionOff = document.createElement('button');
	buttonFractionOff.textContent = 'Change to absolute';
	app.appendChild(buttonFractionOff);
	buttonFractionOff.addEventListener('click', () => renderHeatmap(data, dimensions, false));

	// add a button for resetting the bottom thing
	let buttonReset = document.createElement('button');
	buttonReset.textContent = 'Reset stacked bar charts';
	app.appendChild(buttonReset);
	buttonReset.addEventListener('click', () => d3.selectAll('.bardetail').remove())

	// add a (temporary) button for metadata
	const rowsMetaOptionsShown = getPossibleMetadataSelections(data);

	let buttonMetadata = document.createElement('div');
	let buttonMetadataText = document.createElement('p');
	buttonMetadataText.innerText = "Group by metadata";
	buttonMetadata.appendChild(buttonMetadataText);
	for (const op of [['None', 0], ...rowsMetaOptionsShown]) {
		let label = document.createElement("label");
		label.innerText = op[0];
		let input = document.createElement("input");
		input.type = "radio";
		input.name = "meta";
		input.checked = false;
		label.appendChild(input);
		label.addEventListener('click', () => {
			if (op[0] !== 'None') {
				console.log(op[0])
			}
		})
		buttonMetadata.appendChild(label);
	}
	app.appendChild(buttonMetadata);

	// sortByMetadata(data, ['sex', ['Female', 'Male']])

	// add div for visualization
	let mainVis = document.createElement('div');
	mainVis.id = 'mainVis';
	app.appendChild(mainVis);

	// append the svg object to the body of the page
	let svg = d3.select("#mainVis")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("class", "main")
    
        
	// create main heatmap
	let [x, y, colorRange] = renderHeatmap(data, dimensions, false)

	// create top barchart
	renderTopBar(data, dimensions, x)

	// create left barchart
	renderLeftBar(data, dimensions, y)

	// // create graph
	// renderGraph(data, dimensions)

	// svg.attr("resize", "both")

	console.log(svg)

	return svg
}
