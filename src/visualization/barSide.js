import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarSide, addTooltipBarSide, removeTooltipBarSide } from "./tooltips";

export function renderLeftBar(dataFull, dimensions, y) {
	// Remove any prior barcharts
	d3.select("g.barleft").remove();

	// Create svg element
	let svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + eval(dimensions.barLeft.offsetWidth + dimensions.barLeft.margin.left) + "," + eval(dimensions.barLeft.offsetHeight + dimensions.barLeft.margin.top) + ")")
			.attr("class", "barleft")

	// Get dimensions
	let width = dimensions.barLeft.width - dimensions.barLeft.margin.left - dimensions.barLeft.margin.right;
	let height = dimensions.barLeft.height - dimensions.barLeft.margin.top - dimensions.barLeft.margin.bottom;

	// Get accumulated data
	const data = []
	for (let i = 0; i < dataFull.rowNames.length; i++) {
		data.push({row: dataFull.rowNames[i], countTotal: Object.values(dataFull.counts[i]).reduce((a, b) => a + b, 0)})
	}

	// Determine upper bound
	let upperbound = getUpperBound(data.map(c => c.countTotal));

	// Add y-axis
	const x = d3.scaleLinear()
		.range([ width, 0 ])
		.domain([ 0, upperbound])

	const y_changed = y.padding(0.25)
	// console.log(y_changed)

	svg.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", "translate(0," + height + ")")
		.selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

    // // Bars
    let bars = svg.selectAll()
		.data(data)
		.join("rect")
			.attr("x", d => x(d.countTotal))
			.attr("y", d => y_changed(d.row))
			.attr("width", d => width - x(d.countTotal))
			.attr("height", y_changed.bandwidth())
			.attr("fill", "black")

		// console.log(svg)

	defineTooltipBarSide();

	// Define mouse functions
    const mouseover = function(event,d) {
        if (event.ctrlKey) {
			addTooltipBarSide(event, d);
        }
    }
    const mouseleave = function() {
		removeTooltipBarSide();
    }

	bars.on("mouseover", mouseover);
	bars.on("mouseleave", mouseleave);
		
}