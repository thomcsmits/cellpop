import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarTop, addTooltipBarTop, removeTooltipBarTop } from "./tooltips";
import { CellPopData, CellPopDimensions, CellPopThemeColors } from "../cellpop-schema";



export function renderTopViolin(data: CellPopData, dimensions: CellPopDimensions, x: d3.ScaleBand<string>, themeColors: CellPopThemeColors, fraction: boolean) {
    let countsMatrix = data.countsMatrix;
    if (fraction) {
		countsMatrix = data.countsMatrixFractions.row;
	}
	// Remove any prior barcharts and violin plots
	d3.select("g.bartop").remove();
    d3.select("g.violintop").remove();

	// Create svg element
	const svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + dimensions.barTop.offsetWidth + "," + dimensions.barTop.offsetHeight + ")")
			.attr("class", "violintop")

	// Get dimensions
	const width = dimensions.barTop.width - dimensions.barTop.margin.left - dimensions.barTop.margin.right;
	const height = dimensions.barTop.height - dimensions.barTop.margin.top - dimensions.barTop.margin.bottom;

	const upperbound = getUpperBound(countsMatrix.map(r => r.value));

    const x_changed = x.paddingInner(0.25);

    // const y = d3.scaleLinear()
    // .domain(d3.extent(countsMatrix, d => d.value)).nice()
    // .range([height - margin.bottom, margin.top])

	const y = d3.scaleLinear()
		.range([ height, 0 ])
		.domain([ 0, upperbound]);


    svg.append("g")
        .attr("class", "axisleft")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("font-size", dimensions.textSize.tick);
    // svg.append("g")
    //     .attr("class", "axisbottom")
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //         .style("font-size", dimensions.textSize.tick);

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -70)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Fraction of cells")
        .style("font-size", dimensions.textSize.labelSmall)
        .style("fill", themeColors.text);

    function kde(kernel: any, thds: number[]) {
        return V => thds.map(t => [t, d3.mean(V, d => kernel(t - d))]);
    }

    function epanechnikov(bandwidth: number) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    const bandwidth = 0.1;
    const thds = y.ticks(100);
    const density = kde(epanechnikov(bandwidth), thds);

    const violins = d3.rollup(countsMatrix, v => density(v.map(g => g.value)), d => d.col);

    let allNum = [] as number[];
    [...violins.values()].forEach((d,i) => allNum = allNum.concat([...violins.values()][i].map(d => d[1])));
    const xNum  = d3.scaleLinear()
        .domain([-d3.max(allNum), d3.max(allNum)])
        .range([0, x_changed.bandwidth()]);


    const area = d3.area()
        .x0(d => xNum(-d[1]))
        .x1(d => xNum(d[1]))
        .y(d => y(d[0]))
        .curve(d3.curveBumpY);

    svg.append("g")
        .selectAll("g")
        .data([...violins])
        .join("g")
            .attr("transform", d => `translate(${x_changed(d[0])}, 0)`)
            .append("path")
                .datum(d => d[1])
                .style("stroke", "none")
                .style("fill", themeColors.sideCharts)
                .attr("d", area);

}
