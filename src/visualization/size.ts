import * as d3 from "d3";
import { renderCellPopVisualization } from ".";
import { CellPopData, CellPopDimensions, CellPopDimensionsGlobal, CellPopThemeColors } from "../cellpop-schema";


/** UPDATE DIMENSIONS */

export function drawSizeBoundaries(data: CellPopData, dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, metadataField?: string) {

    const dimensionsGlobal = dimensions.global;
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

    let dimensionsNew = dimensions;

    drag.on("start", function(event) {
        // set as active
        className = event.sourceEvent.target.classList[0] as string;
        d3.select(`.${className}`).classed("active", true);
    })
    drag.on("drag", function(event) {
        const element = d3.select(`.${className}`)
        switch(className) {
            case 'boundary-width0':
                break;
            case 'boundary-width1':
                // needs to be bigger than the previous and smaller than the next
                // use  // todo: create array with all the offsets of each line
                if (event.x > 0 && event.x < 10) {
                    element.attr("x", event.x);
                    // new thing
                    dimensionsGlobal.width.margins.left = 10;
                }
               
                break;
            case 'boundary-width2':
                break;
            case 'boundary-width3':
                break;
            case 'boundary-width4':
                break;
            case 'boundary-width5':
                break;
            case 'boundary-width6':
                break;
            case 'boundary-width7':
                break;
            default:
                
        } 
        // if (className === "boundary-left") {
        //     element.attr("x", event.x);
        //     widthLeft = event.x;
        //     widthRight = width - widthLeft;
        // }
        // if (className === "boundary-right") {
        //     element.attr("x", event.x);
        //     width = event.x;
        //     widthRight = width - widthLeft;
        // }
        // if (className === "boundary-top") {
        //     element.attr("y", event.y);
        //     heightTop = event.y;
        //     heightBottom = height - heightTop;
        // }
        // if (className === "boundary-bottom") {
        //     element.attr("y", event.y);
        //     height = event.y;
        //     heightBottom = height - heightTop;
        // }
        updateDimensionsWithGlobal(dimensions)
        //updateDimensions(dimensions, width, height, widthLeft, widthRight, heightTop, heightBottom)
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
    })
    drag.on("end", function() {
        updateDimensionsWithGlobal(dimensions);
        //updateDimensions(dimensions, width, height, widthLeft, widthRight, heightTop, heightBottom)
        d3.selectAll("svg").attr("width", dimensionsGlobal.width.total).attr("height", dimensionsGlobal.height.total);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
        
        // set as inactive
        d3.select(`.${className}`).classed("active", false);
    })

     const lineSize = 5;
    const lineSizeHalf = lineSize / 2
    const colorLine = 'grey';
    const colorCorner = 'red';

    // todo: create array with all the offsets of each line
    
    // createLine(svg, drag, 'width0', lineSize, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width1', lineSizeHalf + dimensionsGlobal.width.margins.left, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width2', lineSizeHalf + dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width3', lineSizeHalf + dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left + dimensionsGlobal.width.margins.middleLeft, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width4', lineSizeHalf + dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left + dimensionsGlobal.width.margins.middleLeft + dimensionsGlobal.width.parts.middle, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width5', lineSizeHalf + dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left + dimensionsGlobal.width.margins.middleLeft + dimensionsGlobal.width.parts.middle + dimensionsGlobal.width.margins.middleRight, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width6', lineSizeHalf + dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left + dimensionsGlobal.width.margins.middleLeft + dimensionsGlobal.width.parts.middle + dimensionsGlobal.width.margins.middleRight + dimensionsGlobal.width.parts.right, 0, lineSize, dimensionsGlobal.height.total, colorLine);
    createLine(svg, drag, 'width7', - lineSizeHalf + dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left + dimensionsGlobal.width.margins.middleLeft + dimensionsGlobal.width.parts.middle + dimensionsGlobal.width.margins.middleRight + dimensionsGlobal.width.parts.right + dimensionsGlobal.width.margins.right, 0, lineSize, dimensionsGlobal.height.total, colorLine);

    // leftBoundary.call(drag);
    // rightBoundary.call(drag);
    // topBoundary.call(drag);
    // bottomBoundary.call(drag);
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


function updateDimensions(dimensions: CellPopDimensions, width: number, height: number, widthLeft: number, widthRight: number, heightTop: number, heightBottom: number) {
    // fill in all required dimensions
    // dimensions.global = {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]};
    // dimensions.heatmap = {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}};
    // dimensions.barTop = {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}};
    // dimensions.violinTop = {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}};
    // dimensions.barLeft = {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}};
    // dimensions.violinLeft = {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}};
    // dimensions.graph = {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}};
    // dimensions.detailBar = {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}};
    // dimensions.textSize = {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'};
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
    heightExtensionMarginTop?: number,
    heightExtensionMarginBottom?: number
): CellPopDimensions {
    const dimensionsGlobal = getDimensionsGlobal(width, widthLeft, widhtMiddle, widthRight, widthMarginLeft, widthMarginMiddleLeft, widthMarginMiddleRight, widthMarginRight, height, heightTop, heightMiddle, heightBottom, heightMarginTop, heightMarginMiddleTop, heightMarginMiddleBottom, heightMarginBottom, heightExtension, heightExtensionMarginTop, heightExtensionMarginBottom);

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
    heightExtensionMarginTop?: number,
    heightExtensionMarginBottom?: number
): CellPopDimensionsGlobal {

    const dimensionsGlobal = {
        width: {
            total: width,
            parts: {
                left: widthLeft,
                middle: widhtMiddle,
                right: widthRight,
            },
            margins: {
                left: widthMarginLeft,
                middleLeft: widthMarginMiddleLeft,
                middleRight: widthMarginMiddleRight,
                right: widthMarginRight,
            }
        },
        height: {
            total: height,
            parts: {
                top: heightTop,
                middle: heightMiddle,
                bottom: heightBottom,
            },
            margins: {
                top: heightMarginTop,
                middleTop: heightMarginMiddleTop,
                middleBottom: heightMarginMiddleBottom,
                bottom: heightMarginBottom,
                extensionTop: heightExtensionMarginTop,
                extensionBottom: heightExtensionMarginBottom,
            },
        },
        extension: {
            height: heightExtension,
            heightMarginTop: heightExtensionMarginTop,
            heightMarginBottom: heightExtensionMarginBottom,
        }
    } as CellPopDimensionsGlobal;


    checkDimensionsGlobal(dimensionsGlobal);
    
    return dimensionsGlobal;
}

export function checkDimensionsGlobal(dimensionsGlobal: CellPopDimensionsGlobal) {
    
    // fill in all required dimensions

    // if total width is not specified, set it to default
    if (!dimensionsGlobal.width.total) {
        dimensionsGlobal.width.total = 1000;
    }

    // if total height is not specified, set it to default
    if (!dimensionsGlobal.height.total) {
        dimensionsGlobal.height.total = 1000;
    }

    // for all width and height options, check if specified. If not, set to default. 
    // if specified as ratio (0-1), set it to aboslute size.
    for (const widthOption of Object.keys(dimensionsGlobal.width.parts)) {
        if (!dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts]) {
            dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] = 0.3;
        }
        if (dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] < 1) {
            dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] *= dimensionsGlobal.width.total;
        }
    }

    for (let widthOption of Object.keys(dimensionsGlobal.width.margins)) {
        if (!dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins]) {
            dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] = 0.05;
        }
        if (dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] < 1) {
            dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] *= dimensionsGlobal.width.total;
        }
    }

    for (let heightOption of Object.keys(dimensionsGlobal.height.parts)) {
        if (!dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts]) {
            dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] = 0.3;
        }
        if (dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] < 1) {
            dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] *= dimensionsGlobal.height.total;
        }
    }

    for (let heightOption of Object.keys(dimensionsGlobal.height.margins)) {
        if (!dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins]) {
            dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] = 0.05;
        }
        if (dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] < 1) {
            dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] *= dimensionsGlobal.height.total;
        }
    }


    // check if all widths combine to the total width, otherwise resize
    const widthTotal = [...Object.values(dimensionsGlobal.width.parts), ...Object.values(dimensionsGlobal.width.margins)].reduce((a,b) => a+b, 0);
    if (dimensionsGlobal.width.total !== widthTotal) {
        const widthScale = dimensionsGlobal.width.total / widthTotal;
        // divide all by widthScale
        for (const widthOption of Object.keys(dimensionsGlobal.width.parts)) {
            dimensionsGlobal.width.parts[widthOption as keyof typeof dimensionsGlobal.width.parts] *= widthScale;
        }
    
        for (let widthOption of Object.keys(dimensionsGlobal.width.margins)) {
            dimensionsGlobal.width.margins[widthOption as keyof typeof dimensionsGlobal.width.margins] *= widthScale;
        }
    }

    // check if all heights combine to the total height, otherwise resize
    const heightTotal = [...Object.values(dimensionsGlobal.height.parts), ...Object.values(dimensionsGlobal.height.margins)].reduce((a,b) => a+b, 0);
    if (dimensionsGlobal.height.total !== heightTotal) {
        const heightScale = dimensionsGlobal.height.total / heightTotal;
        // divide all by widthScale
        for (const heightOption of Object.keys(dimensionsGlobal.height.parts)) {
            dimensionsGlobal.height.parts[heightOption as keyof typeof dimensionsGlobal.height.parts] *= heightScale;
        }
    
        for (let heightOption of Object.keys(dimensionsGlobal.height.margins)) {
            dimensionsGlobal.height.margins[heightOption as keyof typeof dimensionsGlobal.height.margins] *= heightScale;
        }
    }
}




