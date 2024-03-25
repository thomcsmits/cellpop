import { renderTopBar } from "./barTop";
import { renderTopViolin } from "./violinTop";
import { renderLeftBar } from "./barSide";
import { renderLeftViolin } from "./violinSide";
import { renderGraph } from "./graph";

export function renderCellPopVisualizationTop(data, dimensions, x, themeColors, fraction) {
	// create top chart
	if (fraction) {
		// create top violin
		renderTopViolin(data, dimensions, x, themeColors, fraction);
	} else {
		// create top barchart
		renderTopBar(data, dimensions, x, themeColors);
	}
}

export function renderCellPopVisualizationLeft(data, dimensions, y, themeColors, fraction) {
	// create side chart
	if (fraction) {
		// create left violin
		renderLeftViolin(data, dimensions, y, themeColors, fraction);
	} else {
		// create left barchart
		renderLeftBar(data, dimensions, y, themeColors);
	}
}
