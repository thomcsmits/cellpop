import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarTop, addTooltipBarTop, removeTooltipBarTop } from "./tooltips";
import { CellPopData, CellPopDimensions, CellPopThemeColors, CountsTotalColValue } from "../cellpop-schema";

export function renderTopBar(dataFull: CellPopData, dimensions: CellPopDimensions, x: d3.ScaleBand<string>, themeColors: CellPopThemeColors) {
	// Remove any prior barcharts and violin plots
	d3.select("g.bartop").remove();
    d3.select("g.violintop").remove();

	// Create svg element
	const svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + dimensions.barTop.offsetWidth + "," + dimensions.barTop.offsetHeight + ")")
			.attr("class", "bartop");

	// Get dimensions
	const width = dimensions.barTop.width;
	const height = dimensions.barTop.height;

	const data = [] as CountsTotalColValue[];
	for (const col of dataFull.colNames) {
		data.push({col: col, countTotal: dataFull.countsMatrix.filter(r => r.col === col).map(r => r.value).reduce((a, b) => a + b, 0)});
	}

	const upperbound = getUpperBound(data.map(c => c.countTotal));

	// import x-axis
	// const x = eval(axes.x);

	// Add y-axis
	const y = d3.scaleLinear()
		.range([ height, 0 ])
		.domain([ 0, upperbound]);

	svg.append("g")
		.attr("class", "axisleft")
		.call(d3.axisLeft(y))
		.selectAll("text")
			.attr("class", "tickYSide")
			.style("font-size", dimensions.textSize.ind.tickYSide)
			.style("fill", themeColors.text);


	const x_changed = x.paddingInner(0.25);

    svg.append("text")
		.attr("class", "labelYSide")
		.attr("text-anchor", "end")
		.attr("x", 30)
		.attr("y", -70)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Total number of cells")
		.style("font-size", dimensions.textSize.ind.labelYSide)
		.style("fill", themeColors.text);

    // Bars
    const bars = svg.selectAll()
		.data(data)
		.join("rect")
			.attr("x", d => x_changed(d.col))
			.attr("y", d => y(d.countTotal))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.countTotal))
			.attr("fill", themeColors.sideCharts);

	defineTooltipBarTop();

	// Define mouse functions
    const mouseover = function(event: MouseEvent, d: CountsTotalColValue) {
		const metadataCol = dataFull.metadata.cols.filter(r => r.col === d.col)[0].metadata;
        if (event.ctrlKey) {
			addTooltipBarTop(event, d, metadataCol);
        }
    };
    const mouseleave = function() {
		removeTooltipBarTop();
    };

	bars.on("mouseover", mouseover);
	bars.on("mouseleave", mouseleave);

}
