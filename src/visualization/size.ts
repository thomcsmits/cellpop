import * as d3 from "d3";
import { renderCellPopVisualization } from ".";
import { CellPopData, CellPopDimensions, CellPopDimensionsGlobal, CellPopDimensionsValue, CellPopThemeColors } from "../cellpop-schema";



/** START DIMENSIONS */

// Users of CellPop have two options to add dimensions
// 1) a 'CellPopDimensions' object
//      Check if it has all the requirements, then use this
// 2) a list of dimensions
//      Create a 'CellPopDimensions' object with these dimensions

/**
 * Function for creating a CellPopDimensions object with a list of dimensions.
 * Any dimensions can be null, and will be supplied with defaults.
 * @param width Total width of the CellPop component. If not supplied, will be calculated from the parts. If parts not supplied, defaults to 1000.
 * @param widthLeft Width of the left panel. Can be supplied as absolute number or as fraction of width. Default to 0.3 (fraction of width)
 * @param widhtMiddle Width of the middle panel. Can be supplied as absolute number or as fraction of width. Default to 0.3 (fraction of width)
 * @param widthRight Width of the right panel. Can be supplied as absolute number or as fraction of width. Default to 0.3 (fraction of width)
 * @param widthMarginLeft Width of the margin on the left of the left panel. Can be supplied as absolute number or as fraction of width. Default to 0.05 (fraction of width)
 * @param widthMarginMiddleLeft Width of the margin between the left and middle panel. Can be supplied as absolute number or as fraction of width. Default to 0.05 (fraction of width)
 * @param widthMarginMiddleRight Width of the margin between the middle and right panel. Can be supplied as absolute number or as fraction of width. Default to 0.05 (fraction of width)
 * @param widthMarginRight Width of the margin on the right of the right panel. Can be supplied as absolute number or as fraction of width. Default to 0.05 (fraction of width)
 * @param height Total height of the CellPop component. If not supplied, will be calculated from the parts. If parts not supplied, defaults to 1000.
 * @param heightTop Height of the top panel. Can be supplied as absolute number or as fraction of height. Default to 0.3 (fraction of height)
 * @param heightMiddle Height of the middle panel. Can be supplied as absolute number or as fraction of height. Default to 0.3 (fraction of height)
 * @param heightBottom Height of the bottom panel. Can be supplied as absolute number or as fraction of height. Default to 0.3 (fraction of height)
 * @param heightMarginTop Height of the margin on the top of the top panel. Can be supplied as absolute number or as fraction of height. Default to 0.05 (fraction of height)
 * @param heightMarginMiddleTop Height of the margin between the top and middle panel. Can be supplied as absolute number or as fraction of height. Default to 0.05 (fraction of height)
 * @param heightMarginMiddleBottom Height of the margin between the middle and bottom panel. Can be supplied as absolute number or as fraction of height. Default to 0.05 (fraction of height)
 * @param heightMarginBottom Height of the margin on the bottom of the bottom panel. Can be supplied as absolute number or as fraction of height. Default to 0.05 (fraction of height)
 * @param heightExtension
 * @param heightExtensionMiddle
 * @param heightExtensionMarginTop
 * @param heightExtensionMarginBottom
 * @returns CellPopDimension object
 */
export function getDimensions(
    width?: number,
    widthLeft?: number,
    widhtMiddle?: number,
    widthRight?: number,
    widthMarginLeft?: number,
    widthMarginMiddleLeft?: number,
    widthMarginMiddleRight?: number,
    widthMarginRight?: number,
    height?: number,
    heightTop?: number,
    heightMiddle?: number,
    heightBottom?: number,
    heightMarginTop?: number,
    heightMarginMiddleTop?: number,
    heightMarginMiddleBottom?: number,
    heightMarginBottom?: number,
    heightExtension?: number,
    heightExtensionMiddle?: number,
    heightExtensionMarginTop?: number,
    heightExtensionMarginBottom?: number
): CellPopDimensions {
    const dimensionsGlobal = getDimensionsGlobal(width, widthLeft, widhtMiddle, widthRight, widthMarginLeft, widthMarginMiddleLeft, widthMarginMiddleRight, widthMarginRight, height, heightTop, heightMiddle, heightBottom, heightMarginTop, heightMarginMiddleTop, heightMarginMiddleBottom, heightMarginBottom, heightExtension, heightExtensionMiddle, heightExtensionMarginTop, heightExtensionMarginBottom);

    const dimensions = getDimensionsFromGlobal(dimensionsGlobal);

    return dimensions;
}


