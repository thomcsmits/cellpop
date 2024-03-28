import * as d3 from "d3";
import { renderCellPopVisualization } from ".";
import { CellPopData, CellPopDimensions, CellPopDimensionsGlobal, CellPopThemeColors } from "../cellpop-schema";

export function drawSizeBoundaries(data: CellPopData, dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, metadataField?: string) {

    // get parameters
    let width = dimensions.global.width;
    let height = dimensions.global.height;
    let widthLeft = dimensions.global.widthSplit[0];
    let widthRight = dimensions.global.widthSplit[1];
    let heightTop = dimensions.global.heightSplit[0];
    let heightBottom = dimensions.global.heightSplit[1];

    // Remove any prior size
	d3.select("g.boundary").remove();

    const svg = d3.select("g.main")
        .append("g")
        .attr("class", "boundary")

    const leftBoundary = svg.append("rect")
        .attr("class", "boundary-left")
        .attr("x", widthLeft - 5)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", height)
        .style("fill", "grey")

    const rightBoundary = svg.append("rect")
        .attr("class", "boundary-right")
        .attr("x", width - 10)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", height)
        .style("fill", "grey")

    const topBoundary = svg.append("rect")
        .attr("class", "boundary-top")
        .attr("x", 0)
        .attr("y", heightTop - 5)
        .attr("width", width)
        .attr("height", 10)
        .style("fill", "grey")
    
    const bottomBoundary = svg.append("rect")
        .attr("class", "boundary-bottom")
        .attr("x", 0)
        .attr("y", height - 10)
        .attr("width", width)
        .attr("height", 10)
        .style("fill", "grey")

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
        if (className === "boundary-left") {
            element.attr("x", event.x);
            widthLeft = event.x;
            widthRight = width - widthLeft;
        }
        if (className === "boundary-right") {
            element.attr("x", event.x);
            width = event.x;
            widthRight = width - widthLeft;
        }
        if (className === "boundary-top") {
            element.attr("y", event.y);
            heightTop = event.y;
            heightBottom = height - heightTop;
        }
        if (className === "boundary-bottom") {
            element.attr("y", event.y);
            height = event.y;
            heightBottom = height - heightTop;
        }

        updateDimensions(dimensions, width, height, widthLeft, widthRight, heightTop, heightBottom)
        d3.selectAll("svg").attr("width", width).attr("height", height);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
    })
    drag.on("end", function() {
        updateDimensions(dimensions, width, height, widthLeft, widthRight, heightTop, heightBottom)
        d3.selectAll("svg").attr("width", width).attr("height", height);
        renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField);
        drawSizeBoundaries(data, dimensions, fraction, themeColors, metadataField);
        
        // set as inactive
        d3.select(`.${className}`).classed("active", false);
    })
    leftBoundary.call(drag);
    rightBoundary.call(drag);
    topBoundary.call(drag);
    bottomBoundary.call(drag);
}


export function removeSizeBoundaries() {
    // Remove any prior size
	d3.select("g.boundary").remove();
}


function updateDimensions(dimensions: CellPopDimensions, width: number, height: number, widthLeft: number, widthRight: number, heightTop: number, heightBottom: number) {
    // fill in all required dimensions
    dimensions.global = {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]};
    dimensions.heatmap = {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}};
    dimensions.barTop = {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}};
    dimensions.violinTop = {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}};
    dimensions.barLeft = {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}};
    dimensions.violinLeft = {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}};
    dimensions.graph = {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}};
    dimensions.detailBar = {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}};
    dimensions.textSize = {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'};
}

export function getDimensions(width: number, height: number, widthLeft: number, widthRight: number, heightTop: number, heightBottom: number): CellPopDimensions {
     // fill in all required dimensions
     const dimensions = {
        global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
        heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}},
        barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
        violinTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
        barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
        violinLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
        graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
        detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
        textSize: {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}
    } as CellPopDimensions;

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
    heightMarginBottom?: number) {

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
            }

        }
    } as CellPopDimensionsGlobal;


    getDimensionsFull(dimensionsGlobal);

    
    return dimensionsGlobal;
}

