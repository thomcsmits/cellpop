import * as d3 from "d3";

import { getUpperBound } from "./util";

export function showAnimation(data) {
    let data2 = {
        countsMatrix: data.countsMatrix,
        rowNames: data.rowNames,
        colNames: data.colNames,
    }
    createStackedBar(data2);


}

function createStackedBar(data) {

    let data2 = {
        countsMatrix: [{row: 'sampleA', col: 'cellZ', value: 10},
                 {row: 'sampleB', col: 'cellZ', value: 5},
                //  {row: 'sampleC', col: 'cellZ', value: 10},
                 {row: 'sampleA', col: 'cellY', value: 20},
                 {row: 'sampleB', col: 'cellY', value: 3},
                 {row: 'sampleC', col: 'cellY', value: 15},
                 {row: 'sampleA', col: 'cellX', value: 10},
                 {row: 'sampleB', col: 'cellX', value: 5},
                 {row: 'sampleC', col: 'cellX', value: 10},
                 {row: 'sampleA', col: 'cellW', value: 20},
                 {row: 'sampleB', col: 'cellW', value: 3},
                 {row: 'sampleC', col: 'cellW', value: 15},],
        rowNames: ['sampleA', 'sampleB', 'sampleC'],
        colNames: ['cellZ', 'cellY', 'cellX', 'cellW']
    }
    console.log('data', data)
    console.log('data', data2)

    var stackedData = d3.stack()
    .keys(data.colNames)
    .value(([, group], key) => {
        if (group.get(key)) {
            return group.get(key).value;
        } else {
            return 0;
        }})
    (d3.index(data.countsMatrix, d => d.row, d => d.col));


    // rows = samples
    // cols = types of cells
    // we want 1 entry per sample (row)

    let width = 1000;
    let height = 1000;

    let svg = d3.select("#app")
        .append("svg")
            .attr("width", width + 100)
            .attr("height", height + 100)
        .append("g")
            .attr("class", "animate")
            .attr("transform", 
                 "translate(50,50)")

    let x = d3.scaleBand()
        .domain(data.rowNames)
        .range([0,width])
        .padding([0.01])

    svg.append("g")
        .attr("class", "axisbottom")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
        .domain([0, getUpperBound(stackedData.flat().flat())])
        .range([ height, 0 ]);
    
    svg.append("g")
        .attr("class", "axisleft")
        .call(d3.axisLeft(y));
    
    var color = d3.scaleOrdinal()
        .domain(data.colNames)
        .range(["#1A2A22", "#79FFFC", "#8F5D4E", "#FFFF7C", "#FFFF7C", 
                "#C665BF", "#8AFF79", "#4E5C35", "#A4FCE5", "#FF8095", "#7A85FE"])


    svg.append("g").selectAll()
        .attr("class", "bars")
        .data(stackedData)
        .enter().append("g")
            .attr("fill", function(d) {return color(d.key)})
            .selectAll("rect")
            .data(function(d) {return d;})
            .enter().append("rect")
                .attr("x", function(d) {return x(d.data[0]);})
                .attr("y", function(d) {return y(d[1])})
                .attr("height", function(d) {return y(d[0]) - y(d[1])})
                .attr("width", x.bandwidth())

    d3.select(".animate")
        .transition()
        .duration(2000)
        // .attr("transform", "translate(500,0)")
        .attr("transform", "rotate(90, 650, 750)")

    d3.selectAll(".animate")
        .select("g.axisleft")
            .transition()
            .duration(2000)
            .remove()

    // d3.selectAll(".animate")
    //     .select("g.axisbottom")
    //         .transition()
    //         .duration(2000)
    //         .attr("transform", "rotate(-90, 500, 400)")
        

    console.log('svg', svg)
}