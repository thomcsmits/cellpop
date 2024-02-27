import * as d3 from "d3";

import { getUpperBound } from "./util";

// add bar chart
export function createBarChart(dataFull, selectedRow, dimensions, x) {
    let width = dimensions.heatmap.width - dimensions.heatmap.margin.left - dimensions.heatmap.margin.right;
	let height = dimensions.heatmap.height - dimensions.heatmap.margin.top - dimensions.heatmap.margin.bottom;

    let nBars = 0;
    let heightInd = height;
    let svgBar = d3.selectAll('.bardetail')
    if (svgBar.size() === 0) {
        svgBar = d3.select('#app')
        .append("svg")
            .attr("width", dimensions.global.width)
            .attr("height", dimensions.detailBar.height + dimensions.detailBar.margin.top + dimensions.detailBar.margin.bottom)
            .attr("class", "bardetail");

        // X axis
        svgBar.append("g")
            .attr("transform", `translate(${eval(dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left)}, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")
                .style("font-size", dimensions.textSize.tick);

        svgBar.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left + width / 2)
            .attr("y", height + dimensions.heatmap.margin.bottom - 10)
            .text("Cell type")
            .style("font-size", dimensions.textSize.label);

        // Y axis label
        svgBar.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", - height / 2)
            .attr("y", (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left) / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of cells")
            .style("font-size", dimensions.textSize.label);
        
        nBars = 1;
    } else {
        nBars = d3.selectAll(".bardetailsample").size() + 1;
        heightInd = height / nBars;

        // make all existing ones smaller
        for (let i = 0; i < nBars-1; i++) {
            let sample_i = d3.select(`.sample-${i+1}`);
            sample_i.attr("transform",
                `translate(${eval(dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left)},${i * heightInd})`)
            let sample_i_rects = sample_i.select(".rects");
            sample_i_rects.attr("transform",
                `scale(${1},${1 / nBars})`);

            // todo: figure out how to get new domain to draw new axis
            let sample_i_y_axis = sample_i.select(".axisleft")
            sample_i_y_axis.attr("transform",
                `scale(${1},${1 / nBars})`);
        }
        
    }
   
    // create new chart
    let svgBarSample = svgBar.append("g")
        .attr("class", `bardetailsample sample-${nBars}`)
        .attr("transform",
            `translate(${eval(dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left)},${(nBars-1)*heightInd})`);

    const data = dataFull.countsMatrix.filter((o) => o.row === selectedRow)
    
    // console.log(svgBar)
    
    svgBarSample.append("text")
		.attr("class", "title")
		.attr("text-anchor", "start")
		.attr("x", 30)
        .attr("y", 50)
		.text(selectedRow)
        .style("font-size", dimensions.textSize.title);
        

    // Add Y axis
    let upperbound = getUpperBound(data.map(c => c.value));

    const y = d3.scaleLinear()
        .domain([0, upperbound])
        .range([ height, 0]);

    svgBarSample.append("g")
        .attr("class", "axisleft")
        .call(d3.axisLeft(y))
        .selectAll("text")
			.style("font-size", dimensions.textSize.tick);

    // Add bars
    svgBarSample.append("g")
        .attr("class", "rects")
        .selectAll()
        .data(data)
        .join("rect")
            .attr("x", d => x(d.col))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "#69b3a2")

    // Resize bars
    let sample = d3.selectAll(`.sample-${nBars}`)
    sample.select(".rects")
        .attr("transform",
            `scale(${1},${1 / nBars})`);
    sample.select(".axisleft")
        .attr("transform",
            `scale(${1},${1 / nBars})`);

    return svgBar;
}