export function getDimensionsFromGlobal(dimensionsGlobal: CellPopDimensionsGlobal): CellPopDimensions {
    const offsetWidth1 = dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left;
    const offsetWidth2 = offsetWidth1 + dimensionsGlobal.width.margins.middleLeft + dimensionsGlobal.width.parts.middle;

    const offsetHeight1 = dimensionsGlobal.height.margins.top + dimensionsGlobal.height.parts.top;
    const offsetHeight2 = offsetHeight1 + dimensionsGlobal.height.margins.middleTop + dimensionsGlobal.height.parts.middle;
    
    const dimensions = {
		global: dimensionsGlobal,
		heatmap: {offsetWidth: offsetWidth1, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
        //heatmapLegend: {offsetWidth: offsetWidth2, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.right, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.middleRight, right: dimensionsGlobal.width.margins.right, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
		barTop: {offsetWidth: offsetHeight1, offsetHeight: 0, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.height.parts.top, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.top, bottom: dimensionsGlobal.height.margins.middleTop}},
		violinTop: {offsetWidth: offsetWidth1, offsetHeight: 0, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.height.parts.top, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.top, bottom: dimensionsGlobal.height.margins.middleTop}},
		barLeft: {offsetWidth: 0, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.left, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.left, right: dimensionsGlobal.width.margins.middleLeft, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
		violinLeft: {offsetWidth: 0, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.left, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.left, right: dimensionsGlobal.width.margins.middleLeft, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
		graph: {offsetWidth: offsetWidth1, offsetHeight: offsetHeight2, width: dimensionsGlobal.width.parts.left, height: dimensionsGlobal.height.parts.bottom, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.middleBottom, bottom: dimensionsGlobal.height.margins.bottom}},
		detailBar: {offsetWidth: offsetWidth1, offsetHeight: 0, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.extension.height, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.extension.heightMarginTop, bottom: dimensionsGlobal.extension.heightMarginBottom}},
		textSize: {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}
	} as CellPopDimensions;

    return dimensions;
}


