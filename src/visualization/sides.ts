import { renderTopBar } from "./barTop";
import { renderTopViolin } from "./violinTop";
import { renderLeftBar } from "./barSide";
import { renderLeftViolin } from "./violinSide";
import { renderGraph } from "./graph";
import { CellPopData, CellPopDimensions, CellPopThemeColors } from "../cellpop-schema";

export function renderCellPopVisualizationTop(data: CellPopData, dimensions: CellPopDimensions, x: d3.ScaleBand<string>, themeColors: CellPopThemeColors, fraction: boolean) {
	// create top chart
	if (fraction) {
		// create top violin
		renderTopViolin(data, dimensions, x, themeColors, fraction);
	} else {
		// create top barchart
		renderTopBar(data, dimensions, x, themeColors);
	}
}

export function renderCellPopVisualizationLeft(data: CellPopData, dimensions: CellPopDimensions, y: d3.ScaleBand<string>, themeColors: CellPopThemeColors, fraction: boolean) {
	// create side chart
	if (fraction) {
		// create left violin
		renderLeftViolin(data, dimensions, y, themeColors, fraction);
	} else {
		// create left barchart
		renderLeftBar(data, dimensions, y, themeColors);
	}
}
