export function getTheme(theme) {
    let themeColors = new Object;

    if (theme === 'dark') {
        themeColors.background = 'black';
        themeColors.heatmapZero = 'black';
        themeColors.heatmapMax = '#69b3a2';
        themeColors.heatmapGrid = 'white'
        themeColors.bars = 'white';
        themeColors.text = 'white';
    }
    // if (t === 'light') {
    else {
        themeColors.background = 'white';
        themeColors.heatmapZero = 'white';
        themeColors.heatmapMax = '#69b3a2';
        themeColors.heatmapGrid = 'white';
        themeColors.bars = 'black';
        themeColors.text = 'black';
    }

    return themeColors;
}