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
            dimensionsGlobal.width.parts.lengths[i] = 0.3 * dimensionsGlobal.width.total;
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
            dimensionsGlobal.height.parts.lengths[i] = 0.3 * dimensionsGlobal.height.total;
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
    if (widthSum !== dimensionsGlobal.width.total) {
        const widthScale = dimensionsGlobal.width.total / widthSum;
        for (let i = 0; i < dimensionsGlobal.width.parts.lengths.length; i++) {
            dimensionsGlobal.width.parts.lengths[i] *= widthScale;
        }
        for (let i = 0; i < dimensionsGlobal.width.margins.lengths.length; i++) {
            dimensionsGlobal.width.margins.lengths[i] *= widthScale;
        }
    }

    // check if all heights combine to the total height, otherwise resize
    const heightSum = [...dimensionsGlobal.height.parts.lengths, ...dimensionsGlobal.height.margins.lengths].reduce((a,b) => a+b, 0);
    if (heightSum !== dimensionsGlobal.height.total) {
        const heightScale = dimensionsGlobal.height.total / heightSum;
        for (let i = 0; i < dimensionsGlobal.height.parts.lengths.length; i++) {
            dimensionsGlobal.height.margins.lengths[i] *= heightScale;
        }
    }

    // create the offsets
    updateOffsets(dimensionsGlobal);
}

function updateOffsets(dimensionsGlobal: CellPopDimensionsGlobal) {

    // width parts
    dimensionsGlobal.width.parts.offsets = [dimensionsGlobal.width.margins.lengths[0]];
    let currWidthSum = dimensionsGlobal.width.margins.lengths[0];
    for (let i = 0; i < dimensionsGlobal.width.parts.lengths.length - 1; i++) {
        currWidthSum += dimensionsGlobal.width.parts.lengths[i];
        currWidthSum += dimensionsGlobal.width.margins.lengths[i+1];
        dimensionsGlobal.width.parts.offsets.push(currWidthSum);
    }

    // width margins
    dimensionsGlobal.width.margins.offsets = [0];
    currWidthSum = 0;
    for (let i = 0; i < dimensionsGlobal.width.margins.lengths.length - 1; i++) {
        currWidthSum += dimensionsGlobal.width.margins.lengths[i];
        currWidthSum += dimensionsGlobal.width.parts.lengths[i];
        dimensionsGlobal.width.margins.offsets.push(currWidthSum);
    }

    // height parts
    dimensionsGlobal.height.parts.offsets = [dimensionsGlobal.height.margins.lengths[0]];
    let currHeightSum = dimensionsGlobal.height.margins.lengths[0];
    for (let i = 0; i < dimensionsGlobal.height.parts.lengths.length - 1; i++) {
        currHeightSum += dimensionsGlobal.height.parts.lengths[i];
        currHeightSum += dimensionsGlobal.height.margins.lengths[i+1];
        dimensionsGlobal.height.parts.offsets.push(currHeightSum);
    }

    // height margins
    dimensionsGlobal.height.margins.offsets = [0];
    currHeightSum = 0;
    for (let i = 0; i < dimensionsGlobal.height.margins.lengths.length - 1; i++) {
        currHeightSum += dimensionsGlobal.height.margins.lengths[i];
        currHeightSum += dimensionsGlobal.height.parts.lengths[i];
        dimensionsGlobal.height.margins.offsets.push(currHeightSum);
    }
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
		textSize: {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}
	} as CellPopDimensions;

    return dimensions;
}

export function updateDimensionsWithGlobal(dimensions: CellPopDimensions): CellPopDimensions {
    const dimensionsGlobal = dimensions.global;
    dimensions.heatmap = getDimType(dimensionsGlobal, 1, 1),
    dimensions.heatmapLegend = getDimType(dimensionsGlobal, 2, 1),
    dimensions.barTop = getDimType(dimensionsGlobal, 1, 0),
    dimensions.violinTop = getDimType(dimensionsGlobal, 1, 0),
    dimensions.barLeft = getDimType(dimensionsGlobal, 0, 1),
    dimensions.violinLeft = getDimType(dimensionsGlobal, 0, 1),
    dimensions.graph = getDimType(dimensionsGlobal, 1, 2),
    dimensions.detailBar = {offsetWidth: dimensionsGlobal.width.parts.offsets[1], offsetHeight: dimensionsGlobal.height.parts.offsets[0], width: dimensionsGlobal.width.parts.lengths[1], height: dimensionsGlobal.extension.parts.lengths[0], margin: {left: dimensionsGlobal.width.margins.lengths[1], right: dimensionsGlobal.width.margins.lengths[2], top: dimensionsGlobal.extension.margins.lengths[0], bottom: dimensionsGlobal.extension.margins.lengths[1]}},
	dimensions.textSize = {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}

    return dimensions;
}

