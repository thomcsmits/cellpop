import {
  interpolateBlues,
  interpolateCividis,
  interpolateCool,
  interpolateCubehelixDefault,
  interpolateGreens,
  interpolateGreys,
  interpolateInferno,
  interpolateMagma,
  interpolateOranges,
  interpolatePlasma,
  interpolatePurples,
  interpolateReds,
  interpolateViridis,
  interpolateWarm,
} from "d3";

const invertInterpolation =
  (interpolator: (t: number) => string) => (t: number) =>
    interpolator(1 - t);

export const heatmapThemes = {
  viridis: interpolateViridis,
  inferno: interpolateInferno,
  magma: interpolateMagma,
  plasma: interpolatePlasma,
  cividis: interpolateCividis,
  warm: interpolateWarm,
  cool: interpolateCool,
  cubehelix: interpolateCubehelixDefault,
  greens: interpolateGreens,
  blues: interpolateBlues,
  oranges: interpolateOranges,
  reds: interpolateReds,
  purples: interpolatePurples,
  greys: interpolateGreys,
  invertedViridis: invertInterpolation(interpolateViridis),
  invertedInferno: invertInterpolation(interpolateInferno),
  invertedMagma: invertInterpolation(interpolateMagma),
  invertedPlasma: invertInterpolation(interpolatePlasma),
  invertedCividis: invertInterpolation(interpolateCividis),
  invertedWarm: invertInterpolation(interpolateWarm),
  invertedCool: invertInterpolation(interpolateCool),
  invertedCubehelix: invertInterpolation(interpolateCubehelixDefault),
  invertedGreens: invertInterpolation(interpolateGreens),
  invertedBlues: invertInterpolation(interpolateBlues),
  invertedOranges: invertInterpolation(interpolateOranges),
  invertedReds: invertInterpolation(interpolateReds),
  invertedPurples: invertInterpolation(interpolatePurples),
  invertedGreys: invertInterpolation(interpolateGreys),
};

export type HeatmapTheme = keyof typeof heatmapThemes;

export const HEATMAP_THEMES_LIST = Object.keys(heatmapThemes) as HeatmapTheme[];