export function getDimensionsGlobal(
    width?: number,
    widthLeft?: number,
    widhtMiddle?: number,
    widthRight?: number,
    widthMarginLeft?: number,
    widthMarginMiddleLeft?: number,
    widthMarginMiddleRight?: number,
    widthMarginRight?: number,
    height?: number,
    heightTop?: number,
    heightMiddle?: number,
    heightBottom?: number,
    heightMarginTop?: number,
    heightMarginMiddleTop?: number,
    heightMarginMiddleBottom?: number,
    heightMarginBottom?: number,
    heightExtension?: number,
    heightExtensionMiddle?: number,
    heightExtensionMarginTop?: number,
    heightExtensionMarginBottom?: number
): CellPopDimensionsGlobal {

    const dimensionsGlobal = {
        width: {
            total: width,
            parts: {
                lengths: [widthLeft, widhtMiddle, widthRight],
                offsets: [] as number[],
            },
            margins: {
                lengths: [widthMarginLeft, widthMarginMiddleLeft, widthMarginMiddleRight, widthMarginRight],
                offsets: [] as number[],
            },
            border: 10,
        },
        height: {
            total: height,
            parts: {
                lengths: [heightTop, heightMiddle, heightBottom],
                offsets: [] as number[],
            },
            margins: {
                lengths: [heightMarginTop, heightMarginMiddleTop, heightMarginMiddleBottom, heightMarginBottom],
                offsets: [] as number[],
            },
            border: 10,
        },
        extension: {
            total: heightExtension,
            parts: {
                lengths: [heightExtensionMiddle],
                offsets: [] as number[],
            },
            margins: {
                lengths: [heightExtensionMarginTop, heightExtensionMarginBottom],
                offsets: [] as number[],
            },
        }
    } as CellPopDimensionsGlobal;


    checkDimensionsGlobal(dimensionsGlobal);

    return dimensionsGlobal;
}

export function checkDimensionsGlobal(dimensionsGlobal: CellPopDimensionsGlobal) {

    // fill in all required dimensions

    // if total width is not specified, set it to default
    if (!dimensionsGlobal.width.total) {
        // if (dimensionsGlobal.width.parts.lengths.filter(i => i).length === dimensionsGlobal.width.parts.lengths.length) {
        //     if ()
        // }
        // if (dimensionsGlobal.width.lengths.filter(i => i).length === dimensionsGlobal.width.lengths.length) {
        //     dimensionsGlobal.width.total = dimensionsGlobal.width.lengths.reduce((a,b) => a+b, 0);
        // } else {
            dimensionsGlobal.width.total = 1000;
        // }
    }

    // if total height is not specified, set it to default
    if (!dimensionsGlobal.height.total) {
        // if (dimensionsGlobal.height.lengths.filter(i => i).length === dimensionsGlobal.height.lengths.length) {
        //     dimensionsGlobal.height.total = dimensionsGlobal.height.lengths.reduce((a,b) => a+b, 0);
        // } else {
            dimensionsGlobal.height.total = 1000;
        // }
    }

    // For all width and height options, check if specified. If not, set to default.
    // Check if fraction, if so, set to absolute.
    for (let i = 0; i < dimensionsGlobal.width.parts.lengths.length; i++) {
        if (!dimensionsGlobal.width.parts.lengths[i]) {
            dimensionsGlobal.width.parts.lengths[i] = 0.25 * dimensionsGlobal.width.total;
        }
        if (dimensionsGlobal.width.parts.lengths[i] < 1) {
            dimensionsGlobal.width.parts.lengths[i] *= dimensionsGlobal.width.total;
        }
    }

    for (let i = 0; i < dimensionsGlobal.width.margins.lengths.length; i++) {
        if (!dimensionsGlobal.width.margins.lengths[i]) {
            dimensionsGlobal.width.margins.lengths[i] = 0.05 * dimensionsGlobal.width.total;
        }
        if (dimensionsGlobal.width.margins.lengths[i] < 1) {
            dimensionsGlobal.width.margins.lengths[i] *= dimensionsGlobal.width.total;
        }
    }

    for (let i = 0; i < dimensionsGlobal.height.parts.lengths.length; i++) {
        if (!dimensionsGlobal.height.parts.lengths[i]) {
            dimensionsGlobal.height.parts.lengths[i] = 0.25 * dimensionsGlobal.height.total;
        }
        if (dimensionsGlobal.height.parts.lengths[i] < 1) {
            dimensionsGlobal.height.parts.lengths[i] *= dimensionsGlobal.height.total;
        }
    }

    for (let i = 0; i < dimensionsGlobal.height.margins.lengths.length; i++) {
        if (!dimensionsGlobal.height.margins.lengths[i]) {
            dimensionsGlobal.height.margins.lengths[i] = 0.05 * dimensionsGlobal.height.total;
        }
        if (dimensionsGlobal.height.margins.lengths[i] < 1) {
            dimensionsGlobal.height.margins.lengths[i] *= dimensionsGlobal.height.total;
        }
    }

    // check if all widths combine to the total width, otherwise resize
    const widthSum = [...dimensionsGlobal.width.parts.lengths, ...dimensionsGlobal.width.margins.lengths].reduce((a,b) => a+b, 0);
    if (widthSum !== (dimensionsGlobal.width.total - 2 * dimensionsGlobal.width.border)) {
        const widthScale = (dimensionsGlobal.width.total - 2 * dimensionsGlobal.width.border) / widthSum;
        for (let i = 0; i < dimensionsGlobal.width.parts.lengths.length; i++) {
            dimensionsGlobal.width.parts.lengths[i] *= widthScale;
        }
        for (let i = 0; i < dimensionsGlobal.width.margins.lengths.length; i++) {
            dimensionsGlobal.width.margins.lengths[i] *= widthScale;
        }
    }

    // check if all heights combine to the total height, otherwise resize
    const heightSum = [...dimensionsGlobal.height.parts.lengths, ...dimensionsGlobal.height.margins.lengths].reduce((a,b) => a+b, 0);
    if (heightSum !== dimensionsGlobal.height.total - 2 * dimensionsGlobal.height.border) {
        const heightScale = (dimensionsGlobal.height.total - 2 * dimensionsGlobal.height.border) / heightSum;
        for (let i = 0; i < dimensionsGlobal.height.parts.lengths.length; i++) {
            dimensionsGlobal.height.parts.lengths[i] *= heightScale;
        }
        for (let i = 0; i < dimensionsGlobal.height.margins.lengths.length; i++) {
            dimensionsGlobal.height.margins.lengths[i] *= heightScale;
        }
    }

    // create the offsets
    updateOffsets(dimensionsGlobal);
}

