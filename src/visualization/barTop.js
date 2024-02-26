import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarTop, addTooltipBarTop, removeTooltipBarTop } from "./tooltips";

export function renderTopBar(dataFull, dimensions, x) {
	// Remove any prior barcharts
	d3.select("g.bartop").remove();

	// Create svg element
	let svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + eval(dimensions.barTop.offsetWidth + dimensions.barTop.margin.left) + "," + eval(dimensions.barTop.offsetHeight + dimensions.barTop.margin.top) + ")")
			.attr("class", "bartop")

	// Get dimensions
	let width = dimensions.barTop.width - dimensions.barTop.margin.left - dimensions.barTop.margin.right;
	let height = dimensions.barTop.height - dimensions.barTop.margin.top - dimensions.barTop.margin.bottom;

	const data = []
	for (const col of dataFull.colNames) {
		data.push({col: col, countTotal: dataFull.countsMatrix.filter(r => r.col === col).map(r => r.value).reduce((a, b) => a + b, 0)})
	}
	// console.log(data)
	// console.log("here", data)

	let upperbound = getUpperBound(data.map(c => c.countTotal));

	// import x-axis
	// const x = eval(axes.x);
	
	// Add y-axis
	const y = d3.scaleLinear()
		.range([ height, 0 ])
		.domain([ 0, upperbound])

	svg.append("g")
		.call(d3.axisLeft(y));


	const x_changed = x.padding(0.25)

    // svg.append("text")
	// 	.attr("class", "y label")
	// 	.attr("text-anchor", "end")
	// 	.attr("x", 0)
	// 	.attr("y", -60)
	// 	.attr("dy", ".75em")
	// 	.attr("transform", "rotate(-90)")
	// 	.text("Total number of cells");

    // Bars
    let bars = svg.selectAll()
		.data(data)
		.join("rect")
			.attr("x", d => x_changed(d.col))
			.attr("y", d => y(d.countTotal))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.countTotal))
			.attr("fill", "black")

	defineTooltipBarTop();

	// Define mouse functions
    const mouseover = function(event,d) {
        if (event.ctrlKey) {
			addTooltipBarTop(event, d);
        }
    }
    const mouseleave = function() {
		removeTooltipBarTop();
    }

	bars.on("mouseover", mouseover);
	bars.on("mouseleave", mouseleave);

}
