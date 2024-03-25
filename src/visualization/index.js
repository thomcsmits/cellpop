import * as d3 from "d3";

import { renderHeatmap } from "./heatmap";
import { renderTopBar } from "./barTop";
import { renderTopViolin } from "./violinTop";
import { renderLeftBar } from "./barSide";
import { renderLeftViolin } from "./violinSide";
import { renderGraph } from "./graph";
import { getTheme } from "./theme";

export function renderCellPopVisualization(data, dimensions, fraction, theme, metadataField) {
	let themeColors = getTheme(theme);

	// create main heatmap
	let [x, y, colorRange] = renderHeatmap(data, dimensions, fraction, themeColors, metadataField);

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