import * as d3 from "d3";

import { getUpperBound } from "./util";
import { AnimationDimensions, CellPopData, CountsMatrixValueAnimation } from "../cellpop-schema";

export function showAnimation(data: CellPopData) {
    // delete any old
    d3.selectAll(".animate-svg").remove();

    // create new svg
    const svg = d3.select("#app")
        .append("svg")
            .attr("class", "animate-svg")
            .attr("width", 2000)
            .attr("height", 2000)

            const dimensions = {
        width: 1000,
        height: 1000,
        marginLeft: 150,
        marginTop: 300,
        moveWidth: 650,
        moveTop: 750
    }

    createStackedBar(svg, data, dimensions);
}

export function showAnimationBox(data: CellPopData, width: number, height: number) {
    // select svg
    const svg = d3.select(".animate-svg");
    
    // delete any old grouping
    svg.selectAll(".animate").remove();

    const dimensions = {
        width: width,
        height: height,
        marginLeft: width / 5,
        marginTop: height / 5,
        moveWidth: width / 3,
        moveTop: height / 1.5
    } as AnimationDimensions;
    
    createStackedBar(svg, data, dimensions);
}


// test data
// let data2 = {
    //     countsMatrix: [{row: "sampleA", col: "cellZ", value: 10},
    //              {row: "sampleB", col: "cellZ", value: 5},
    //             //  {row: "sampleC", col: "cellZ", value: 10},
    //              {row: "sampleA", col: "cellY", value: 20},
    //              {row: "sampleB", col: "cellY", value: 3},
    //              {row: "sampleC", col: "cellY", value: 15},
    //              {row: "sampleA", col: "cellX", value: 10},
    //              {row: "sampleB", col: "cellX", value: 5},
    //              {row: "sampleC", col: "cellX", value: 10},
    //              {row: "sampleA", col: "cellW", value: 20},
    //              {row: "sampleB", col: "cellW", value: 3},
    //              {row: "sampleC", col: "cellW", value: 15},],
    //     rowNames: ["sampleA", "sampleB", "sampleC"],
    //     colNames: ["cellZ", "cellY", "cellX", "cellW"]
    // }

function createStackedBar(svgBase: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, data: CellPopData, dimensionsAnimation: AnimationDimensions) {
    const countsMatrixAnimation = data.countsMatrix as CountsMatrixValueAnimation[];
    const width = dimensionsAnimation.width / 2;
    const height = dimensionsAnimation.height / 2;

    // determine the start and end of each rect for the stacked bar chart
    const rowValsCounter = [];
    for (const row of data.rowNames) {
        rowValsCounter.push({row: row, counter: 0});
    }

    for (const entry of countsMatrixAnimation) {
        const currVal = rowValsCounter.filter(r => r.row === entry.row)[0].counter;
        const newVal = currVal + entry.value;
        entry.start = currVal;
        entry.end = newVal;
        rowValsCounter.filter(r => r.row === entry.row)[0].counter = newVal;
    }

    const svg = svgBase.append("g")
        .attr("class", "animate")
        .attr("transform", 
            "translate(" + dimensionsAnimation.marginLeft + "," + dimensionsAnimation.marginTop + ")")

    // add x axis
    const x = d3.scaleBand()
        .domain(data.rowNames)
        .range([0,width])
        .padding(0.01)

    svg.append("g")
        .attr("class", "axisbottom")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add y axis
    const y = d3.scaleLinear()
        .domain([0, getUpperBound(rowValsCounter.map(d => d.counter))])
        .range([ height, 0 ]);
    
    svg.append("g")
        .attr("class", "axisleft")
        .call(d3.axisLeft(y));
    
    // add color
    const color = d3.scaleOrdinal<string, string>()
        .domain(data.colNames)
        .range(["#1A2A22", "#79FFFC", "#8F5D4E", "#FFFF7C", "#FFFF7C", 
                "#C665BF", "#8AFF79", "#4E5C35", "#A4FCE5", "#FF8095", "#7A85FE"])


    svg.append("g").selectAll<SVGRectElement, CountsMatrixValueAnimation>(".bar-rects")
        .data(countsMatrixAnimation, function(d) {return d.row+":"+d.col;})
        .enter()
        .append("rect")
            .attr("class", "bar-rects")
            .attr("x", function(d) {return x(d.row)})
            .attr("y", function(d) {return y(d.end)})
            .attr("width", x.bandwidth())
            .attr("height", function(d) {return y(d.start) - y(d.end)})
            .attr("fill", function(d) {return color(d.col)})


    // animations
    // rotate
    d3.select(".animate")
        .transition()
        .duration(2000)
        .delay(2000)
        // .attr("transform", "translate(500,0)")
        .attr("transform", "rotate(90, " + dimensionsAnimation.moveWidth + ", " + dimensionsAnimation.moveTop + ")") //650, 750

    // rotate x-labels the other way
    d3.select(".animate")
        .select(".axisbottom")
        .selectAll("text")
        .transition()
        .duration(2000)
        .delay(2000)
        .attr("transform", "translate(-15,130)rotate(-90)")

    // d3.selectAll(".animate")
    //     .select("g.axisleft")
    //         .transition()
    //         .delay(2000)
    //         .duration(1)
    //         .remove()
            

    const y2 = d3.scaleBand()
            .range([ height, 0 ])
            .domain(data.colNames)
            .padding(0.01);
    
    // call the new axis
    d3.selectAll(".animate")
        .select("g.axisleft")
        .transition()
        .delay(5000)
        // @ts-ignore
        .call(d3.axisLeft(y2))
        
    // move the rects
    d3.selectAll(".animate")
        .selectAll<SVGRectElement, CountsMatrixValueAnimation>(".bar-rects")
        .transition()
        .delay(6000)
        .ease(d3.easeLinear)
        .attr("y", function(d) {return y2(d.col)})
        .attr("height", y2.bandwidth())


    // Color axis
	const colorRange = d3.scaleLinear<string, number>()
        .range(["white", "#69b3a2"])
        .domain([0,2000])


    // change the color of the rects
    d3.selectAll(".animate")
        .selectAll<SVGRectElement, CountsMatrixValueAnimation>(".bar-rects")
        .transition()
        .delay(7500)
        .attr("fill", function(d) {return colorRange(d.value)})
        
}