function updateOffsets(dimensionsGlobal: CellPopDimensionsGlobal) {

    // add border around sides
    const borderWidth = dimensionsGlobal.height.border;
    const borderHeight = dimensionsGlobal.width.border;

    // width parts
    dimensionsGlobal.width.parts.offsets = [borderWidth + dimensionsGlobal.width.margins.lengths[0]];
    let currWidthSum = borderWidth + dimensionsGlobal.width.margins.lengths[0];
    for (let i = 0; i < dimensionsGlobal.width.parts.lengths.length - 1; i++) {
        currWidthSum += dimensionsGlobal.width.parts.lengths[i];
        currWidthSum += dimensionsGlobal.width.margins.lengths[i+1];
        dimensionsGlobal.width.parts.offsets.push(currWidthSum);
    }

    // width margins
    dimensionsGlobal.width.margins.offsets = [borderWidth];
    currWidthSum = borderWidth;
    for (let i = 0; i < dimensionsGlobal.width.margins.lengths.length - 1; i++) {
        currWidthSum += dimensionsGlobal.width.margins.lengths[i];
        currWidthSum += dimensionsGlobal.width.parts.lengths[i];
        dimensionsGlobal.width.margins.offsets.push(currWidthSum);
    }

    // height parts
    dimensionsGlobal.height.parts.offsets = [borderHeight + dimensionsGlobal.height.margins.lengths[0]];
    let currHeightSum = borderHeight + dimensionsGlobal.height.margins.lengths[0];
    for (let i = 0; i < dimensionsGlobal.height.parts.lengths.length - 1; i++) {
        currHeightSum += dimensionsGlobal.height.parts.lengths[i];
        currHeightSum += dimensionsGlobal.height.margins.lengths[i+1];
        dimensionsGlobal.height.parts.offsets.push(currHeightSum);
    }

    // height margins
    dimensionsGlobal.height.margins.offsets = [borderHeight];
    currHeightSum = borderHeight;
    for (let i = 0; i < dimensionsGlobal.height.margins.lengths.length - 1; i++) {
        currHeightSum += dimensionsGlobal.height.margins.lengths[i];
        currHeightSum += dimensionsGlobal.height.parts.lengths[i];
        dimensionsGlobal.height.margins.offsets.push(currHeightSum);
    }
}

