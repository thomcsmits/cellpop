import * as d3 from "d3";

// append an svg object to the body of the page
let svg = d3.select("#app")
.append("svg")
    .attr("width", 600)
    .attr("height", 600)
.append("g")
    .attr("class", "main")


let data = { 
    rowNames: ['0', '1', '2', '3'], 
    matrix: [{row: '0', val: 50}, 
        {row: '1', val: 500}, 
        {row: '2', val: 1500},
        {row: '3', val: 2000}]
}
let width = 500;
let height = 500;

// Add y-axis
let y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(data.rowNames.sort())
    .padding(0.01);
svg.append("g")
    .call(d3.axisRight(y))
    .attr("transform", "translate(" + width + ",0)")

// Add color
let colorRange = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([0,1000])

// Read data
let rows = svg.selectAll()
    .data(data.matrix, function(d) {return d.row;})
    .enter()
    .append("rect")
        .attr("x", 0)
        .attr("y", function(d) { return y(d.row) })
        .attr("opacity", 0.5)
        .attr("width", width )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) {return colorRange(d.val)})

// Define drag behavior
let drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

// Apply drag behavior to rows
rows.call(drag);

// Drag start function
function dragstarted(event, d) {
    d3.select(this).raise().classed("active", true);
}

// Dragging function
function dragged(event, d) {
    // Let the selected row move with the cursor
    d3.select(this).attr("y", d.y = event.y);

    // Calculate the current index of the dragged row
    let currentIndex = data.rowNames.indexOf(d.row);
    
    // Calculate the new index based on the y-coordinate of the drag event
    let newIndex = data.rowNames.length - 1 - Math.floor(event.y / y.bandwidth());

    // If row goes beyond boundaries, set it to the first/last item
    if (newIndex < 0) {
        newIndex = 0;
    }
    if (newIndex >= data.rowNames.length) {
        newIndex = data.rowNames.length - 1
    }

    // If row stays at the same place, return
    if (newIndex === currentIndex) {
        return
    }

    // Calculate the displacement of the dragged row
    let displacement = newIndex - currentIndex;

    // For each row, calculate the new y position
    rows.each(function(rowName) {
        let rowIndex = data.rowNames.indexOf(rowName.row);
        // Get the rows that are affected (between the currentIndex and newIndex)
        if (rowIndex !== currentIndex && rowIndex >= Math.min(currentIndex, newIndex) && rowIndex <= Math.max(currentIndex, newIndex)) {
            // Shift the row up or down depending on the direction of the moved row
            if (displacement > 0) {
                d3.select(this).attr("y", y(data.rowNames[rowIndex - 1]))
            } else {
                d3.select(this).attr("y", y(data.rowNames[rowIndex + 1]))
            }
        }
    })

    // Update the ordering of rowNames
    let selectedElement = data.rowNames[currentIndex];
    let rowNamesCopy = [...data.rowNames.slice(0, currentIndex), ...data.rowNames.slice(currentIndex + 1)];
    rowNamesCopy = [...rowNamesCopy.slice(0, newIndex), selectedElement, ...rowNamesCopy.slice(newIndex)];
    data.rowNames = rowNamesCopy;
  
    // Update the y-domain
    y.domain(data.rowNames)
}

// Drag end function
function dragended(event, d) {
    // Get the current index and set the y-coordinate of this row when drag ends
    let currentIndex = data.rowNames.indexOf(d.row);
    d3.select(this).attr("y", y(data.rowNames[currentIndex]));
    d3.select(this).classed("active", false);
}
