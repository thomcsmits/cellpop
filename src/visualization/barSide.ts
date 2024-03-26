import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarSide, addTooltipBarSide, removeTooltipBarSide } from "./tooltips";
import { CellPopData, CellPopDimensions, CellPopThemeColors, CountsTotalRowValue } from "../cellpop-schema";

export function renderLeftBar(dataFull: CellPopData, dimensions: CellPopDimensions, y: d3.ScaleBand<string>, themeColors: CellPopThemeColors) {
	// Remove any prior barcharts and violin plots
	d3.select("g.barleft").remove();
    d3.select("g.violinleft").remove();
	
	// Create svg element
	const svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + (dimensions.barLeft.offsetWidth + dimensions.barLeft.margin.left).toString() + "," + (dimensions.barLeft.offsetHeight + dimensions.barLeft.margin.top).toString() + ")")
			.attr("class", "barleft")

	// Get dimensions
	const width = dimensions.barLeft.width - dimensions.barLeft.margin.left - dimensions.barLeft.margin.right;
	const height = dimensions.barLeft.height - dimensions.barLeft.margin.top - dimensions.barLeft.margin.bottom;

	// Get accumulated data
	const data = [] as CountsTotalRowValue[];
	for (const row of dataFull.rowNames) {
		data.push({row: row, countTotal: dataFull.countsMatrix.filter(r => r.row === row).map(r => r.value).reduce((a, b) => a + b, 0)})
	}

	// Determine upper bound
	const upperbound = getUpperBound(data.map(c => c.countTotal));

	// Add y-axis
	const x = d3.scaleLinear()
		.range([ width, 0 ])
		.domain([ 0, upperbound])

	const y_changed = y.paddingInner(0.25)
	
	svg.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")")
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end")
			.style("font-size", dimensions.textSize.tick)
			.style("fill", themeColors.text);

	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width - 50)
		.attr("y", 40)
		.attr("dy", ".75em")
		.attr("transform", "translate(0," + height + ")")
		.text("Total number of cells")
		.style("font-size", dimensions.textSize.labelSmall)
		.style("fill", themeColors.text);

    // // Bars
    const bars = svg.selectAll()
		.data(data)
		.join("rect")
			.attr("x", d => x(d.countTotal))
			.attr("y", d => y_changed(d.row))
			.attr("width", d => width - x(d.countTotal))
			.attr("height", y_changed.bandwidth())
			.attr("fill", themeColors.sideCharts);

	defineTooltipBarSide();

	// Define mouse functions
    const mouseover = function(event: MouseEvent, d: CountsTotalRowValue) {
		const metadataRow = dataFull.metadata.rows.filter(r => r.row === d.row)[0].metadata;
        if (event.ctrlKey) {
			addTooltipBarSide(event, d, metadataRow);
        }
    }
    const mouseleave = function() {
		removeTooltipBarSide();
    }

	bars.on("mouseover", mouseover);
	bars.on("mouseleave", mouseleave);
		
}