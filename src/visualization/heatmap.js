import * as d3 from "d3";

import { renderLeftBar } from "./barSide";
import { renderLeftViolin } from "./violinSide";
import { dragstartedRows, draggedRows, dragendedRows, dragstartedCols, draggedCols, dragendedCols } from "./drag";
import { defineTooltip, addTooltip, removeTooltip } from "./tooltips";
import { resetRowNames, resetColNames } from "../dataLoading/dataWrangling";
import { defineContextMenu, addContextMenu, removeContextMenu } from "./contextMenu";
import { renderCellPopVisualizationLeft, renderCellPopVisualizationTop } from "./sides";
import { getUpperBound } from "./util";


export function renderHeatmap(data, dimensions, fraction=false, themeColors, metadataField, reset=false) {
	if (reset) {
		resetData(data);
	}

	let countsMatrix = data.countsMatrix;
	if (fraction) {
		countsMatrix = data.countsMatrixFractions.row;
	}
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
			.style("font-size", dimensions.textSize.tick)
			.style("fill", themeColors.text);

	svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + dimensions.heatmap.margin.bottom - 10)
        .text("Cell type")
		.style("font-size", dimensions.textSize.label)
		.style("fill", themeColors.text);


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
			.style("font-size", dimensions.textSize.tick)
			.style("fill", themeColors.text);

    svg.append("text")
		.attr("class", "y-label")
		.attr("text-anchor", "end")
		.attr("x", -height/2)
		.attr("y", width + 120)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Sample")
		.style("font-size", dimensions.textSize.label)
		.style("fill", themeColors.text);

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
	// 		.style("font-size", dimensions.textSize.tick)
	//		.style("fill", themeColors.text);

	// svg.append("text")
	// 	.attr("class", "y-label")
	// 	.attr("text-anchor", "end")
	// 	.attr("x", -height/2)
	// 	.attr("y", width + 150)
	// 	.attr("dy", ".75em")
	// 	.attr("transform", "rotate(-90)")
	// 	.text("Metadata")
	// 	.style("font-size", dimensions.textSize.label)
	//	.style("fill", themeColors.text);


	// Add color
	let colorRange = d3.scaleLinear()
		.range([themeColors.heatmapZero, themeColors.heatmapMax])
		.domain([0,getUpperBound(countsMatrix.map(r => r.value))])

	let gradient = svg.append("g")
		.attr("class", "axiscolor")
		.attr("transform", "translate(" + eval(width+150) + ",10)")

	let colorAxisSize = 100;
	let colorAxisSteps = 100;
	let colorAxisWidth = 100;

	console.log(gradient)
	for (let i = 0; i < colorAxisSteps; i++) {
		const color = colorRange(i * getUpperBound(countsMatrix.map(r => r.value)) / colorAxisSteps);
		gradient.append("rect")
			.attr("class", "colorlabelrect")
			.attr("x", 0)
			.attr("y", colorAxisSize - i * colorAxisSize / colorAxisSteps)
			.attr("width", colorAxisWidth * 0.9)
			.attr("height", colorAxisSize / colorAxisSteps)
			.attr("fill", color)
	}

	const colorAxisLabel = fraction ? 'Fraction' : 'Count'; 
	gradient.append("text")
		.attr("y", -10)
		.text(colorAxisLabel)
		.style("font-size", dimensions.textSize.label)
		.style("fill", themeColors.text);

	gradient.append("text")
		.attr("x", colorAxisWidth)
		.attr("y", colorAxisSize)
		.text(0)
		.style("font-size", dimensions.textSize.tick)
		.style("fill", themeColors.text);

	gradient.append("text")
		.attr("x", colorAxisWidth)
		.attr("y", 0)
		.text(getUpperBound(countsMatrix.map(r => r.value)))
		.style("font-size", dimensions.textSize.tick)
		.style("fill", themeColors.text);

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
			.style("fill", themeColors.heatmapGrid);


	let rowsBehind = svg.selectAll()
		.data(data.rowNamesWrapped, function(d) {return d.row;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-rows")
			.attr("x", 0)
			.attr("y", function(d) { return y(d.row) })
			.attr("width", width )
			.attr("height", y.bandwidth() )
			.style("fill", themeColors.heatmapGrid);


	// Read the data
	let rects = svg.selectAll()
		.data(countsMatrix, function(d) {return d.row+":"+d.col;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-rects")
			.attr("x", function(d) { return x(d.col) })
			.attr("y", function(d) { return y(d.row) })
			.attr("width", x.bandwidth() )
			.attr("height", y.bandwidth() )
			.style("fill", function(d) { return colorRange(d.value)} );


    // Add highlight for rows
    svg.append("rect")
		.attr("class", "highlight-rows")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("stroke", themeColors.heatmapHighlight)
		.attr("fill", "none")
		.attr("pointer-events", "none")
		.attr("visibility", "hidden")

	// Add highlight for cols
    svg.append("rect")
		.attr("class", "highlight-cols")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("stroke", themeColors.heatmapHighlight)
		.attr("fill", "none")
		.attr("pointer-events", "none")
		.attr("visibility", "hidden")

	defineTooltip();
	defineContextMenu();


	// Define mouse functions
    const mouseover = function(event, d) {
		// console.log(event)
        if (event.ctrlKey) {
			if (event.target.classList[0].includes('heatmap-rects')) {}
			addTooltip(event, d);
        } 
		if (event.shiftKey) {
        	addHighlightRow(event.target.y.animVal.value, event.target.height.animVal.value);
        }
		if (event.altKey) {
			addHighlightCol(event.target.x.animVal.value, event.target.width.animVal.value);
		}
    }
    const mouseleave = function(event, d) {
		removeTooltip();
        removeHighlightRow(event,d);
		removeHighlightCol(event,d);
    }

	const contextmenu = function(event, d) {
		event.preventDefault();
		addContextMenu(event, d, data, dimensions, fraction, themeColors, metadataField, y);
	}

    rects.on("mouseover", mouseover);
	rowsBehind.on("mouseover", mouseover);
    rects.on("mouseleave", mouseleave);
	rowsBehind.on("mouseleave", mouseleave);
	rects.on("contextmenu", contextmenu);
	rowsBehind.on("contextmenu", contextmenu);

	// allowClick is a variable set to true at each dragstart
	// if no row is moved, it remains true, otherwise it's set to false
	// at dragend, if allowClick is true, a layered bar chart is created
	let allowClick;

	// Define drag behavior
	let dragRows = d3.drag()
	.on("start", function(event, d) { 
		removeContextMenu();
		dragstartedRows(event, d); 
		allowClick = true;
	})
    .on("drag", function(event, d) {
		// Update data
		let dataAndClick = draggedRows(event, d, data, y, allowClick);
		data = dataAndClick[0];
		allowClick = dataAndClick[1];
		// Update the y-domain
		y = y.domain(data.rowNames);
		svg.select("g.axisright").remove()
		svg.append("g")
			.attr("class", "axisright")
			.call(d3.axisRight(y))
			.attr("transform", "translate(" + width + ",0)")
			.selectAll("text")
				.style("font-size", dimensions.textSize.tick)
				.style("fill", themeColors.text);

		// Update left bar
		renderCellPopVisualizationLeft(data, dimensions, y, themeColors, fraction);
	})
    .on("end", function(event, d) { 
		dragendedRows(event, d, data, dimensions, themeColors, x, y, allowClick); 
	})

	// Define drag behavior
	let dragCols = d3.drag()
	.on("start", function(event, d) { 
		removeContextMenu();
		dragstartedCols(event, d); 
		allowClick = true;
	})
    .on("drag", function(event, d) {
		// Update data
		let dataAndClick = draggedCols(event, d, data, x, allowClick);
		data = dataAndClick[0];
		allowClick = dataAndClick[1];
		// Update the y-domain
		x = x.domain(data.colNames);
		svg.select("g.axisbottom").remove()
		svg.append("g")
			.attr("class", "axisbottom")
			.call(d3.axisBottom(x))
			.attr("transform", "translate(0," + height + ")")
			.selectAll("text")
				.attr("transform", "translate(-10,0)rotate(-45)")
				.style("text-anchor", "end")
				.style("font-size", dimensions.textSize.tick)
				.style("fill", themeColors.text);

		// Update top bar
		renderCellPopVisualizationTop(data, dimensions, x, themeColors, fraction);
	})
    .on("end", function(event, d) { 
		dragendedCols(event, d, data, dimensions, themeColors, x, y, allowClick); 
	})

	// // Apply drag behavior to rows
	// rowsBehind.call(dragRows);
	// rects.call(dragRows);

	// Apply drag behavior to cols
	colsBehind.call(dragCols);
	rects.call(dragCols);

    return [x,y,colorRange];
}


// heatmap highlight
function addHighlightRow(y, currHeight) {
	d3.select(".highlight-rows")
		.attr("visibility", "shown")
		.attr("y", y)
		.attr("height", currHeight)
		.raise()
}

function removeHighlightRow(event, d) {
	// makes sure the highlight stays when dragging
	if (event.defaultPrevented) {
		return;
	}

	d3.select(".highlight-rows")
		.attr("visibility", "hidden")
}

// heatmap highlight
function addHighlightCol(x, currWidth) {
	d3.select(".highlight-cols")
		.attr("visibility", "shown")
		.attr("x", x)
		.attr("width", currWidth)
		.raise()
}

function removeHighlightCol(event, d) {
	// makes sure the highlight stays when dragging
	if (event.defaultPrevented) {
		return;
	}

	d3.select(".highlight-cols")
		.attr("visibility", "hidden")
}

export function resetData(data) {
	resetRowNames(data);
	resetColNames(data);
}
