/** DATA */

export type CellPopData = {
    rowNames: string[],
    rowNamesRaw: string[],
    rowNamesWrapped: RowNamesWrapped[],
    colNames: string[],
    colNamesRaw: string[],
    colNamesWrapped: ColNamesWrapped[],
    countsMatrix: CountsMatrixValue[],
    countsMatrixFractions: CountsMatrixFractions,
    metadata: MetaData
}

export type RowNamesWrapped = { row: string };

export type ColNamesWrapped = { col: string };

export type CountsMatrixValue = {
    row: string,
    col: string,
    value: number
}

export type CountsTotalRowValue = {
    row: string,
    countTotal: number
}

export type CountsTotalColValue = {
    col: string,
    countTotal: number
}

export type CountsMatrixFractions = {
    col: CountsMatrixValue[],
    row: CountsMatrixValue[],
}

export type MetaData = {
    rows: {row: string, metadata: any}[],
    cols: {col: string, metadata: any}[]
}

/** OPTIONS */
export type CellPopOptions = {
    dimensions: CellPopDimensions,
    fraction: boolean,
    theme: CellPopTheme,
    themeColors: CellPopThemeColors,
    metadataOptions: string[],
    metadataField: string,
    boundKeys: CellPopKeys   
}

export type CellPopDimensions = {
    global: {
        width: number, 
        widthSplit: [number, number],
        height: number,
        heightSplit: [number, number]
    }, 
    heatmap: CellPopDimensionsValue, 
    barTop: CellPopDimensionsValue,
    violinTop: CellPopDimensionsValue,
    barLeft: CellPopDimensionsValue,
    violinLeft: CellPopDimensionsValue,
    graph: CellPopDimensionsValue,
    detailBar: CellPopDimensionsValue, 
    textSize: {
        title: string,
        label: string,
        labelSmall: string,
        tick: string
    }
}

export type CellPopDimensionsValue = {
    offsetWidth: number,
    offsetHeight: number,
    width: number,
    height: number,
    margin: {top: number, right: number, bottom: number, left: number}
}

export type CellPopTheme = "light"| "dark";

export type CellPopThemeColors = {
    background: string,
    heatmapZero: string,
    heatmapMax: string,
    heatmapGrid: string,
    heatmapHighlight: string,
    sideCharts: string,
    text: string
}

export type CellPopKeys = {
    tooltip: "ctrlKey" | "shiftKey" | "altKey",
    rows: "ctrlKey" | "shiftKey" | "altKey",
    cols: "ctrlKey" | "shiftKey" | "altKey"
}

// options
// dimensions: object
// fraction: boolean
// theme: string
// themeColors: object
// metadataOptions: array
// metadataField: string
// boundsKeys: object 
