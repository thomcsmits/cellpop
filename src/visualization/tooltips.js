import * as d3 from "d3";

// heatmap tooltip
export function addTooltip(event, d) {
	d3.select(".tooltip")
		.html(`Row: ${d.row}<br>Column: ${d.col}<br>Value: ${d.value}`)
		.style("opacity", 0.8)
		.attr("visibility", "shown")
		.style("left", (event.x) + "px")
		.style("top", (event.y) + "px")
}

export function removeTooltip() {
	d3.select(".tooltip")
		.html(``)
		.style("opacity", 0)
}

// function addTooltipXAxis(event, d) {
// 	d3.select(".tooltip-axis-x")
// 		.html(`Row: ${d}`)
// 		.style("opacity", 0.8)
// 		.attr("visibility", "shown")
// 		.style("left", (event.x) + "px")
// 		.style("top", (event.y) + "px")
// }


