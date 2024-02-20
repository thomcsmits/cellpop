import * as d3 from "d3";

import { getUpperBound } from "./util";

export function renderTopBar(svg, dataFull, dimensions, x) {
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

    // svg.append("text")
	// 	.attr("class", "y label")
	// 	.attr("text-anchor", "end")
	// 	.attr("x", 0)
	// 	.attr("y", -60)
	// 	.attr("dy", ".75em")
	// 	.attr("transform", "rotate(-90)")
	// 	.text("Total number of cells");

    // Bars
    svg.selectAll("mybar")
		.data(data)
		.join("rect")
			.attr("x", d => x(d.col))
			.attr("y", d => y(d.countTotal))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.countTotal))
			.attr("fill", "black")

	// console.log("made it")	
		
    // return svg


}
