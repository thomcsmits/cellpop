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
        themeColors.extensionDefault = '#69b3a2';
        themeColors.extensionRange = ["#1A2A22", "#79FFFC", "#8F5D4E", "#FFFF7C", "#FFFF7C", "#C665BF", "#8AFF79", "#4E5C35", "#A4FCE5", "#FF8095", "#7A85FE"];
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
        themeColors.extensionDefault = '#69b3a2';
        themeColors.extensionRange = ["#1A2A22", "#79FFFC", "#8F5D4E", "#FFFF7C", "#FFFF7C", "#C665BF", "#8AFF79", "#4E5C35", "#A4FCE5", "#FF8095", "#7A85FE"];
    }

    return themeColors;
}