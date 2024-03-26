import { renderHeatmap } from "./heatmap";
import { renderTopBar } from "./barTop";
import { renderTopViolin } from "./violinTop";
import { renderLeftBar } from "./barSide";
import { renderLeftViolin } from "./violinSide";
import { renderGraph } from "./graph";
import { CellPopData, CellPopDimensions, CellPopThemeColors } from "../cellpop-schema";

export function renderCellPopVisualization(data: CellPopData, dimensions: CellPopDimensions, fraction: boolean, themeColors: CellPopThemeColors, metadataField?: string, reset?: boolean) {

	// create main heatmap
	const [x, y, colorRange] = renderHeatmap(data, dimensions, fraction, themeColors, metadataField, reset);

	// create top/side charts
	if (fraction) {
		// create top violin
		renderTopViolin(data, dimensions, x, themeColors, fraction);
		// create left violin
		renderLeftViolin(data, dimensions, y, themeColors, fraction);
	} else {
		// create top barchart
		renderTopBar(data, dimensions, x, themeColors);
		// create left barchart
		renderLeftBar(data, dimensions, y, themeColors);
	}
}