export function updateDimensionsWithGlobal(dimensions: CellPopDimensions): CellPopDimensions {
    const dimensionsGlobal = dimensions.global;
    const offsetWidth1 = dimensionsGlobal.width.margins.left + dimensionsGlobal.width.parts.left;
    const offsetWidth2 = offsetWidth1 + dimensionsGlobal.width.margins.middleLeft + dimensionsGlobal.width.parts.middle;

    const offsetHeight1 = dimensionsGlobal.height.margins.top + dimensionsGlobal.height.parts.top;
    const offsetHeight2 = offsetHeight1 + dimensionsGlobal.height.margins.middleTop + dimensionsGlobal.height.parts.middle;

    dimensions.heatmap = {offsetWidth: offsetWidth1, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
    //dimensions.heatmapLegend = {offsetWidth: offsetWidth2, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.right, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.middleRight, right: dimensionsGlobal.width.margins.right, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
	dimensions.barTop = {offsetWidth: offsetHeight1, offsetHeight: 0, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.height.parts.top, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.top, bottom: dimensionsGlobal.height.margins.middleTop}},
	dimensions.violinTop = {offsetWidth: offsetWidth1, offsetHeight: 0, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.height.parts.top, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.top, bottom: dimensionsGlobal.height.margins.middleTop}},
	dimensions.barLeft = {offsetWidth: 0, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.left, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.left, right: dimensionsGlobal.width.margins.middleLeft, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
    dimensions.violinLeft = {offsetWidth: 0, offsetHeight: offsetHeight1, width: dimensionsGlobal.width.parts.left, height: dimensionsGlobal.height.parts.middle, margin: {left: dimensionsGlobal.width.margins.left, right: dimensionsGlobal.width.margins.middleLeft, top: dimensionsGlobal.height.margins.middleTop, bottom: dimensionsGlobal.height.margins.middleBottom}},
	dimensions.graph = {offsetWidth: offsetWidth1, offsetHeight: offsetHeight2, width: dimensionsGlobal.width.parts.left, height: dimensionsGlobal.height.parts.bottom, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.height.margins.middleBottom, bottom: dimensionsGlobal.height.margins.bottom}},
	dimensions.detailBar = {offsetWidth: offsetWidth1, offsetHeight: 0, width: dimensionsGlobal.width.parts.middle, height: dimensionsGlobal.extension.height, margin: {left: dimensionsGlobal.width.margins.middleLeft, right: dimensionsGlobal.width.margins.middleRight, top: dimensionsGlobal.extension.heightMarginTop, bottom: dimensionsGlobal.extension.heightMarginBottom}},
	dimensions.textSize = {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}

    return dimensions;
}
