import * as d3 from "d3";

// add bar chart

export function createBarChart(dataFull, selectedRow, dimensions) {
    const data = dataFull.countsMatrix.filter((o) => o.row === selectedRow)
    
    const width = 250
    const height = 150

    let svgBar = d3.select("#app")
    .append("svg")
        // .attr("width", width + dimensions.margin.left + dimensions.margin.right)
        // .attr("height", height + dimensions.margin.top + dimensions.margin.bottom)
		.attr("width", dimensions.detailBar.width + dimensions.detailBar.margin.left + dimensions.detailBar.margin.right)
		.attr("height", dimensions.detailBar.height + dimensions.detailBar.margin.top + dimensions.detailBar.margin.bottom)
        .attr("class", "bar")
    .append("g")
        .attr("transform",
            "translate(" + dimensions.detailBar.margin.left + "," + dimensions.detailBar.margin.top + ")");
			// "translate(" + 10 + "," +10 + ")");
    
    svgBar.append("text")
		.attr("class", "title")
		.attr("text-anchor", "start")
		.attr("x", 20)
		.text(selectedRow);
        

    // X axis
    const x = d3.scaleBand()
		.range([ 0, width ])
		.domain(data.map(d => d.col))
		.padding(0.2);
		svgBar.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

    svgBar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 10)
        .attr("y", height + 75)
        .text("Cell type");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 13000])
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

    return svg
}