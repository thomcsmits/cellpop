import * as d3 from "d3";
import { renderCellPopVisualization } from ".";
import { CellPopData, CellPopDimensions, CellPopDimensionsGlobal, CellPopDimensionsValue, CellPopThemeColors } from "../cellpop-schema";


/** UPDATE DIMENSIONS */

export function drawSizeBoundaries(data: CellPopData, dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, metadataField?: string) {

    const dimensionsGlobal = dimensions.global;
    console.log('dimensionsGlobal', dimensionsGlobal)
    updateOffsets(dimensionsGlobal);
    console.log('dimensionsGlobal', dimensionsGlobal)


    // // get parameters
    // let width = dimensions.global.width.total;
    // let height = dimensions.global.height.total;

    // let widthLeft = dimensions.global.widthSplit[0];
    // let widthRight = dimensions.global.widthSplit[1];
    // let heightTop = dimensions.global.heightSplit[0];
    // let heightBottom = dimensions.global.heightSplit[1];

    // Remove any prior size
	d3.select("g.boundary").remove();

    const svg = d3.select("g.main")
        .append("g")
        .attr("class", "boundary")

    const drag = d3.drag()

    let className = "";

    // let dimensionsNew = dimensions;

    drag.on("start", function(event) {
        // set as active
        className = event.sourceEvent.target.classList[0] as string;
        d3.select(`.${className}`).classed("active", true);
    })
    drag.on("drag", function(event) {
        const element = d3.select(`.${className}`)
        console.log('classname', className)
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
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
    })
    drag.on("end", function() {
        updateDimensionsWithGlobal(dimensions);
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
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
    svg.append("rect")
        .attr("class", `boundary-${className}`)
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .style("fill", color)
        .call(drag)
}

export function removeSizeBoundaries() {
    // Remove any prior size
	d3.select("g.boundary").remove();
}



/** START DIMENSIONS */

// two options
// a 'CellPopDimensions' object
//      Check if it has all the requirements, then use this
// a list of dimensions
//      Create a 'CellPopDimensions' object with this

// export function getDimensions(width: number, height: number, widthLeft: number, widthRight: number, heightTop: number, heightBottom: number): CellPopDimensions {
//      // fill in all required dimensions
//      const dimensions = {
//         global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
//         heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}},
//         barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
//         violinTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
//         barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
//         violinLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
//         graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
//         detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
//         textSize: {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}
//     } as CellPopDimensions;

//     return dimensions;
// }

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

    console.log('dimensions', dimensions)
    
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

    // // for all width and height options, check if specified. If not, set to default. 
    // // if specified as ratio (0-1), set it to aboslute size.
    // for (const widthOption of Object.keys(dimensionsGlobal.width.parts)) {
    //     if (!dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts]) {
    //         dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] = 0.3;
    //     }
    //     if (dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] < 1) {
    //         dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] *= dimensionsGlobal.width.total;
    //     }
    // }

    // for (let widthOption of Object.keys(dimensionsGlobal.width.margins)) {
    //     if (!dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins]) {
    //         dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] = 0.05;
    //     }
    //     if (dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] < 1) {
    //         dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] *= dimensionsGlobal.width.total;
    //     }
    // }

    // for (let heightOption of Object.keys(dimensionsGlobal.height.parts)) {
    //     if (!dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts]) {
    //         dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] = 0.3;
    //     }
    //     if (dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] < 1) {
    //         dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] *= dimensionsGlobal.height.total;
    //     }
    // }

    // for (let heightOption of Object.keys(dimensionsGlobal.height.margins)) {
    //     if (!dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins]) {
    //         dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] = 0.05;
    //     }
    //     if (dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] < 1) {
    //         dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] *= dimensionsGlobal.height.total;
    //     }
    // }
    for (let i = 0; i < dimensionsGlobal.width.parts.lengths.length; i++) {
        if (!dimensionsGlobal.width.parts.lengths[i]) {
            dimensionsGlobal.width.parts.lengths[i] = 0.3 * dimensionsGlobal.width.total;
        }
    }

    for (let i = 0; i < dimensionsGlobal.width.margins.lengths.length; i++) {
        if (!dimensionsGlobal.width.margins.lengths[i]) {
            dimensionsGlobal.width.margins.lengths[i] = 0.05 * dimensionsGlobal.width.total;
        }
    }

    for (let i = 0; i < dimensionsGlobal.height.parts.lengths.length; i++) {
        if (!dimensionsGlobal.height.parts.lengths[i]) {
            dimensionsGlobal.height.parts.lengths[i] = 0.3 * dimensionsGlobal.height.total;
        }
    }

    for (let i = 0; i < dimensionsGlobal.height.margins.lengths.length; i++) {
        if (!dimensionsGlobal.height.margins.lengths[i]) {
            dimensionsGlobal.height.margins.lengths[i] = 0.05 * dimensionsGlobal.height.total;
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

    // // check if all widths combine to the total width, otherwise resize
    // const widthTotal = [...Object.values(dimensionsGlobal.width.parts), ...Object.values(dimensionsGlobal.width.margins)].reduce((a,b) => a+b, 0);
    // if (dimensionsGlobal.width.total !== widthTotal) {
    //     const widthScale = dimensionsGlobal.width.total / widthTotal;
    //     // divide all by widthScale
    //     for (const widthOption of Object.keys(dimensionsGlobal.width.parts)) {
    //         dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] *= widthScale;
    //     }
    
    //     for (let widthOption of Object.keys(dimensionsGlobal.width.margins)) {
    //         dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] *= widthScale;
    //     }
    // }

    // // check if all heights combine to the total height, otherwise resize
    // const heightTotal = [...Object.values(dimensionsGlobal.height.parts), ...Object.values(dimensionsGlobal.height.margins)].reduce((a,b) => a+b, 0);
    // if (dimensionsGlobal.height.total !== heightTotal) {
    //     const heightScale = dimensionsGlobal.height.total / heightTotal;
    //     // divide all by widthScale
    //     for (const heightOption of Object.keys(dimensionsGlobal.height.parts)) {
    //         dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] *= heightScale;
    //     }
    
    //     for (let heightOption of Object.keys(dimensionsGlobal.height.margins)) {
    //         dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] *= heightScale;
    //     }
    // }

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
