import * as d3 from "d3";

var widthFull = 800;
var heightFull = 800;
var widthLeft = 200;
var widthRight = 600;
var heightTop = 200;
var heightBottom = 600;

var height = heightFull;
var width = widthFull;

// full app
var svg = d3.select("#app")
	.append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("class", "main")

svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', 'green')
        .attr('fill', 'green')


// main heatmap
var svgHeatmap = svg.append("g")
    .attr("transform",
        // "translate(" + dimensions.margin.left + "," + `${dimensions.margin.top} + ${widthTop}` + ")")
        "translate(" + widthLeft + "," + heightTop + ")")
    .attr("class", "heatmap")
    // .style("outline", "thick solid black")

svgHeatmap.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', widthRight)
    .attr('height', heightBottom)
    .attr('stroke', 'black')
    .attr('fill', 'black')


// thing on top
var svgBarTop = svg.append("g")
    .attr("transform",
        "translate(" + widthLeft + "," + 0 + ")")
    .attr("class", "barleft");

svgBarTop.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', widthRight)
    .attr('height', heightTop)
    .attr('stroke', 'red')
    .attr('fill', 'red')

// thing on side
var svgBarLeft = svg.append("g")
    .attr("transform",
        "translate(" + widthLeft + "," + heightTop + ")rotate(90)")
    .attr("class", "barleft");

svgBarLeft.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', heightBottom)
    .attr('height', widthLeft)
    .attr('stroke', 'blue')
    .attr('fill', 'blue')


console.log(svg)