export function getDimensionsFull(dimensionsGlobal: CellPopDimensionsGlobal) {
    
    // fill in all required dimensions
    if (!dimensionsGlobal.width.total) {
        dimensionsGlobal.width.total = 1000;
    }

    if (!dimensionsGlobal.height.total) {
        dimensionsGlobal.height.total = 1000;
    }

    for (const widthOption of Object.keys(dimensionsGlobal.width.parts) as ('left' | 'middle' | 'right')[]) {
        if (!dimensionsGlobal.width.parts[widthOption]) {
            dimensionsGlobal.width.parts[widthOption] = 0.3;
        }
        if (dimensionsGlobal.width.parts[widthOption] < 1) {
            dimensionsGlobal.width.parts[widthOption] = dimensionsGlobal.width.parts[widthOption] * dimensionsGlobal.width.total;
        }
    }

    for (let widthOption of Object.keys(dimensionsGlobal.width.margins) as ('left' | 'middleLeft' | 'middleRight' | 'right')[]) {
        if (!dimensionsGlobal.width.margins[widthOption]) {
            dimensionsGlobal.width.margins[widthOption] = 0.05;
        }
        if (dimensionsGlobal.width.margins[widthOption] < 1) {
            dimensionsGlobal.width.margins[widthOption] = dimensionsGlobal.width.margins[widthOption] * dimensionsGlobal.width.total;
        }
    }

    for (let heightOption of Object.keys(dimensionsGlobal.height.parts) as ('top' | 'middle' | 'bottom')[]) {
        if (!dimensionsGlobal.height.parts[heightOption]) {
            dimensionsGlobal.height.parts[heightOption] = 0.3;
        }
        if (dimensionsGlobal.height.parts[heightOption] < 1) {
            dimensionsGlobal.height.parts[heightOption] = dimensionsGlobal.height.parts[heightOption] * dimensionsGlobal.height.total;
        }
    }

    for (let heightOption of Object.keys(dimensionsGlobal.height.margins) as ('top' | 'middleTop' | 'middleBottom' | 'bottom')[]) {
        if (!dimensionsGlobal.height.margins[heightOption]) {
            dimensionsGlobal.height.margins[heightOption] = 0.05;
        }
        if (dimensionsGlobal.height.margins[heightOption] < 1) {
            dimensionsGlobal.height.margins[heightOption] = dimensionsGlobal.height.margins[heightOption] * dimensionsGlobal.height.total;
        }
    }

    // check if make up total, otherwise resize
    


//     const dimensions = {
//        global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
//        heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}},
//        barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
//        violinTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
//        barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
//        violinLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
//        graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
//        detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
//        textSize: {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}
//    } as CellPopDimensions;

//    return dimensions;
}



// export function getDimensionsFull(dimensionsGlobal: CellPopDimensionsGlobal) {
    
//     // fill in all required dimensions
//     for (let widthOption of [widthLeft, widhtMiddle, widthRight]) {
//         if (!widthOption) {
//             widthOption = 0.3 * width;
//         }
//     }

//     for (let widthOption of [widthMarginLeft, widthMarginMiddleLeft, widthMarginMiddleRight, widthMarginRight]) {
//         if (!widthOption) {
//             widthOption = 0.05 * width;
//         }
//     }

//     for (let heightOption of [heightTop, heightMiddle, heightBottom]) {
//         if (!heightOption) {
//             heightOption = 0.3 * height;
//         }
//     }



//     // check if there are any fractions
//     for (let widthOption of [widthLeft, widhtMiddle, widthRight, widthMarginLeft, widthMarginMiddleLeft, widthMarginMiddleRight, widthMarginRight]) {
//         if (widthOption < 1) {
//             widthOption = widthOption * width;
//         }
//     }

//     for (let heightOption of [heightTop, heightMiddle, heightBottom, heightMarginTop, heightMarginMiddleTop, heightMarginMiddleBottom, heightMarginBottom]) {
//         if (heightOption < 1) {
//             heightOption = heightOption * height;
//         }
//     }

//     // check if the parts combine to the total width/height
//     // if not, keep width & height and readjust all other
    

//     const dim = {
//         width: {
//             total: 0,
//             parts: {
//                 left: 0,
//                 middle: 0,
//                 right: 0,
//             },
//             margins: {
//                 left: 0,
//                 middleLeft: 0,
//                 middleRight: 0,
//                 right: 0
//             }
//         },
//         height: {
//             total: 0,
//             parts: {
//                 left: 0,
//                 middle: 0,
//                 right: 0,
//             },
//             margins: {
//                 left: 0,
//                 middleLeft: 0,
//                 middleRight: 0,
//                 right: 0
//             }

//         }
//     }




// function getDimensionsFromDimensions(dimensions: CellPopDimensions) {
//     // check that it has all global -> change type

//     // get parameters
//     const width = dimensions.global.width;
//     const height = dimensions.global.height;
//     const widthLeft = dimensions.global.widthSplit[0];
//     const widthRight = dimensions.global.widthSplit[1];
//     const heightTop = dimensions.global.heightSplit[0];
//     const heightBottom = dimensions.global.heightSplit[1];

//     // fill in all required dimensions
//     const dimensionsExtended = {
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

//     return dimensionsExtended;
// }

// const dimensions = {
	// 	global: {width: width, widthSplit: [widthLeft, widthRight], height: height, heightSplit: [heightTop, heightBottom]},
	// 	heatmap: {offsetWidth: widthLeft, offsetHeight: heightTop, width: widthRight, height: heightBottom, margin: {top: 0, right: 400, bottom: 100, left: 0}},
	// 	barTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
	// 	violinTop: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: heightTop, margin: {top: 50, right: 50, bottom: 0, left: 0}},
	// 	barLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
	// 	violinLeft: {offsetWidth: 0, offsetHeight: heightTop, width: widthLeft, height: heightBottom, margin: {top: 0, right: 0, bottom: 100, left: 50}},
	// 	graph: {offsetWidth: widthLeft, offsetHeight: height, width: widthRight, height: heightTop, margin: {top: 0, right: 200, bottom: 0, left: 0}},
	// 	detailBar: {offsetWidth: widthLeft, offsetHeight: 0, width: widthRight, height: height, margin: {top: 50, right: 200, bottom: 50, left: 0}},
	// 	textSize: {title: '20px', label: '30px', labelSmall: '20px', tick: '10px'}
	// } as CellPopDimensions;