import * as d3 from "d3";

import { renderLeftBar } from "./barSide";
import { renderLeftViolin } from "./violinSide";
import { dragstarted, dragged, dragended } from "./drag";
import { defineTooltip, addTooltip, removeTooltip } from "./tooltips";
import { wrapRowNames } from "../dataLoading/dataWrangling";
import { getUpperBound } from "./util";


export function renderHeatmap(data, dimensions, fraction=false, themeColors) {
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


    // Add highlight
    svg.append("rect")
		.attr("class", "highlight")
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
        if (event.ctrlKey) {
			if (event.target.classList[0].includes('heatmap-rects')) {}
			addTooltip(event, d);
        } else {
        	addHighlight(event.target.y.animVal.value, event.target.height.animVal.value);
        }
    }
    const mouseleave = function(event, d) {
		removeTooltip();
        removeHighlight(event,d);
    }

	const contextmenu = function(event, d) {
		event.preventDefault();
		addContextMenu(event, d, data, dimensions, fraction, themeColors, y);
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
	let drag = d3.drag()
	.on("start", function(event, d) { 
		removeContextMenu();
		dragstarted(event, d); 
		allowClick = true;
	})
    .on("drag", function(event, d) {
		// Update data
		let dataAndClick = dragged(event, d, data, y, allowClick);
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
		renderLeftBar(data, dimensions, y, themeColors);
	})
    .on("end", function(event, d) { 
		dragended(event, d, data, dimensions, themeColors, x, y, allowClick); 
	})

	// Apply drag behavior to rows
	rowsBehind.call(drag)
	rects.call(drag)

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



// Add context menu
export function defineContextMenu() {
	d3.select("#cellpopvis")
		.append("div")
		.attr("class", "context-menu")
		.style("background-color", "#FFFFFF")
		.attr("opacity", 0)
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "5px")
		.attr("pointer-events", "none")
		.style("position", "absolute")
}


export function addContextMenu(event, d, data, dimensions, fraction, themeColors, y) {
	const menu = d3.select(".context-menu")
		.html(`Options:<br>`)
		.style("opacity", 1)
		.attr("visibility", "shown")
		.style("left", `${event.x + window.scrollX}px`)
		.style("top", `${event.y + window.scrollY}px`)
	const buttonMoveTop = menu.append("input")
		.attr("type", "button")
		.attr("name", "move-top")
		.attr("value", "move row to top")

	const buttonMoveBottom = menu.append("input")
		.attr("type", "button")
		.attr("name", "move-bottom")
		.attr("value", "remove row to bottom")

	const buttonRemove = menu.append("input")
		.attr("type", "button")
		.attr("name", "remove-button")
		.attr("value", "remove row")

	buttonMoveTop.on("click", function(r) {return moveRowTop(event, d, data, y, r)})
	buttonMoveBottom.on("click", function(r) {return moveRowBottom(event, d, data, y, r)})
	buttonRemove.on("click", function(r) {return removeRow(d, data, dimensions, fraction, themeColors)})
}

export function removeContextMenu() {
	d3.select(".context-menu")
		.html(``)
		.style("opacity", 0)
}

function moveRowTop(eventRect, dataRect, data, y, eventButton) {
	console.log('move row to top')
}

function moveRowBottom(eventRect, dataRect, data, y, eventButton) {
	console.log('move row to bottom')
}

function removeRow(dataRect, data, dimensions, fraction, themeColors) {
	let currentIndex = data.rowNames.indexOf(dataRect.row);
	data.rowNames.splice(currentIndex, 1);
	wrapRowNames(data);

	// re-render the heatmap
	let [x, y, colorRange] = renderHeatmap(data, dimensions, fraction, themeColors)

	// create side chart
	if (fraction) {
		// create left violin
		renderLeftViolin(data, dimensions, y, themeColors, fraction);
	} else {
		// create left barchart
		renderLeftBar(data, dimensions, y, themeColors);
	}
}

