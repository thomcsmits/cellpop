import { CellPopTheme, CellPopThemeColors } from "../cellpop-schema";

export function getTheme(theme: CellPopTheme) {
    const themeColors = new Object() as CellPopThemeColors;

    if (theme === 'dark') {
        themeColors.background = 'black';
        themeColors.heatmapZero = 'black';
        themeColors.heatmapMax = '#69b3a2';
        themeColors.heatmapGrid = 'white';
        themeColors.heatmapHighlight = 'white';
        themeColors.sideCharts = 'white';
        themeColors.text = 'white';
    }
    // if (t === 'light') {
    else {
        themeColors.background = 'white';
        themeColors.heatmapZero = 'white';
        themeColors.heatmapMax = '#69b3a2';
        themeColors.heatmapGrid = 'white';
        themeColors.heatmapHighlight = 'black';
        themeColors.sideCharts = 'black';
        themeColors.text = 'black';
    }

    return themeColors;
}