import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarSide, addTooltipBarSide, removeTooltipBarSide } from "./tooltips";
import { CellPopData, CellPopDimensions, CellPopThemeColors } from "../cellpop-schema";

export function renderLeftViolin(data: CellPopData, dimensions: CellPopDimensions, y: d3.ScaleBand<string>, themeColors: CellPopThemeColors, fraction: boolean) {
    let countsMatrix = data.countsMatrix;
	if (fraction) {
		countsMatrix = data.countsMatrixFractions.row;
	}
	// Remove any prior barcharts and violin plots
	d3.select("g.barleft").remove();
    d3.select("g.violinleft").remove();

	// Create svg element
	const svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + dimensions.barLeft.offsetWidth + "," + dimensions.barLeft.offsetHeight + ")")
			.attr("class", "violinleft");

	// Get dimensions
	const width = dimensions.barLeft.width - dimensions.barLeft.margin.left - dimensions.barLeft.margin.right;
	const height = dimensions.barLeft.height - dimensions.barLeft.margin.top - dimensions.barLeft.margin.bottom;

	// Determine upper bound
    const upperbound = getUpperBound(countsMatrix.map(r => r.value));

    const y_changed = y.paddingInner(0.25);

	// Add y-axis
	const x = d3.scaleLinear()
		.range([ width, 0 ])
		.domain([ 0, upperbound]);

	svg.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + (height + dimensions.barLeft.margin.bottom) + ")")
		.selectAll("text")
			.attr("class", "tickXSide")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end")
			.style("font-size", dimensions.textSize.ind.tickXSide)
			.style("fill", themeColors.text);

	svg.append("text")
		.attr("class", "labelXSide")
		.attr("text-anchor", "end")
		.attr("x", width - 50)
		.attr("y", 40)
		.attr("dy", ".75em")
		.attr("transform", "translate(0," + (height + dimensions.barLeft.margin.bottom) + ")")
		.text("Fraction of cells")
		.style("font-size", dimensions.textSize.ind.labelXSide)
		.style("fill", themeColors.text);

    function kde(kernel: any, thds: number[]) {
        return V => thds.map(t => [t, d3.mean(V, d => kernel(t - d))]);
    }

    function epanechnikov(bandwidth: number) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    const bandwidth = 0.1;
    const thds = x.ticks(100);
    const density = kde(epanechnikov(bandwidth), thds);

    const violins = d3.rollup(countsMatrix, v => density(v.map(g => g.value)), d => d.row);

    let allNum = [] as number[];
    [...violins.values()].forEach((d,i) => allNum = allNum.concat([...violins.values()][i].map(d => d[1])));
    const xNum  = d3.scaleLinear()
        .domain([-d3.max(allNum), d3.max(allNum)])
        .range([0, y_changed.bandwidth()]);

    const area = d3.area()
        .y0(d => xNum(-d[1]))
        .y1(d => xNum(d[1]))
        .x(d => x(d[0]))
        .curve(d3.curveBumpY);

    svg.append("g")
        .selectAll("g")
        .data([...violins])
        .join("g")
            .attr("transform", d => `translate(0, ${y_changed(d[0])})`)
        .append("path")
            .datum(d => d[1])
            .style("stroke", "none")
            .style("fill", themeColors.sideCharts)
            .attr("d", area);
}
