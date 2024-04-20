import * as d3 from "d3";

import { dragstartedRows, draggedRows, dragendedRows, dragstartedCols, draggedCols, dragendedCols } from "./drag";
import { defineTooltip, addTooltip, removeTooltip } from "./tooltips";
import { resetRowNames, resetColNames } from "../dataLoading/dataWrangling";
import { defineContextMenu, addContextMenu, removeContextMenu } from "./contextMenu";
import { renderCellPopVisualizationLeft, renderCellPopVisualizationTop } from "./sides";
import { getUpperBound } from "./util";
import { CellPopData, CellPopDimensions, CellPopThemeColors, ColNamesWrapped, CountsMatrixValue, RowNamesWrapped } from "../cellpop-schema";


export function renderHeatmap(data: CellPopData, dimensions: CellPopDimensions, fraction=false, themeColors: CellPopThemeColors, metadataField: string, reset=false): [d3.ScaleBand<string>, d3.ScaleBand<string>, d3.ScaleLinear<string,number,never>] {
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
	const svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + dimensions.heatmap.offsetWidth + "," + dimensions.heatmap.offsetHeight + ")")
			.attr("class", "heatmap")


	// Get dimensions
	const width = dimensions.heatmap.width;
	const height = dimensions.heatmap.height;

	// Add x-axis
	let x: d3.ScaleBand<string> = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.colNames)
		.padding(0.01);

	svg.append("g")
		.attr("class", "axisbottom")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("class", "tickX")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end")
			.style("font-size", dimensions.textSize.ind.tickX)
			.style("fill", themeColors.text);

	svg.append("text")
        .attr("class", "labelX")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + dimensions.heatmap.margin.bottom - 10)
        .text("Cell type")
		.style("font-size", dimensions.textSize.ind.labelX)
		.style("fill", themeColors.text);


	// Add y-axis
	let y = d3.scaleBand<string>()
		.range([ height, 0 ])
		.domain(data.rowNames)
		.padding(0.01);

	svg.append("g")
		.attr("class", "axisright")
		.attr("transform", "translate(" + width + ",0)")
		.call(d3.axisRight(y))
		.selectAll("text")
			.attr("class", "tickY")
			.style("font-size", dimensions.textSize.ind.tickY)
			.style("fill", themeColors.text);

    svg.append("text")
		.attr("class", "labelY")
		.attr("text-anchor", "end")
		.attr("x", -height/2)
		.attr("y", width + 120)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Sample")
		.style("font-size", dimensions.textSize.ind.labelY)
		.style("fill", themeColors.text);

	// add metadata scale
	// let y_meta = d3.scaleOrdinal()
	// 	.domain(["right", "left"])
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
	const colorRange = d3.scaleLinear<string, number>()
		.range([themeColors.heatmapZero, themeColors.heatmapMax])
		.domain([0,getUpperBound(countsMatrix.map(r => r.value))]);

	renderHeatmapLegend(countsMatrix, dimensions, fraction, themeColors, colorRange);

	// Add rows and columns behind
	const colsBehind = svg.selectAll<SVGRectElement, ColNamesWrapped>(".heatmap-cols")
		.data(data.colNamesWrapped, function(d) {return d.col;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-cols")
			.attr("x", d => x(d.col))
			.attr("y", 0)
			.attr("width", x.bandwidth() )
			.attr("height", height )
			.style("fill", themeColors.heatmapGrid);


	const rowsBehind = svg.selectAll<SVGRectElement, RowNamesWrapped>(".heatmap-rows")
		.data(data.rowNamesWrapped, function(d) {return d.row;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-rows")
			.attr("x", 0)
			.attr("y", d => y(d.row))
			.attr("width", width )
			.attr("height", y.bandwidth() )
			.style("fill", themeColors.heatmapGrid);


	// Read the data
	const rects = svg.selectAll<SVGRectElement, CountsMatrixValue>(".heatmap-rects")
		.data(countsMatrix, function(d) {return d.row+":"+d.col;})
		.enter()
		.append("rect")
			.attr("class", "heatmap-rects")
			.attr("x", d => x(d.col))
			.attr("y", d => y(d.row))
			.attr("width", x.bandwidth() )
			.attr("height", y.bandwidth() )
			.style("fill", function(d) { return colorRange(d.value);} );


    // Add highlight for rows
    svg.append("rect")
		.attr("class", "highlight-rows")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.style("stroke", themeColors.heatmapHighlight)
		.style("fill", "none")
		.attr("pointer-events", "none")
		.attr("visibility", "hidden");

	// Add highlight for cols
    svg.append("rect")
		.attr("class", "highlight-cols")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.style("stroke", themeColors.heatmapHighlight)
		.style("fill", "none")
		.attr("pointer-events", "none")
		.attr("visibility", "hidden");

	defineTooltip();
	defineContextMenu();


	// Define mouse functions
    const mouseover = function(event: MouseEvent, d: CountsMatrixValue) {
		if (!(event.target) ||  !(event.target instanceof SVGRectElement)) {
			return;
		}
        if (event.ctrlKey) {
			if (event.target?.classList[0].includes("heatmap-rects")) {
				// remove?
			}
			addTooltip(event, d);
        }
		if (event.shiftKey) {
			addHighlightRow(event.target.y.animVal.value, event.target.height.animVal.value);
        }
		if (event.altKey) {
			addHighlightCol(event.target.x.animVal.value, event.target.width.animVal.value);
		}
    };
    const mouseleave = function(event: MouseEvent) {
		removeTooltip();
        removeHighlightRow(event);
		removeHighlightCol(event);
    };

	const contextmenu = function(event: MouseEvent, d: CountsMatrixValue) {
		event.preventDefault();
		addContextMenu(event, d, data, dimensions, fraction, themeColors, metadataField);
	};

    rects.on("mouseover", mouseover);
	// rowsBehind.on("mouseover", mouseover);
    rects.on("mouseleave", mouseleave);
	// rowsBehind.on("mouseleave", mouseleave);
	rects.on("contextmenu", contextmenu);
	// rowsBehind.on("contextmenu", contextmenu);

	// allowClick is a variable set to true at each dragstart
	// if no row is moved, it remains true, otherwise it's set to false
	// at dragend, if allowClick is true, a layered bar chart is created
	let allowClickRow: boolean;
	let allowClickCol: boolean;

	// Define drag behavior
	const drag = d3.drag<SVGRectElement, CountsMatrixValue>()
	.on("start", function(event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>, d: CountsMatrixValue) {
		// if (!(event.target) ||  !(event.target instanceof SVGRectElement)) {
		// 	return;
		// }
		removeContextMenu();
		if (event.sourceEvent.shiftKey) {
			dragstartedRows(event, d);
			allowClickRow = true;
		}
		if (event.sourceEvent.altKey) {
			dragstartedCols(event, d);
			allowClickCol = true;
		}
	})
    .on("drag", function(event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>, d: CountsMatrixValue) {
		// Rows
		if (event.sourceEvent.shiftKey) {
			// Update data
			const dataAndClick = draggedRows(event, d, data, y, allowClickRow);
			data = dataAndClick[0];
			allowClickRow = dataAndClick[1];

			// Update the y-domain
			y = y.domain(data.rowNames);

			svg.select("g.axisright").remove();

			svg.append("g")
				.attr("class", "axisright")
				.call(d3.axisRight(y))
				.attr("transform", "translate(" + width + ",0)")
				.selectAll("text")
					.style("font-size", dimensions.textSize.ind.tickY)
					.style("fill", themeColors.text);

			// Update left bar
			renderCellPopVisualizationLeft(data, dimensions, y, themeColors, fraction);
		}

		// Cols
		if (event.sourceEvent.altKey) {
			// Update data
			const dataAndClick = draggedCols(event, d, data, x, allowClickCol);
			data = dataAndClick[0];
			allowClickCol = dataAndClick[1];

			// Update the y-domain
			x = x.domain(data.colNames);

			svg.select("g.axisbottom").remove();

			svg.append("g")
				.attr("class", "axisbottom")
				.call(d3.axisBottom(x))
				.attr("transform", "translate(0," + height + ")")
				.selectAll("text")
					.attr("transform", "translate(-10,0)rotate(-45)")
					.style("text-anchor", "end")
					.style("font-size", dimensions.textSize.ind.tickX)
					.style("fill", themeColors.text);

			// Update top bar
			renderCellPopVisualizationTop(data, dimensions, x, themeColors, fraction);
		}

	})
    .on("end", function(event: d3.D3DragEvent<SVGRectElement, CountsMatrixValue, d3.SubjectPosition>, d: CountsMatrixValue) {
		// todo: case when key is lifted before the click

		if (event.sourceEvent.shiftKey) {
			dragendedRows(event, d, data, dimensions, themeColors, x, y, allowClickRow);
		}

		if (event.sourceEvent.altKey) {
			dragendedCols(event, d, data, dimensions, themeColors, x, y, allowClickCol);
		}
	});

	// Apply drag behavior to rects
	rects.call(drag);

    return [x,y,colorRange];
}


// heatmap highlight
function addHighlightRow(y: number, currHeight: number) {
	d3.select(".highlight-rows")
		.attr("visibility", "shown")
		.attr("y", y)
		.attr("height", currHeight)
		.raise();
}

function removeHighlightRow(event: MouseEvent) {
	// makes sure the highlight stays when dragging
	if (event.defaultPrevented) {
		return;
	}

	d3.select(".highlight-rows")
		.attr("visibility", "hidden");
}

// heatmap highlight
function addHighlightCol(x: number, currWidth: number) {
	d3.select(".highlight-cols")
		.attr("visibility", "shown")
		.attr("x", x)
		.attr("width", currWidth)
		.raise();
}

function removeHighlightCol(event: MouseEvent) {
	// makes sure the highlight stays when dragging
	if (event.defaultPrevented) {
		return;
	}

	d3.select(".highlight-cols")
		.attr("visibility", "hidden");
}

export function resetData(data: CellPopData) {
	resetRowNames(data);
	resetColNames(data);
}


function renderHeatmapLegend(countsMatrix: CountsMatrixValue[], dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, colorRange: d3.ScaleLinear<string, number>) {
	d3.select("g.axiscolor").remove();
	const gradient = d3.select("g.main")
		.append("g")
		.attr("transform", 
			"translate(" + dimensions.heatmapLegend.offsetWidth + "," + dimensions.heatmapLegend.offsetHeight + ")")
		.attr("class", "axiscolor")

	const width = dimensions.heatmapLegend.width;
	const height = 10;

	const colorAxisSize = 100;
	const colorAxisSteps = 100;
	const colorAxisWidth = width / 2;
	const colorAxisOffsetWidth = width / 4;

	for (let i = 0; i < colorAxisSteps; i++) {
		const color = colorRange(i * getUpperBound(countsMatrix.map(r => r.value)) / colorAxisSteps);
		gradient.append("rect")
			.attr("class", "colorlabelrect")
			.attr("x", colorAxisOffsetWidth)
			.attr("y", colorAxisSize - i * colorAxisSize / colorAxisSteps)
			.attr("width", colorAxisWidth)
			.attr("height", colorAxisSize / colorAxisSteps)
			.style("fill", color)
	}

	const colorAxisLabel = fraction ? 'Fraction' : 'Count'; 
	gradient.append("text")
		.attr("class", "labelColor")
		.attr("y", -10)
		.text(colorAxisLabel)
		.style("font-size", dimensions.textSize.ind.labelColor)
		.style("fill", themeColors.text);

	gradient.append("text")
		.attr("class", "tickColor")
		.attr("x", colorAxisOffsetWidth + colorAxisWidth)
		.attr("y", colorAxisSize)
		.text(0)
		.style("font-size", dimensions.textSize.ind.tickColor)
		.style("fill", themeColors.text);

	gradient.append("text")
		.attr("class", "tickColor")
		.attr("x", colorAxisOffsetWidth + colorAxisWidth)
		.attr("y", 0)
		.text(getUpperBound(countsMatrix.map(r => r.value)))
		.style("font-size", dimensions.textSize.ind.tickColor)
		.style("fill", themeColors.text);
}

// function sizeLabels(dimensions: CellPopDimensions) {


// }



// function resizeLabels(dimensions: CellPopDimensions) {
//     // select text from right axis
//     const axisrightText = d3.select(".axisright").selectAll("text");
//     // calculate the maximum size of the labels
//     const axisrightTextMaxWidth = d3.max(axisrightText.nodes(), n => (n as SVGTextElement).getComputedTextLength());

//     // if the labels are larger than the margin space, resize
//     if (axisrightTextMaxWidth > dimensions.heatmap.margin.right) {
//         // todo: resize properly
//         axisrightText.style("font-size", 5);
//     }
    

//     // select text from bottom axis
//     const axisbottomText = d3.select(".axisbottom").selectAll("text");
//     // calculate the maximum size of the labels
//     const axisbottomTextMaxWidth = d3.max(axisbottomText.nodes(), n => (n as SVGTextElement).getComputedTextLength());

//     // if the labels are larger than the margin space, resize
//     if (axisbottomTextMaxWidth > dimensions.heatmap.margin.bottom) {
//         axisbottomText.style("font-size", 5);
//     }
// }