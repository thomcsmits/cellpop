// General data structure
// To create the data structure necessary for the visualization, 
// It either needs a countsMatrix object or a counts object
//      countsMatrix        [{row: x, col: x, value: x}, {row: x, col: x, value: x}]
//      counts              {row: [{col: x, value: x}, {col: x, value: x}], row: [{col: x, value: x}, {col: x, value: x}]} 
// Optionally, it can include
//      ordering            [rowNamesOrder = [], colNamesOrder = []]
//      metadata            [rows: [{row: x, metadata: {title: x, age: x}}, {{row: x, metadata: {title: x, age: x}}}, cols: []]
// Furthermore, it can include specifications for the visualization, such as dimensions and theme

import { CellPopData, CountsMatrixValue, MetaData, dataOrdering } from "../cellpop-schema";

export function loadDataWithCounts(counts: any, metadata?: MetaData, ordering?: dataOrdering) {
    const countsMatrix = getCountsMatrixFromCounts(counts);
    const data = {countsMatrix: countsMatrix} as CellPopData;
    loadDataWrapper(data, ordering);
    data.metadata = metadata;
    return data;
}


export function loadDataWithCountsMatrix(countsMatrix: CountsMatrixValue[], metadata?: MetaData, ordering?: dataOrdering) {
    const data = {countsMatrix: countsMatrix} as CellPopData;
    loadDataWrapper(data, ordering);
    data.metadata = metadata;
    return data;
}


function getCountsMatrixFromCounts(counts: any) {
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
function loadDataWrapper(data: CellPopData, ordering?: dataOrdering) {
    getRowNames(data);
    getColNames(data);
    extendCountsMatrix(data);
    if (ordering) {
        if (ordering.rowNamesOrder) {
            sortRowNames(data, ordering.rowNamesOrder);
        }
        if (ordering.colNamesOrder) {
            sortColNames(data, ordering.colNamesOrder);
        }
    }
    wrapRowNames(data);
    wrapColNames(data);
    calculateFractions(data);

    // copy's
    data.rowNamesRaw = [...data.rowNames];
    data.colNamesRaw = [...data.colNames];

    return data;
}


function getRowNames(data: CellPopData) {
    data.rowNames = [...new Set(data.countsMatrix.map((r) => r.row))];
}


function getColNames(data: CellPopData) {
    data.colNames = [...new Set(data.countsMatrix.map((r) => r.col))];
}


function extendCountsMatrix(data: CellPopData) {
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


function sortNames(arr: string[], sortingArr: string[]) {
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


function sortRowNames(data: CellPopData, rowNamesOrder: string[]) {
    data.rowNames = sortNames(data.rowNames, rowNamesOrder);
}


function sortColNames(data: CellPopData, colNamesOrder: string[]) {
    data.colNames = sortNames(data.colNames, colNamesOrder);
}


export function wrapRowNames(data: CellPopData) {
	data.rowNamesWrapped = data.rowNames.map(d => {return {row: d}});
}


export function wrapColNames(data: CellPopData) {
    data.colNamesWrapped = data.colNames.map(d => {return {col: d}});
}

export function resetRowNames(data: CellPopData) {
    data.rowNames = [...data.rowNamesRaw];
    wrapRowNames(data);
}

export function resetColNames(data: CellPopData) {
    data.colNames = [...data.colNamesRaw];
    wrapColNames(data);
}

export function calculateFractions(data: CellPopData) {
    const countsMatrixRowFractions = [];
    const countsMatrixColFractions = [];
    for (const row of data.rowNames) {
        const countsMatrixRow = data.countsMatrix.filter(r => r.row === row);
        const countsMatrixRowValues = countsMatrixRow.map(r => r.value);
        const countsMatrixRowValuesSum = countsMatrixRowValues.reduce((a, b) => a + b, 0);
        const countsMatrixRowFraction = countsMatrixRow.map(r => ({row: r.row, col: r.col, value: r.value/countsMatrixRowValuesSum}))
        countsMatrixRowFractions.push(...countsMatrixRowFraction);
    }

    for (const col of data.colNames) {
        const countsMatrixCol = data.countsMatrix.filter(r => r.col === col);
        const countsMatrixColValues = countsMatrixCol.map(r => r.value);
        const countsMatrixColValuesSum = countsMatrixColValues.reduce((a, b) => a + b, 0);
        const countsMatrixColFraction = countsMatrixCol.map(r => ({row: r.row, col: r.col, value: r.value/countsMatrixColValuesSum}))
        countsMatrixColFractions.push(...countsMatrixColFraction);
    }
    data.countsMatrixFractions = {row: countsMatrixRowFractions, col: countsMatrixColFractions};
}