function getDimensionsText() {
    // todo: add these as params on top
    const textSizeGlobal = {
        title: "2em",
        label: "2em",
        labelSmall: "1em",
        tick: "1em"
    };

    const textSizeInd = {
        title: textSizeGlobal.title,
        labelX: textSizeGlobal.label,
        labelY: textSizeGlobal.label,
        labelColor: textSizeGlobal.label,
        labelXSide: textSizeGlobal.labelSmall,
        labelYSide: textSizeGlobal.labelSmall,
        tickX: textSizeGlobal.tick,
        tickY: textSizeGlobal.tick,
        tickColor: textSizeGlobal.tick,
        tickXSide: textSizeGlobal.tick,
        tickYSide: textSizeGlobal.tick,
    };

    const textSize = {
        global: textSizeGlobal,
        ind: textSizeInd
    };

    return textSize;
}

/**
 * Using the dimensionsGlobal, fill in all dimensions of individual parts
 * @param dimensionsGlobal
 * @returns CellPopDimensions
 */
export function getDimensionsFromGlobal(dimensionsGlobal: CellPopDimensionsGlobal): CellPopDimensions {

    const dimensions = {
		global: dimensionsGlobal,
        heatmap: getDimType(dimensionsGlobal, 1, 1),
        heatmapLegend: getDimType(dimensionsGlobal, 2, 1),
        barTop: getDimType(dimensionsGlobal, 1, 0),
        violinTop: getDimType(dimensionsGlobal, 1, 0),
        barLeft: getDimType(dimensionsGlobal, 0, 1),
        violinLeft: getDimType(dimensionsGlobal, 0, 1),
        graph: getDimType(dimensionsGlobal, 1, 2),
		detailBar: {offsetWidth: dimensionsGlobal.width.parts.offsets[1], offsetHeight: dimensionsGlobal.height.parts.offsets[0], width: dimensionsGlobal.width.parts.lengths[1], height: dimensionsGlobal.extension.parts.lengths[0], margin: {left: dimensionsGlobal.width.margins.lengths[1], right: dimensionsGlobal.width.margins.lengths[2], top: dimensionsGlobal.extension.margins.lengths[0], bottom: dimensionsGlobal.extension.margins.lengths[1]}},
		textSize: getDimensionsText(),
	} as CellPopDimensions;

    return dimensions;
}

export function updateDimensionsWithGlobal(dimensions: CellPopDimensions): CellPopDimensions {
    const dimensionsGlobal = dimensions.global;
    dimensions.heatmap = getDimType(dimensionsGlobal, 1, 1);
    dimensions.heatmapLegend = getDimType(dimensionsGlobal, 2, 1);
    dimensions.barTop = getDimType(dimensionsGlobal, 1, 0);
    dimensions.violinTop = getDimType(dimensionsGlobal, 1, 0);
    dimensions.barLeft = getDimType(dimensionsGlobal, 0, 1);
    dimensions.violinLeft = getDimType(dimensionsGlobal, 0, 1);
    dimensions.graph = getDimType(dimensionsGlobal, 1, 2);
    dimensions.detailBar = {offsetWidth: dimensionsGlobal.width.parts.offsets[1], offsetHeight: dimensionsGlobal.height.parts.offsets[0], width: dimensionsGlobal.width.parts.lengths[1], height: dimensionsGlobal.extension.parts.lengths[0], margin: {left: dimensionsGlobal.width.margins.lengths[1], right: dimensionsGlobal.width.margins.lengths[2], top: dimensionsGlobal.extension.margins.lengths[0], bottom: dimensionsGlobal.extension.margins.lengths[1]}};
	// dimensions.textSize = {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}

    return dimensions;
}

function getDimType(dimensionsGlobal: CellPopDimensionsGlobal, widthPosition: number, heightPosition: number) {
    const dim = {} as CellPopDimensionsValue;
    dim.width = dimensionsGlobal.width.parts.lengths[widthPosition];
    dim.offsetWidth = dimensionsGlobal.width.parts.offsets[widthPosition];
    dim.height = dimensionsGlobal.height.parts.lengths[heightPosition];
    dim.offsetHeight = dimensionsGlobal.height.parts.offsets[heightPosition];
    dim.margin = {
        left: dimensionsGlobal.width.margins.lengths[widthPosition],
        right: dimensionsGlobal.width.margins.lengths[widthPosition+1],
        top: dimensionsGlobal.height.margins.lengths[heightPosition],
        bottom: dimensionsGlobal.height.margins.lengths[heightPosition+1],
    };
    return dim;
}


/** UPDATE DIMENSIONS */

