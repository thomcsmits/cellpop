import * as d3 from "d3";
import { AnnDataSource, ObsSetsAnndataLoader } from '@vitessce/zarr';

// data
var uuids = ['ad693f99fb9006e68a53e97598da1509',
'173de2e80adf6a73ac8cff5ccce20dfc',
'b95f34761c252ebbd1e482cd9afae73f',
'5a5ca03fa623602d9a859224aa40ace4',
'3c1b10bc912c60c9afc36b7423695236',
'1dc16eb0270ff73291dd45b6a96aa3c0',
'b05c21f9c94ce1a22a9694cd0fe0291e',
'8cdb42ed1194255c74c8462b99bbd7ef',
'fe0ded5fc0355c95239f9c040dd31e99',
'367fee3b40cba682063289505b922be1',
'b99fc30c4195958fbef217fa9ed9ec8f',
'898138b7f45a67c574e9955fb400e9be',
'f220c9e7bcaea3a87162cbe61287ea4d',
'e5f7a14d93659bd0b8dc2819ffa9bc4b',
'56cbda4789f04d79c0c3dffe21816d48',
'0b6f63f2bd61a8c091fc7afc0f318ad1',
'62efbe0a6abd0bcf53ab9ab29e7cd73f',
'4b62d9d2c248323ce029859f953fdc57',
'c81b0dc9d16eb825a7d6bce6e1b3678f',
'5ee240959c96b49d960702755478b9fc',
'7c9e07c96d144536525b1f889acee14d',
'dd7ccbc306692fc5ff5e61c22845da21',
'9a7e6be288b27ddbd3366c4ae41bbcd2',
'018a905cdbdff684760859f594d3fd77',
'af5741dad7aecf7960a129c3d2ae642a',
'6e1db473492095ccc2f1393d7259b9c0',
'fae9a1f2e7abefca2203765a3c7a5ba1',
'8d631eee88855ac59155edca2a3bc1ca',
'1ea6c0ac5ba60fe35bf63af8699b6fbe']

// for dev purposes
uuids.splice(5)

// get hubmap url to zarr
function getURL(uuid) {
    return `https://assets.hubmapconsortium.org/${uuid}/hubmap_ui/anndata-zarr/secondary_analysis.zarr`;
}
const urls = uuids.map(getURL);

// Get list of obssets
const obsSetsList = [];
for (let i = 0; i < urls.length; i++) { 
    const url = urls[i]
    const source = new AnnDataSource({ url });
    const config = {
        url,
        fileType: 'obsSets.anndata.zarr',
        options: [
            {
                name: 'Cell Ontology Annotation',
                path: 'obs/predicted_CLID' //'obs/predicted_label'
            }
        ],
    };
    const loader = new ObsSetsAnndataLoader(source, config);
    const { data: { obsSets } } = await loader.load();
    obsSetsList.push(obsSets);
}
// get the actual data
const obsSetsListChildren = obsSetsList.map((o) => o.tree[0].children);

// get the counts per cell type
function getCountsPerType(o) {
    var dict = new Object();
    for(var t of o) {
        dict[t.name] = t.set.length;
    }
    return dict;
}
const obsSetsListChildrenCounts = obsSetsListChildren.map(getCountsPerType);
console.log(obsSetsListChildrenCounts)

// const listOfThings = []
// for (let i = 0; i < urls.length; i++) {
//     let uuid = uuids[i]
//     for (const [key, value] of Object.entries(obsSetsListChildrenCounts[i])) {
//         listOfThings.push([uuid, key, value])
//     }
// }
// console.log(listOfThings)

// const myNewThing = listOfThings.map(it => {
//     return Object.values(it).toString()
//   }).join('\n')

// console.log(myNewThing)

// get a list of all types
const allTypes = [...new Set(obsSetsListChildrenCounts.map(i => Object.keys(i)).flat())].sort();

// get the matrix column for each entry
function getMatrixColumn(o) {
    const matrixColumn = new Array(allTypes.length).fill(0);
    for (const [key, value] of Object.entries(o)) {
        let index = allTypes.indexOf(key)
        matrixColumn[index] = value;
    }
    return matrixColumn;
}
const matrix = obsSetsListChildrenCounts.map(getMatrixColumn);

console.log(matrix)

const matrix2 = [];
for (let i = 0; i < urls.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        matrix2.push({row: i, col: j, value: matrix[i][j]})
    }
}
console.log('matrix2', matrix2);




// console.log(obsSetsListChildrenCounts)

const obsSetsListChildrenCountsMatrix = [];
for (let i = 0; i < urls.length; i++) {
    const sampleName = uuids[i];
    for (const [key, value] of Object.entries(obsSetsListChildrenCounts[i])) {
        const cellID = key;
        obsSetsListChildrenCountsMatrix.push({row: sampleName, col: cellID, value: value});
    }
}
console.log('matrix', obsSetsListChildrenCountsMatrix);

// console.log(matrix.map((o,i) => { uuids[i], o}))

// // visualization
// const widthFull = 450;
// const heightFull = 450;
// var margin = {top: 30, right: 30, bottom: 100, left: 100};

// var width = 450 - margin.left - margin.right;
// var height = 450 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#app")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");


// // Labels of row and columns
// var myGroups = uuids;
// var myVars = allTypes;

// // Build X scales and axis:
// var x = d3.scaleBand()
//   .range([ 0, width ])
//   .domain(myGroups)
//   .padding(0.01);
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x))

// // Build X scales and axis:
// var y = d3.scaleBand()
//   .range([ height, 0 ])
//   .domain(myVars)
//   .padding(0.01);
// svg.append("g")
//   .call(d3.axisLeft(y));

// // Build color scale
// var myColor = d3.scaleLinear()
//   .range(["white", "#69b3a2"])
//   .domain([1,100])

// svg.selectAll()
//   .data(matrix)
//   .enter()

// console.log(svg)

// svg.selectAll()
//     .data(matrix, function(d) {return d.group+':'+d.variable;})
//     .enter()
//     .append("rect")
//     .attr("x", function(d) { return x(d.group) })
//     .attr("y", function(d) { return y(d.variable) })
//     .attr("width", x.bandwidth() )
//     .attr("height", y.bandwidth() )
//     .style("fill", function(d) { return myColor(d.value)} )



// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;
const data = {"data":[[8,2],[5,4],[9,6]]};
// append the svg object to the body of the page
var svg = d3.select("#app")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var rows = [];
var cols = [];
var chartData = [];
data.data.forEach((item, i) => {
  if( i === 0) {
    item.forEach((itm , j) => {
      cols.push("col" + j);
      chartData.push({ row: "row" + i, col: "col" + j,value: itm});
    });
  } else {
     item.forEach((itm , j) => {
      chartData.push({ row: "row" + i, col: "col" + j, value: itm});
    });
  }
  rows.unshift("row" + i);
})
console.log(data)

chartData = obsSetsListChildrenCountsMatrix;


// Labels of row and columns
var myGroups = allTypes;
var myVars = uuids; 

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));


// // Build X scales and axis:
// var x = d3.scaleBand()
//   .range([ 0, width ])
//   .domain(cols)
//   .padding(0.01);
// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x))

// // Build X scales and axis:
// var y = d3.scaleBand()
//   .range([ height, 0 ])
//   .domain(rows)
//   .padding(0.01);
// svg.append("g")
//   .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain([0,2000])
console.log(chartData);
//Read the data
  svg.selectAll()
      .data(chartData, function(d) {return d.row+':'+d.col;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.col) })
      .attr("y", function(d) { return y(d.row) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )

console.log(svg)