function getDimType(dimensionsGlobal: CellPopDimensionsGlobal, widthPosition: number, heightPosition: number) {
    let dim = {} as CellPopDimensionsValue;
    dim.width = dimensionsGlobal.width.parts.lengths[widthPosition];
    dim.offsetWidth = dimensionsGlobal.width.parts.offsets[widthPosition];
    dim.height = dimensionsGlobal.height.parts.lengths[heightPosition];
    dim.offsetHeight = dimensionsGlobal.height.parts.offsets[heightPosition];
    dim.margin = {
        left: dimensionsGlobal.width.margins.lengths[widthPosition],
        right: dimensionsGlobal.width.margins.lengths[widthPosition+1],
        top: dimensionsGlobal.height.margins.lengths[heightPosition],
        bottom: dimensionsGlobal.height.margins.lengths[heightPosition+1],
    }
    return dim;
}


/** UPDATE DIMENSIONS */

export function drawSizeBoundaries(data: CellPopData, dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, metadataField?: string) {

    const dimensionsGlobal = dimensions.global;

    // Remove any prior size
	d3.select("g.boundary").remove();

    const svg = d3.select("g.main")
        .append("g")
        .attr("class", "boundary")

    // define drag behaviour
    const drag = d3.drag()

    let className = "";

    drag.on("start", function(event) {
        // set as active
        className = event.sourceEvent.target.classList[0] as string;
        d3.select(`.${className}`).classed("active", true);
    })
    drag.on("drag", function(event) {
        const element = d3.select(`.${className}`)
        switch(className) {
            case 'boundary-width0': // between side and margin 0
                if (event.x < 0) {
                    // make svg bigger
                }
                if (event.x > 0 && event.x < dimensionsGlobal.width.parts.offsets[0]) {
                    // make svg smaller

                    // element.attr("x", event.x);
                    // dimensionsGlobal.width.margins.offsets[0] = event.x;
                    // dimensionsGlobal.width.margins.lengths[0] = event.x;
                    // dimensionsGlobal.width.parts
                    // dimensionsGlobal.width.offsets[1] = event.x;
                    // dimensionsGlobal.width.lengths[1] = dimensionsGlobal.width.offsets[1] - dimensionsGlobal.width.offsets[0];
                    // dimensionsGlobal.width.lengths[2] = dimensionsGlobal.width.offsets[2] - dimensionsGlobal.width.offsets[1];
                }
                break;
            case 'boundary-width1': // between margin 0 and part 0
                if (event.x > 0 && event.x < dimensionsGlobal.width.margins.offsets[1]) {
                    element.attr("x", event.x);
                    dimensionsGlobal.width.parts.offsets[0] = event.x;
                    dimensionsGlobal.width.margins.lengths[0] = event.x;
                    dimensionsGlobal.width.parts.lengths[0] = dimensionsGlobal.width.margins.offsets[1] - event.x;
                }
                break;
            case 'boundary-width2': // between part 0 and margin 1
                if (event.x > dimensionsGlobal.width.parts.offsets[0] && event.x < dimensionsGlobal.width.parts.offsets[1]) {
                    element.attr("x", event.x);
                    dimensionsGlobal.width.margins.offsets[1] = event.x;
                    dimensionsGlobal.width.parts.lengths[0] = event.x - dimensionsGlobal.width.parts.offsets[0];
                    dimensionsGlobal.width.margins.lengths[1] = dimensionsGlobal.width.parts.offsets[1] - event.x;
                }
                break;
            case 'boundary-width3': // between margin 1 and part 2
                if (event.x > dimensionsGlobal.width.margins.offsets[1] && event.x < dimensionsGlobal.width.margins.offsets[2]) {
                    element.attr("x", event.x);
                    dimensionsGlobal.width.parts.offsets[1] = event.x;
                    dimensionsGlobal.width.margins.lengths[1] = event.x - dimensionsGlobal.width.margins.offsets[1];
                    dimensionsGlobal.width.parts.lengths[1] = dimensionsGlobal.width.margins.offsets[2] - event.x;
                }
                break;
            case 'boundary-width4': // between part 2 and margin 2
                if (event.x > dimensionsGlobal.width.parts.offsets[1] && event.x < dimensionsGlobal.width.parts.offsets[2]) {
                    element.attr("x", event.x);
                    dimensionsGlobal.width.margins.offsets[2] = event.x;
                    dimensionsGlobal.width.parts.lengths[1] = event.x - dimensionsGlobal.width.parts.offsets[1];
                    dimensionsGlobal.width.margins.lengths[2] = dimensionsGlobal.width.parts.offsets[2] - event.x;
                }
                break;
            case 'boundary-width5': // between margin 2 and part 3
                if (event.x > dimensionsGlobal.width.margins.offsets[2] && event.x < dimensionsGlobal.width.margins.offsets[3]) {
                    element.attr("x", event.x);
                    dimensionsGlobal.width.parts.offsets[2] = event.x;
                    dimensionsGlobal.width.margins.lengths[2] = event.x - dimensionsGlobal.width.margins.offsets[2];
                    dimensionsGlobal.width.parts.lengths[2] = dimensionsGlobal.width.margins.offsets[3] - event.x;
                }
                break;
            case 'boundary-width6': // between part 3 and margin 4
                if (event.x > dimensionsGlobal.width.parts.offsets[2] && event.x < dimensionsGlobal.width.parts.offsets[3]) {
                    element.attr("x", event.x);
                    dimensionsGlobal.width.margins.offsets[3] = event.x;
                    dimensionsGlobal.width.parts.lengths[2] = event.x - dimensionsGlobal.width.parts.offsets[2];
                    dimensionsGlobal.width.margins.lengths[3] = dimensionsGlobal.width.parts.offsets[3] - event.x;
                }
                break;
            case 'boundary-width7': // between margin 4 and side
                if (event.x > dimensionsGlobal.width.margins.offsets[3] && event.x < dimensionsGlobal.width.margins.offsets[4]) {
                    // make svg smaller
                }
                if (event.x > dimensionsGlobal.width.margins.offsets[4]) {
                    // make svg bigger
                }
                break;
            default:
                
        } 
       
        updateDimensionsWithGlobal(dimensions)
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        resizeLabels(dimensions);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
    })
    drag.on("end", function() {
        updateDimensionsWithGlobal(dimensions);
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        resizeLabels(dimensions);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
        
        // set as inactive
        d3.select(`.${className}`).classed("active", false);
    })

    const lineSize = 5;
    const lineSizeHalf = lineSize / 2
    const colorLine = 'grey';
    const colorSide = 'red';
    const colorCorner = 'red';

    createLine(svg, drag, 'width0', lineSize + dimensionsGlobal.width.margins.offsets[0], 0, lineSize, dimensionsGlobal.height.total, colorSide);
    createLine(svg, drag, 'width1', lineSizeHalf + dimensionsGlobal.width.parts.offsets[0], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width2', lineSizeHalf + dimensionsGlobal.width.margins.offsets[1], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width3', lineSizeHalf + dimensionsGlobal.width.parts.offsets[1], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width4', lineSizeHalf + dimensionsGlobal.width.margins.offsets[2], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width5', lineSizeHalf + dimensionsGlobal.width.parts.offsets[2], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width6', lineSizeHalf + dimensionsGlobal.width.margins.offsets[3], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width7', lineSizeHalf + dimensionsGlobal.width.parts.offsets[3], 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width8', - lineSize + dimensionsGlobal.width.total, 0, lineSize, dimensionsGlobal.height.total, colorSide);
}

function createLine(svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>, drag: d3.DragBehavior<Element, unknown, unknown>, className: string, x: number, y: number, width: number, height: number, color: string) {
    const line = svg.append("rect")
        .attr("class", `boundary-${className}`)
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .style("fill", color)
        .call(drag)

    line.on("mouseover", (event) => {
        d3.select(event.target).style("opacity", 0.7)
    })

    line.on("mouseout", (event) => {
        d3.select(event.target).style("opacity", 1)
    })
    
}

export function removeSizeBoundaries() {
    // Remove any prior size
	d3.select("g.boundary").remove();
}

function resizeLabels(dimensions: CellPopDimensions) {
    // select text from right axis
    const axisrightText = d3.select(".axisright").selectAll("text");
    // calculate the maximum size of the labels
    const axisrightTextMaxWidth = d3.max(axisrightText.nodes(), n => (n as SVGTextElement).getComputedTextLength());

    // if the labels are larger than the margin space, resize
    if (axisrightTextMaxWidth > dimensions.heatmap.margin.right) {
        // todo: resize properly
        axisrightText.style("font-size", 5);
    }
    

    // select text from bottom axis
    const axisbottomText = d3.select(".axisbottom").selectAll("text");
    // calculate the maximum size of the labels
    const axisbottomTextMaxWidth = d3.max(axisbottomText.nodes(), n => (n as SVGTextElement).getComputedTextLength());

    // if the labels are larger than the margin space, resize
    if (axisbottomTextMaxWidth > dimensions.heatmap.margin.bottom) {
        axisbottomText.style("font-size", 5);
    }
}