export function drawSizeBoundaries(data: CellPopData, dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, metadataField?: string) {

    const dimensionsGlobal = dimensions.global;

    // Remove any prior size
	d3.select("g.boundary").remove();

    const svg = d3.select("g.main")
        .append("g")
        .attr("class", "boundary");

    // define drag behaviour
    const drag = d3.drag();

    let className = "";

    drag.on("start", function(event) {
        // set as active
        className = event.sourceEvent.target.classList[0] as string;
        d3.select(`.${className}`).classed("active", true);
    });
    drag.on("drag", function(event) {
        switch(className) {
            case "boundary-width0": // between side and margin 0
                if (event.x < 0) {
                    // make svg bigger
                    dimensionsGlobal.width.total += 0 - event.x;
                    dimensionsGlobal.width.margins.lengths[0] += 0 - event.x;
                    // update all offsets
                    updateOffsets(dimensionsGlobal);

                }
                if (event.x > 0 && event.x < dimensionsGlobal.width.parts.offsets[0]) {
                    // make svg smaller
                    dimensionsGlobal.width.total -= event.x;
                    dimensionsGlobal.width.margins.lengths[0] -= event.x;
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                break;
            case "boundary-width1": // between margin 0 and part 0
                if (event.x > dimensionsGlobal.width.border && event.x < dimensionsGlobal.width.margins.offsets[1]) {
                    dimensionsGlobal.width.parts.offsets[0] = event.x;
                    dimensionsGlobal.width.margins.lengths[0] = event.x - dimensionsGlobal.width.border;
                    dimensionsGlobal.width.parts.lengths[0] = dimensionsGlobal.width.margins.offsets[1] - event.x;
                }
                break;
            case "boundary-width2": // between part 0 and margin 1
                if (event.x > dimensionsGlobal.width.parts.offsets[0] && event.x < dimensionsGlobal.width.parts.offsets[1]) {
                    dimensionsGlobal.width.margins.offsets[1] = event.x;
                    dimensionsGlobal.width.parts.lengths[0] = event.x - dimensionsGlobal.width.parts.offsets[0];
                    dimensionsGlobal.width.margins.lengths[1] = dimensionsGlobal.width.parts.offsets[1] - event.x;
                }
                break;
            case "boundary-width3": // between margin 1 and part 2
                if (event.x > dimensionsGlobal.width.margins.offsets[1] && event.x < dimensionsGlobal.width.margins.offsets[2]) {
                    dimensionsGlobal.width.parts.offsets[1] = event.x;
                    dimensionsGlobal.width.margins.lengths[1] = event.x - dimensionsGlobal.width.margins.offsets[1];
                    dimensionsGlobal.width.parts.lengths[1] = dimensionsGlobal.width.margins.offsets[2] - event.x;
                }
                break;
            case "boundary-width4": // between part 2 and margin 2
                if (event.x > dimensionsGlobal.width.parts.offsets[1] && event.x < dimensionsGlobal.width.parts.offsets[2]) {
                    dimensionsGlobal.width.margins.offsets[2] = event.x;
                    dimensionsGlobal.width.parts.lengths[1] = event.x - dimensionsGlobal.width.parts.offsets[1];
                    dimensionsGlobal.width.margins.lengths[2] = dimensionsGlobal.width.parts.offsets[2] - event.x;
                }
                break;
            case "boundary-width5": // between margin 2 and part 3
                if (event.x > dimensionsGlobal.width.margins.offsets[2] && event.x < dimensionsGlobal.width.margins.offsets[3]) {
                    dimensionsGlobal.width.parts.offsets[2] = event.x;
                    dimensionsGlobal.width.margins.lengths[2] = event.x - dimensionsGlobal.width.margins.offsets[2];
                    dimensionsGlobal.width.parts.lengths[2] = dimensionsGlobal.width.margins.offsets[3] - event.x;
                }
                break;
            case "boundary-width6": // between part 3 and margin 4
                if (event.x > dimensionsGlobal.width.parts.offsets[2] && event.x < dimensionsGlobal.width.total - dimensionsGlobal.width.border) {
                    dimensionsGlobal.width.margins.offsets[3] = event.x;
                    dimensionsGlobal.width.parts.lengths[2] = event.x - dimensionsGlobal.width.parts.offsets[2];
                    dimensionsGlobal.width.margins.lengths[3] = dimensionsGlobal.width.total - event.x;
                }
                break;
            case "boundary-width7": // between margin 4 and side
                if (event.x > dimensionsGlobal.width.margins.offsets[3] && event.x < dimensionsGlobal.width.total - dimensionsGlobal.width.border) {
                    // make svg smaller
                    dimensionsGlobal.width.total -= event.x - dimensionsGlobal.width.margins.offsets[3];
                    dimensionsGlobal.width.margins.lengths[3] -= event.x - dimensionsGlobal.width.margins.offsets[3];
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                if (event.x > dimensionsGlobal.width.total - dimensionsGlobal.width.border) {
                    // make svg bigger
                    dimensionsGlobal.width.total = event.x + dimensionsGlobal.width.border;
                    dimensionsGlobal.width.margins.lengths[3] += event.x - dimensionsGlobal.width.margins.offsets[3];
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                break;
            case "boundary-height0": // between side and margin 0
                if (event.y < 0) {
                    // make svg bigger
                    dimensionsGlobal.height.total += 0 - event.y;
                    dimensionsGlobal.height.margins.lengths[0] += 0 - event.y;
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                if (event.y > 0 && event.y < dimensionsGlobal.height.parts.offsets[0]) {
                    // make svg smaller
                    dimensionsGlobal.height.total -= event.y;
                    dimensionsGlobal.height.margins.lengths[0] -= event.y;
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                break;
            case "boundary-height1": // between margin 0 and part 0
                if (event.y > dimensionsGlobal.height.border && event.y < dimensionsGlobal.height.margins.offsets[1]) {
                    dimensionsGlobal.height.parts.offsets[0] = event.y;
                    dimensionsGlobal.height.margins.lengths[0] = event.y - dimensionsGlobal.height.border;
                    dimensionsGlobal.height.parts.lengths[0] = dimensionsGlobal.height.margins.offsets[1] - event.y;
                }
                break;
            case "boundary-height2": // between part 0 and margin 1
                if (event.y > dimensionsGlobal.height.parts.offsets[0] && event.y < dimensionsGlobal.height.parts.offsets[1]) {
                    dimensionsGlobal.height.margins.offsets[1] = event.y;
                    dimensionsGlobal.height.parts.lengths[0] = event.y - dimensionsGlobal.height.parts.offsets[0];
                    dimensionsGlobal.height.margins.lengths[1] = dimensionsGlobal.height.parts.offsets[1] - event.y;
                }
                break;
            case "boundary-height3": // between margin 1 and part 2
                if (event.y > dimensionsGlobal.height.margins.offsets[1] && event.y < dimensionsGlobal.height.margins.offsets[2]) {
                    dimensionsGlobal.height.parts.offsets[1] = event.y;
                    dimensionsGlobal.height.margins.lengths[1] = event.y - dimensionsGlobal.height.margins.offsets[1];
                    dimensionsGlobal.height.parts.lengths[1] = dimensionsGlobal.height.margins.offsets[2] - event.y;
                }
                break;
            case "boundary-height4": // between part 2 and margin 2
                if (event.y > dimensionsGlobal.height.parts.offsets[1] && event.y < dimensionsGlobal.height.parts.offsets[2]) {
                    dimensionsGlobal.height.margins.offsets[2] = event.y;
                    dimensionsGlobal.height.parts.lengths[1] = event.y - dimensionsGlobal.height.parts.offsets[1];
                    dimensionsGlobal.height.margins.lengths[2] = dimensionsGlobal.height.parts.offsets[2] - event.y;
                }
                break;
            case "boundary-height5": // between margin 2 and part 3
                if (event.y > dimensionsGlobal.height.margins.offsets[2] && event.y < dimensionsGlobal.height.margins.offsets[3]) {
                    dimensionsGlobal.height.parts.offsets[2] = event.y;
                    dimensionsGlobal.height.margins.lengths[2] = event.y - dimensionsGlobal.height.margins.offsets[2];
                    dimensionsGlobal.height.parts.lengths[2] = dimensionsGlobal.height.margins.offsets[3] - event.y;
                }
                break;
            case "boundary-height6": // between part 3 and margin 4
                if (event.y > dimensionsGlobal.height.parts.offsets[2] && event.y < dimensionsGlobal.height.total - dimensionsGlobal.height.border) {
                    dimensionsGlobal.height.margins.offsets[3] = event.y;
                    dimensionsGlobal.height.parts.lengths[2] = event.y - dimensionsGlobal.height.parts.offsets[2];
                    dimensionsGlobal.height.margins.lengths[3] = dimensionsGlobal.height.total - event.y;
                }
                break;
            case "boundary-height7": // between margin 4 and side
                if (event.y > dimensionsGlobal.height.margins.offsets[3] && event.y < dimensionsGlobal.height.total - dimensionsGlobal.height.border) {
                    // make svg smaller
                    dimensionsGlobal.height.total -= event.y - dimensionsGlobal.height.margins.offsets[3];
                    dimensionsGlobal.height.margins.lengths[3] -= event.y - dimensionsGlobal.height.margins.offsets[3];
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                if (event.y > dimensionsGlobal.height.total - dimensionsGlobal.height.border) {
                    // make svg bigger
                    dimensionsGlobal.height.total = event.y + dimensionsGlobal.height.border;
                    dimensionsGlobal.height.margins.lengths[3] += event.y - dimensionsGlobal.height.margins.offsets[3];
                    // update all offsets
                    updateOffsets(dimensionsGlobal);
                }
                break;
            default:

        }
        updateDimensionsWithGlobal(dimensions);
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        resizeLabels(dimensions);
        updateLines(dimensionsGlobal);
    });
    drag.on("end", function() {
        updateDimensionsWithGlobal(dimensions);
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        resizeLabels(dimensions);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);

        // set as inactive
        d3.select(`.${className}`).classed("active", false);
    });

    // draw gridlines
    const gridLines = getGridLines(dimensionsGlobal);
    for (const line of gridLines) {
        const className = line[0];
        const sizing = line[1];
        createLine(svg, drag, className, sizing.x, sizing.y, sizing.width, sizing.height, sizing.color);
    }
}

function getGridLines(dimensionsGlobal: CellPopDimensionsGlobal) {

    const lineSize = 5;
    const lineSizeHalf = lineSize / 2;
    const colorLine = "grey";
    const colorSide = "red";
    const colorCorner = "red";

    const lineHeight = dimensionsGlobal.height.total - 2 * dimensionsGlobal.height.border;
    const lineWidth = dimensionsGlobal.width.total - 2 * dimensionsGlobal.width.border;

    // lines
    const lines = [
        ["width0", { x: 0, y: dimensionsGlobal.height.border, width: dimensionsGlobal.width.border, height: dimensionsGlobal.height.total, color: colorSide }],
        ["width1", { x: - lineSizeHalf + dimensionsGlobal.width.parts.offsets[0], y: dimensionsGlobal.height.border, width: lineSize, height: lineHeight, color: colorLine }],
        ["width2", { x: - lineSizeHalf + dimensionsGlobal.width.margins.offsets[1], y: dimensionsGlobal.height.border, width: lineSize, height: lineHeight, color: colorLine }],
        ["width3", { x: - lineSizeHalf + dimensionsGlobal.width.parts.offsets[1], y: dimensionsGlobal.height.border, width: lineSize, height: lineHeight, color: colorLine }],
        ["width4", { x: - lineSizeHalf + dimensionsGlobal.width.margins.offsets[2], y: dimensionsGlobal.height.border, width: lineSize, height: lineHeight, color: colorLine }],
        ["width5", { x: - lineSizeHalf + dimensionsGlobal.width.parts.offsets[2], y: dimensionsGlobal.height.border, width: lineSize, height: lineHeight, color: colorLine }],
        ["width6", { x: - lineSizeHalf + dimensionsGlobal.width.margins.offsets[3], y: dimensionsGlobal.height.border, width: lineSize, height: lineHeight, color: colorLine }],
        ["width7", { x: dimensionsGlobal.width.total - dimensionsGlobal.width.border, y: dimensionsGlobal.height.border, width: dimensionsGlobal.width.border, height: dimensionsGlobal.height.total, color: colorSide }],
        ["height0", { x: dimensionsGlobal.width.border, y: 0, width: dimensionsGlobal.width.total, height: dimensionsGlobal.height.border, color: colorSide }],
        ["height1", { x:  dimensionsGlobal.width.border, y: - lineSizeHalf + dimensionsGlobal.height.parts.offsets[0], width: lineWidth, height: lineSize, color: colorLine }],
        ["height2", { x: dimensionsGlobal.width.border, y: - lineSizeHalf + dimensionsGlobal.height.margins.offsets[1], width: lineWidth, height: lineSize, color: colorLine }],
        ["height3", { x: dimensionsGlobal.width.border, y: - lineSizeHalf + dimensionsGlobal.height.parts.offsets[1], width: lineWidth, height: lineSize, color: colorLine }],
        ["height4", { x: dimensionsGlobal.width.border, y: - lineSizeHalf + dimensionsGlobal.height.margins.offsets[2], width: lineWidth, height: lineSize, color: colorLine }],
        ["height5", { x: dimensionsGlobal.width.border, y: - lineSizeHalf + dimensionsGlobal.height.parts.offsets[2], width: lineWidth, height: lineSize, color: colorLine }],
        ["height6", { x: dimensionsGlobal.width.border, y: - lineSizeHalf + dimensionsGlobal.height.margins.offsets[3], width: lineWidth, height: lineSize, color: colorLine }],
        ["height7", { x: dimensionsGlobal.width.border, y: dimensionsGlobal.height.total - dimensionsGlobal.height.border, width: dimensionsGlobal.width.total, height: dimensionsGlobal.height.border, color: colorSide }]
    ] as [string, {x: number, y: number, width: number, height: number, color: string}][];

    return lines;
}

function createLine(svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>, drag: d3.DragBehavior<Element, unknown, unknown>, className: string, x: number, y: number, width: number, height: number, color: string) {
    const line = svg.append("rect")
        .attr("class", `boundary-${className}`)
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .style("fill", color)
        .call(drag);

    line.on("mouseover", (event) => {
        d3.select(event.target).style("opacity", 0.7);
    });

    line.on("mouseout", (event) => {
        d3.select(event.target).style("opacity", 1);
    });

}

function updateLines(dimensionsGlobal: CellPopDimensionsGlobal) {
    // reposition gridlines
    const gridLines = getGridLines(dimensionsGlobal);
    d3.select("g.boundary").raise();
    for (const line of gridLines) {
        const className = line[0];
        const sizing = line[1];
        const element = d3.select("g.boundary").select(`.boundary-${className}`);
        element.attr("x", sizing.x);
        element.attr("y", sizing.y);
        element.attr("width", sizing.width);
        element.attr("height", sizing.height);
    }
}

export function removeSizeBoundaries() {
    // Remove any prior size
	d3.select("g.boundary").remove();
}

function resizeLabels(dimensions: CellPopDimensions) {

    // later change this into an option
    const autoReziseLabels = true;
    if (!autoReziseLabels) {
        return;
    }

    const texts = [
        [dimensions.textSize.ind.tickY, "tickY", 0, 2/3 * dimensions.heatmap.margin.right],
        [dimensions.textSize.ind.labelY, "labelY", 0, 1/3 * dimensions.heatmap.margin.right],
        [dimensions.textSize.ind.tickX, "tickX", 45, 2/3 * dimensions.heatmap.margin.bottom],
        [dimensions.textSize.ind.labelX, "labelX", 0, 1/3 * dimensions.heatmap.margin.bottom],
    ] as [string, string, number, number][];


    // // select text from right axis
    // const axisrightText = d3.select(".axisright").selectAll("text");
    // // calculate the maximum size of the labels
    // const axisrightTextMaxWidth = d3.max(axisrightText.nodes(), n => (n as SVGTextElement).getComputedTextLength());

    // // calculate possible size
    // const sizePossible = 2/3 * dimensions.heatmap.margin.right;

    // if (axisrightTextMaxWidth > sizePossible) {
    //     console.log('here')
    //     const scale = sizePossible / axisrightTextMaxWidth;

    //     const sizeNow = dimensions.textSize.ind.tickY;
    //     const num = parseFloat(sizeNow.substring(0, sizeNow.length - 2));
    //     const letr = sizeNow.substring(sizeNow.length - 2, sizeNow.length);
    //     const sizeNew = `${num * scale}${letr}`;

    //     axisrightText.style("font-size", sizeNew);
    // }

    for (const text of texts) {
        const textElement = d3.selectAll(`.${text[1]}`);
        // todo: for labels, this calculates the size of the text as horizontal, not vertical, making them smaller than necessary
        const textElementMaxWidth = d3.max(textElement.nodes(), n => (n as SVGTextElement).getComputedTextLength());
        // if (text[2] !== 0) {
        //     if (text[2] !== 45) {
        //         console.warn("Text rotation unforeseen when calculating label size.")
        //     }
        //     console.log('text width changed')
        //     textElementMaxWidth = Math.sqrt((textElementMaxWidth ** 2) / 2);
        // }

        const sizePossible = text[3];

        if (textElementMaxWidth > sizePossible + 5 || textElementMaxWidth < sizePossible - 5) {
            const scale = sizePossible / textElementMaxWidth;

            const sizeNow = text[0];
            const num = parseFloat(sizeNow.substring(0, sizeNow.length - 2));
            const letr = sizeNow.substring(sizeNow.length - 2, sizeNow.length);
            const sizeNew = `${num * scale}${letr}`;

            textElement.style("font-size", sizeNew);
            text[0] = sizeNew;
            dimensions.textSize.ind[text[1]] = sizeNew;
        }
    }


    // // if the labels are larger than the margin space, resize
    // if (axisrightTextMaxWidth > dimensions.heatmap.margin.right) {
    //     // todo: resize properly
    //     axisrightText.style("font-size", 5);
    // }


    // // select text from bottom axis
    // const axisbottomText = d3.select(".axisbottom").selectAll("text");
    // // calculate the maximum size of the labels
    // const axisbottomTextMaxWidth = d3.max(axisbottomText.nodes(), n => (n as SVGTextElement).getComputedTextLength());

    // // if the labels are larger than the margin space, resize
    // if (axisbottomTextMaxWidth > dimensions.heatmap.margin.bottom) {
    //     axisbottomText.style("font-size", 5);
    // }
}