import * as d3 from "d3";

import { getUpperBound } from "./util";

export function renderLeftBar(svg, dataFull, dimensions, y) {
	let width = dimensions.barLeft.width - dimensions.barLeft.margin.left - dimensions.barLeft.margin.right;
	let height = dimensions.barLeft.height - dimensions.barLeft.margin.top - dimensions.barLeft.margin.bottom;

	const data = []
	for (let i = 0; i < dataFull.rowNames.length; i++) {
		data.push({row: dataFull.rowNames[i], countTotal: Object.values(dataFull.counts[i]).reduce((a, b) => a + b, 0)})
	}

	let upperbound = getUpperBound(data.map(c => c.countTotal));

	// Add y-axis
	const x = d3.scaleLinear()
		.range([ width, 0 ])
		.domain([ 0, upperbound])

	const y_changed = y//.padding(0.25)
	console.log(y_changed)

	svg.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")")
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

    // // Bars
    svg.selectAll("mybar")
		.data(data)
		.join("rect")
			.attr("x", d => x(d.countTotal))
			.attr("y", d => y_changed(d.row))
			.attr("width", d => width - x(d.countTotal))
			.attr("height", y_changed.bandwidth())
			.attr("fill", "black")
		
}