// General data structure
// To create the data structure necessary for the visualization, 
// It either needs a countsMatrix object or a counts object
//      countsMatrix        [{row: x, col: x, value: x}, {row: x, col: x, value: x}]
//      counts              {row: [{col: x, value: x}, {col: x, value: x}], row: [{col: x, value: x}, {col: x, value: x}]} 
// Optionally, it can include
//      ordering            [rowNamesOrder = [], colNamesOrder = []]
//      metadata            [rows: [{row: x, metadata: {title: x, age: x}}, {{row: x, metadata: {title: x, age: x}}}, cols: []]
// Furthermore, it can include specifications for the visualization, such as dimensions and theme


export function loadDataWithCounts(counts, metadata={}, ordering={}) {
    const countsMatrix = getCountsMatrixFromCounts(counts);
    let data = {countsMatrix: countsMatrix};
    loadDataWrapper(data, ordering);
    data.metadata = metadata;
    return data;
}


export function loadDataWithCountsMatrix(countsMatrix, metadata={}, ordering={}) {
    let data = {countsMatrix: countsMatrix};
    loadDataWrapper(data, ordering);
    data.metadata = metadata;
    return data;
}


function getCountsMatrixFromCounts(counts) {
    const countsMatrix = [];
	for (const row of Object.keys(counts)) {
		for (const [key, value] of Object.entries(counts[row])) {
			countsMatrix.push({row: row, col: key, value: value});
		}
	}
    return countsMatrix;
}


/**
 * Given a data object with a countsMatrix, 
 * add, wrap and sort rowNames and colNames, 
 * and extend matrix
 * @param {*} data 
 */
function loadDataWrapper(data, ordering={}) {
    getRowNames(data);
    getColNames(data);
    extendCountsMatrix(data);
    if (ordering.rowNamesOrder) {
        sortRowNames(data, ordering.rowNamesOrder);
    }
    if (ordering.colNamesOrder) {
        sortColNames(data, ordering.colNamesOrder);
    }
    wrapRowNames(data);
    wrapColNames(data);
    calculateFractions(data);
    return data;
}


function getRowNames(data) {
    data.rowNames = [...new Set(data.countsMatrix.map((r) => r.row))];
}


function getColNames(data) {
    data.colNames = [...new Set(data.countsMatrix.map((r) => r.col))];
}


function extendCountsMatrix(data) {
    const nTotal = data.rowNames.length * data.colNames.length;
    if (data.countsMatrix.length === nTotal) {
        return
    }
    for (const row of data.rowNames) {
        const countsMatrixRow = data.countsMatrix.filter(r => r.row === row);
        for (const col of data.colNames) {
            const countsMatrixRowCol = countsMatrixRow.filter(r => r.col === col);
            if (countsMatrixRowCol.length === 0) {
                data.countsMatrix.push({row: row, col: col, value: 0});
            }
        }
    }
}


function sortNames(arr, sortingArr) {
    arr.sort(function(a, b){
        if (sortingArr.indexOf(a) === -1) {
            return 1;
        }
        if (sortingArr.indexOf(b) === -1) {
            return -1;
        }
        return sortingArr.indexOf(a) - sortingArr.indexOf(b);
      });
    return arr;
}


function sortRowNames(data, rowNamesOrder) {
    data.rowNames = sortNames(data.rowNames, rowNamesOrder);
}


function sortColNames(data, colNamesOrder) {
    data.colNames = sortNames(data.colNames, colNamesOrder);
}


export function wrapRowNames(data) {
	data.rowNamesWrapped = data.rowNames.map(d => {return {row: d}});
}


export function wrapColNames(data) {
    data.colNamesWrapped = data.colNames.map(d => {return {col: d}});
}


export function calculateFractions(data) {
    const countsMatrixRowFractions = [];
    const countsMatrixColFractions = [];
    for (const row of data.rowNames) {
        const countsMatrixRow = data.countsMatrix.filter(r => r.row === row).map(r => r.value);
        const countsMatrixRowSum = countsMatrixRow.reduce((a, b) => a + b, 0);
        const countsMatrixRowFraction = data.countsMatrix.map(r => ({row: r.row, col: r.col, value: eval(r.value/countsMatrixRowSum)}))
        countsMatrixRowFractions.push(...countsMatrixRowFraction);
    }

    for (const col of data.colNames) {
        const countsMatrixCol = data.countsMatrix.filter(r => r.col === col).map(r => r.value);
        const countsMatrixColSum = countsMatrixCol.reduce((a, b) => a + b, 0);
        const countsMatrixColFraction = data.countsMatrix.map(r => ({row: r.row, col: r.col, value: eval(r.value/countsMatrixColSum)}))
        countsMatrixColFractions.push(...countsMatrixColFraction);
    }
    data.countsMatrixFractions = {row: countsMatrixRowFractions, col: countsMatrixColFractions};
}