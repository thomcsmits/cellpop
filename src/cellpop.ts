import * as d3 from "d3";

import { renderCellPopVisualization } from "./visualization";
import { getPossibleMetadataSelections, sortByMetadata } from "./visualization/metadata";
import { getTheme } from './visualization/theme';
import { CellPopData, CellPopDimensions, CellPopTheme } from "./cellpop-schema";

// visualization
export function getMainVis(data: CellPopData, dimensions?: CellPopDimensions, theme?: CellPopTheme, fraction?: false) {
	if (!dimensions) {
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
		dimensions = {
			global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
			heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 200, bottom: 100, left: 0}},
			barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
			violinTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
			barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
			violinLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
			graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
			detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
			textSize: {title: '20px', label: '30px', labelSmall: '25px', tick: '10px'}
			// barLeft: {offsetWidth: 100, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 50, right: 0, bottom: 0, left: 100}},
		};
		
		// var dimensionsHeatmap = {width: widthRight, height: heightBottom, margin: {top: 50, right: 50, bottom: 50, left: 50}}
		// var marginHeatmap = {top: 100, right: 100, bottom: 100, left: 150};
	}
	if (!theme) {
		theme = 'light';
	}
	if (!fraction) {
		fraction = false;
	}

	console.log('data', data);
	const app = document.getElementById('app');

	
	// add a (temporary) button for switch between % and n
	let buttonFractionOn = document.createElement('button');
	buttonFractionOn.textContent = 'Change to fraction';
	app.appendChild(buttonFractionOn);
	buttonFractionOn.addEventListener('click', () => renderCellPopVisualization(data, dimensions, true, themeColors));

	let buttonFractionOff = document.createElement('button');
	buttonFractionOff.textContent = 'Change to absolute';
	app.appendChild(buttonFractionOff);
	buttonFractionOff.addEventListener('click', () => renderCellPopVisualization(data, dimensions, false, themeColors));

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
		label.innerText = op[0] as string;
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
	let themeColors = getTheme(theme);

	// add div for visualization
	let mainVis = document.createElement('div');
	mainVis.id = 'cellpopvis';
	app.appendChild(mainVis);

	// append the svg object to the body of the page
	let svg = d3.select("#cellpopvis")
	.append("svg")
		.attr("width", dimensions.global.width)
		.attr("height", dimensions.global.height)
	.append("g")
		.attr("class", "main")
	
	// add background
	svg.append("rect")
		.attr("class", "background")
		.attr("width", dimensions.global.width)
		.attr("height", dimensions.global.height)
		.style("fill", themeColors.background);
     
	// create main CellPopVisualization
	renderCellPopVisualization(data, dimensions, fraction, themeColors);
	
	// svg.attr("resize", "both")

	console.log(svg)

	return svg
}
