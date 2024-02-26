import * as d3 from "d3";

import { getUpperBound } from "./util";

// add bar chart
export function createBarChart(dataFull, selectedRow, dimensions, x) {
    const data = dataFull.countsMatrix.filter((o) => o.row === selectedRow)
    
    let width = dimensions.heatmap.width - dimensions.heatmap.margin.left - dimensions.heatmap.margin.right;
	let height = dimensions.heatmap.height - dimensions.heatmap.margin.top - dimensions.heatmap.margin.bottom;

    let svgBar = d3.select("#app")
    .append("svg")
		.attr("width", dimensions.global.width)
		.attr("height", dimensions.detailBar.height + dimensions.detailBar.margin.top + dimensions.detailBar.margin.bottom)
        .attr("class", "bar")
    .append("g")
        .attr("transform",
            "translate(" + eval(dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left) + "," + eval(dimensions.detailBar.offsetHeight + dimensions.detailBar.margin.top) + ")");
    
    svgBar.append("text")
		.attr("class", "title")
		.attr("text-anchor", "start")
		.attr("x", 20)
		.text(selectedRow);
        

    // X axis
    svgBar.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

    svgBar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + dimensions.heatmap.margin.bottom - 10)
        .text("Cell type");


    // Add Y axis
    let upperbound = getUpperBound(data.map(c => c.value));

    const y = d3.scaleLinear()
    .domain([0, upperbound])
    .range([ height, 0]);
    svgBar.append("g")
    .call(d3.axisLeft(y));

    svgBar.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -30)
    .attr("y", -60)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Number of cells");

    // Bars
    svgBar.selectAll("mybar")
    .data(data)
    .join("rect")
        .attr("x", d => x(d.col))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#69b3a2")

    return svgBar;
}