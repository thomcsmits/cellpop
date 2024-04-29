import * as d3 from "d3";

import { getUpperBound } from "./util";
import { CellPopData, CellPopDimensions, CellPopThemeColors } from "../cellpop-schema";

// add bar chart
export function renderExtensionChart(data: CellPopData, dimensions: CellPopDimensions, themeColors: CellPopThemeColors, x: d3.ScaleBand<string>) {
    const width = dimensions.detailBar.width - dimensions.detailBar.margin.left - dimensions.detailBar.margin.right;
	const height = dimensions.detailBar.height - dimensions.detailBar.margin.top - dimensions.detailBar.margin.bottom;

    // remove anything on this svg
    d3.select(".extension").selectAll("*").remove();

    const svg = d3.select(".extension")
        .attr("width", dimensions.global.width.total)
        .attr("height", dimensions.global.width.total);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", dimensions.detailBar.width)
        .attr("height", dimensions.detailBar.height)
        .style("fill", themeColors.background);

    const svgBar = svg.append("g")
        .attr("class", "bars");

    // X axis
    svgBar.append("g")
        .attr("transform", "translate(" + (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left).toString() + "," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", dimensions.textSize.ind.tickX)
            .style("fill", themeColors.text);

    // X axis label
    const labelX = svgBar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left + width/2)
        .attr("y", height + dimensions.heatmap.margin.bottom - 10)
        .text("Cell type")
        .style("font-size", dimensions.textSize.ind.labelX)
        .style("fill", themeColors.text);

    // position label in center
	const labelXSize = labelX.node().getComputedTextLength();
	labelX.attr("x", dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left + width/2 + labelXSize/2 + 75);

    // Y axis label
    svgBar.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", - height / 2)
        .attr("y", (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left) / 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Number of cells")
        .style("font-size", dimensions.textSize.ind.labelY)
        .style("fill", themeColors.text);

    const nBars = data.extendedChart.rowNames.length;
    const heightInd = height / nBars;
    const heightMargin = heightInd / 10;

    for (let i = 0; i < nBars; i++) {
        const svgBarRow = svgBar.append("g")
            .attr("class", `bardetailsample row-${i}`)
            .attr("transform", "translate(" + (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left).toString() + "," + (i*heightInd + heightMargin).toString() + ")");

        const row = data.extendedChart.rowNames[i];
        const dataBar = data.countsMatrix.filter((o) => o.row === row);

        // Add label
        svgBarRow.append("text")
            .attr("class", "title")
            .attr("text-anchor", "start")
            .attr("x", 30)
            .attr("y", 50)
            .text(row)
            .style("font-size", dimensions.textSize.ind.title)
            .style("fill", themeColors.text);


        // Add Y axis
        const upperbound = getUpperBound(dataBar.map(c => c.value));

        const y = d3.scaleLinear()
            .domain([0, upperbound])
            .range([ heightInd - heightMargin, 0]);

        svgBarRow.append("g")
            .attr("class", "axisleft")
            .call(d3.axisLeft(y))
            .selectAll("text")
                .style("font-size", dimensions.textSize.ind.tickY)
                .style("fill", themeColors.text);

        // add color range for bars
        const colorRange = d3.scaleOrdinal<string, string>()
            .domain(data.extendedChart.colNames)
            .range(themeColors.extensionRange)
            .unknown(themeColors.extensionDefault);

        // Add bars
        svgBarRow.append("g")
            .attr("class", "rects")
            .selectAll()
            .data(dataBar)
            .join("rect")
                .attr("x", d => x(d.col))
                .attr("y", d => y(d.value))
                .attr("width", x.bandwidth())
                .attr("height", d => heightInd - heightMargin - y(d.value))
                .attr("fill", d => colorRange(d.col));
    }
}

// export function createBarChart(dataFull: CellPopData, selectedRow: string, dimensions: CellPopDimensions, x: d3.ScaleBand<string>, themeColors: CellPopThemeColors) {

//     const width = dimensions.heatmap.width - dimensions.heatmap.margin.left - dimensions.heatmap.margin.right;
// 	const height = dimensions.heatmap.height - dimensions.heatmap.margin.top - dimensions.heatmap.margin.bottom;

//     let nBars = 0;
//     let heightInd = height;
//     let svgBar = d3.selectAll(".bardetail");
//     if (svgBar.size() === 0) {
//         svgBar = d3.select("#app")
//         .append("svg")
//             .attr("width", dimensions.global.width)
//             .attr("height", dimensions.detailBar.height + dimensions.detailBar.margin.top + dimensions.detailBar.margin.bottom)
//             .attr("class", "bardetail");

//         // add background
//         svgBar.append("rect")
//             .attr("class", "background")
//             .attr("width", dimensions.global.width)
//             .attr("height", dimensions.detailBar.height + dimensions.detailBar.margin.top + dimensions.detailBar.margin.bottom)
//             .style("fill", themeColors.background);

//         // X axis
//         svgBar.append("g")
//             .attr("transform", "translate(" + (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left).toString() + "," + height + ")")
//             .call(d3.axisBottom(x))
//             .selectAll("text")
//                 .attr("transform", "translate(-10,0)rotate(-45)")
//                 .style("text-anchor", "end")
//                 .style("font-size", dimensions.textSize.tick)
//                 .style("fill", themeColors.text);

//         svgBar.append("text")
//             .attr("class", "x label")
//             .attr("text-anchor", "end")
//             .attr("x", dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left + width / 2)
//             .attr("y", height + dimensions.heatmap.margin.bottom - 10)
//             .text("Cell type")
//             .style("font-size", dimensions.textSize.label)
//             .style("fill", themeColors.text);

//         // Y axis label
//         svgBar.append("text")
//             .attr("class", "y label")
//             .attr("text-anchor", "end")
//             .attr("x", - height / 2)
//             .attr("y", (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left) / 2)
//             .attr("dy", ".75em")
//             .attr("transform", "rotate(-90)")
//             .text("Number of cells")
//             .style("font-size", dimensions.textSize.label)
//             .style("fill", themeColors.text);
//         nBars = 1;
//     } else {
//         nBars = d3.selectAll(".bardetailsample").size() + 1;
//         heightInd = height / nBars;

//         // make all existing ones smaller
//         for (let i = 0; i < nBars-1; i++) {
//             const sample_i = d3.select(`.sample-${i+1}`);
//             sample_i.attr("transform", "translate(" + (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left).toString() + "," + (i*heightInd).toString() + ")")
//             const sample_i_rects = sample_i.select(".rects");
//             sample_i_rects.attr("transform",
//                 `scale(${1},${1 / nBars})`);

//             // todo: figure out how to get new domain to draw new axis
//             const sample_i_y_axis = sample_i.select(".axisleft")
//             sample_i_y_axis.attr("transform",
//                 `scale(${1},${1 / nBars})`);
//         }
//     }
//     // create new chart
//     const svgBarSample = svgBar.append("g")
//         .attr("class", `bardetailsample sample-${nBars}`)
//         .attr("transform", "translate(" + (dimensions.detailBar.offsetWidth + dimensions.detailBar.margin.left).toString() + "," + (nBars-1*heightInd).toString() + ")")

//     const data = dataFull.countsMatrix.filter((o) => o.row === selectedRow)
//     // console.log(svgBar)
//     svgBarSample.append("text")
// 		.attr("class", "title")
// 		.attr("text-anchor", "start")
// 		.attr("x", 30)
//         .attr("y", 50)
// 		.text(selectedRow)
//         .style("font-size", dimensions.textSize.title)
//         .style("fill", themeColors.text);

//     // Add Y axis
//     const upperbound = getUpperBound(data.map(c => c.value));

//     const y = d3.scaleLinear()
//         .domain([0, upperbound])
//         .range([ height, 0]);

//     svgBarSample.append("g")
//         .attr("class", "axisleft")
//         .call(d3.axisLeft(y))
//         .selectAll("text")
// 			.style("font-size", dimensions.textSize.tick)
//             .style("fill", themeColors.text);

//     // Add bars
//     svgBarSample.append("g")
//         .attr("class", "rects")
//         .selectAll()
//         .data(data)
//         .join("rect")
//             .attr("x", d => x(d.col))
//             .attr("y", d => y(d.value))
//             .attr("width", x.bandwidth())
//             .attr("height", d => height - y(d.value))
//             .attr("fill", themeColors.heatmapMax);

//     // Resize bars
//     const sample = d3.selectAll(`.sample-${nBars}`)
//     sample.select(".rects")
//         .attr("transform",
//             `scale(${1},${1 / nBars})`);
//     sample.select(".axisleft")
//         .attr("transform",
//             `scale(${1},${1 / nBars})`);

//     return svgBar;
// }

export function resetExtensionChart(data: CellPopData) {
    // remove bars
    d3.select(".extension").selectAll("*").remove();

    // resize svg (without deletion)
    d3.select(".extension")
        .attr("width", 0)
        .attr("height", 0);

    // reset data
    data.extendedChart = {rowNames: [], colNames: []};
}