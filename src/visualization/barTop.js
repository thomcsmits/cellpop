import * as d3 from "d3";

import { getUpperBound } from "./util";
import { defineTooltipBarTop, addTooltipBarTop, removeTooltipBarTop } from "./tooltips";

export function renderTopBar(dataFull, dimensions, x) {
	// Remove any prior barcharts
	d3.select("g.bartop").remove();

	// Create svg element
	let svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + eval(dimensions.barTop.offsetWidth + dimensions.barTop.margin.left) + "," + eval(dimensions.barTop.offsetHeight + dimensions.barTop.margin.top) + ")")
			.attr("class", "bartop")

	// Get dimensions
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
		.attr("class", "axisleft")
		.call(d3.axisLeft(y))
		.selectAll("text")
			.style("font-size", dimensions.textSize.tick);


	const x_changed = x.paddingInner(0.25)

    // svg.append("text")
	// 	.attr("class", "y label")
	// 	.attr("text-anchor", "end")
	// 	.attr("x", 0)
	// 	.attr("y", -60)
	// 	.attr("dy", ".75em")
	// 	.attr("transform", "rotate(-90)")
	// 	.text("Total number of cells")
	//.style("font-size", dimensions.textSize.label);

    // Bars
    let bars = svg.selectAll()
		.data(data)
		.join("rect")
			.attr("x", d => x_changed(d.col))
			.attr("y", d => y(d.countTotal))
			.attr("width", x.bandwidth())
			.attr("height", d => height - y(d.countTotal))
			.attr("fill", "black")

	defineTooltipBarTop();

	// Define mouse functions
    const mouseover = function(event,d) {
        if (event.ctrlKey) {
			addTooltipBarTop(event, d);
        }
    }
    const mouseleave = function() {
		removeTooltipBarTop();
    }

	bars.on("mouseover", mouseover);
	bars.on("mouseleave", mouseleave);

}


export function renderTopViolin(dataFull, dimensions, x) {
	// Remove any prior barcharts
	d3.select("g.bartop").remove();

	// Create svg element
	let svg = d3.select("g.main")
		.append("g")
			.attr("transform",
				"translate(" + eval(dimensions.barTop.offsetWidth + dimensions.barTop.margin.left) + "," + eval(dimensions.barTop.offsetHeight + dimensions.barTop.margin.top) + ")")
			.attr("class", "bartop")

	// Get dimensions
	let width = dimensions.barTop.width - dimensions.barTop.margin.left - dimensions.barTop.margin.right;
	let height = dimensions.barTop.height - dimensions.barTop.margin.top - dimensions.barTop.margin.bottom;

	// const data = []
	// for (const col of dataFull.colNames) {
	// 	data.push({col: col, countTotal: dataFull.countsMatrix.filter(r => r.col === col).map(r => r.value).reduce((a, b) => a + b, 0)})
	// }
	// console.log("here", data)

	// let upperbound = getUpperBound(data.map(c => c.countTotal));

	// import x-axis
	// const x = eval(axes.x);
	
	// Add y-axis
	// const y = d3.scaleLinear()
	// 	.range([ height, 0 ])
	// 	.domain([ 0, upperbound])

	const y = d3.scaleLinear()
		.domain(d3.extent(dataFull, d => d.value)).nice()
		.range([height, dimensions.barTop.top])


	svg.append("g")
		.attr("class", "axisleft")
		.call(d3.axisLeft(y))
		.selectAll("text")
			.style("font-size", dimensions.textSize.tick);


	// const x_changed = x.paddingInner(0.25)

	function kde(kernel, thds) {
		return V => thds.map(t => [t, d3.mean(V, d => kernel(t - d))])
	  }

	  function epanechnikov(bandwidth) {
		return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
	  }

	const bandwidth = 0.3;
	const thds = y.ticks(40)
	const density = kde(epanechnikov(bandwidth), thds)
  
	const violins = d3.rollup(data, v => density(v.map(g => g.countTotal)), d => d.col)
	console.log(violins)

	// var allNum = [];
	// [...violins.values()].forEach((d,i) => allNum = allNum.concat([...violins.values()][i].map(d => d[1])))
	// const xNum  = d3.scaleLinear()
	// 	.domain([-d3.max(allNum), d3.max(allNum)])
	// 	.range([0, x.bandwidth()])
	
	// const area = d3.area()
	// 	.x0(d => xNum(-d[1]))
	// 	.x1(d => xNum(d[1]))
	// 	.y(d => y(d[0]))
	// 	.curve(d3.curveNatural)

	// svg.append('g')
    // .selectAll('g')
    // .data([...violins])
    // .join('g')
    //   .attr('transform', d => `translate(${x(d[0])}, 0)`)
    // .append('path')
    //   .datum(d => d[1])
    //   .style('stroke', 'none')
    //   .style('fill', '#69b3a2')
    //   .attr('d', area)
  

    // // Features of the histogram
	// var histogram = d3.bin()
	// 	.domain(y.domain())
	// 	.thresholds(y.ticks(20)) // 20 => 'resolution'
	// 	.value(d => d)

	// console.log('histogram', histogram)

	
	// Compute the binning for each group of the dataset
	// var sumstat = d3.group(dataFull, d => d.col, d => d.countTotal)
		// .key(function(d) { return d.Species;})
		// .rollup(function(d) {   // For each key..
		// 	input = d.map(function(g) { return g.Sepal_Length;})    // Keep the variable called Sepal_Length
		// 	bins = histogram(input)   // And compute the binning on it.
		// 	return(bins)
		// })
		// .entries(data)

	// // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
	// var maxNum = 0
	// for ( i in sumstat ){
	// 	allBins = sumstat[i].value
	// 	lengths = allBins.map(function(a){return a.length;})
	// 	longuest = d3.max(lengths)
	// 	if (longuest > maxNum) { maxNum = longuest }
	// }

	// // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
	// var xNum = d3.scaleLinear()
	// 	.range([0, x.bandwidth()])
	// 	.domain([-maxNum,maxNum])


	// svg
	// 	.selectAll("myViolin")
	// 	.data(sumstat)
	// 	.enter()        // So now we are working group per group
	// 	.append("g")
	// 	  .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) // Translation on the right to be at the group position
	// 	.append("path")
	// 		.datum(function(d){ return(d.value)})     // So now we are working bin per bin
	// 		.style("stroke", "none")
	// 		.style("fill","#69b3a2")
	// 		.attr("d", d3.area()
	// 			.x0(function(d){ return(xNum(-d.length)) } )
	// 			.x1(function(d){ return(xNum(d.length)) } )
	// 			.y(function(d){ return(y(d.x0)) } )
	// 			.curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
	// 		)



}
