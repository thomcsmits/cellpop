import { scaleBand, scaleLinear } from "@visx/scale";
import React, { PropsWithChildren, useMemo, useState } from "react";

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
import { useSet } from "../hooks/useSet";
import { createContext, useContext } from "../utils/context";
import { useColumns, useRows } from "./AxisOrderContext";
import { useData } from "./DataContext";
import { useHeatmapDimensions } from "./DimensionsContext";
import { SelectedDimensionProvider } from "./SelectedDimensionContext";

const SCALES = ["X", "Y", "Color"] as const;

type ScaleLinear<T> = ReturnType<typeof scaleLinear<T>>;
type ScaleBand<T> = ReturnType<typeof scaleBand<T>>;

interface DimensionScaleContext {
  scale: ScaleBand<string>;
  selectedValues: Set<string>;
  toggleSelection: (value: string) => void;
  tickLabelSize: number;
  setTickLabelSize: (size: number) => void;
  reset: () => void;
  nonExpandedSize: number;
  expandedSize: number;
}
const [XScaleContext, YScaleContext] = SCALES.map((dimension: string) => {
  return createContext<DimensionScaleContext>(`${dimension}ScaleContext`);
});
export const useXScale = () => useContext(XScaleContext);
export const useYScale = () => useContext(YScaleContext);

// Color context does not have selection
interface ColorScaleContext {
  scale: ScaleLinear<string>;
  maxValue: number;
  heatmapTheme: HeatmapTheme;
  setHeatmapTheme: (theme: HeatmapTheme) => void;
}
const ColorScaleContext = createContext<ColorScaleContext>("ColorScaleContext");
export const useColorScale = () => useContext(ColorScaleContext);

const invertInterpolation =
  (interpolator: (t: number) => string) => (t: number) =>
    interpolator(1 - t);

const heatmapThemes = {
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

export const HEATMAP_THEMES = Object.keys(heatmapThemes) as HeatmapTheme[];

// Add 8px between the expanded row and the next row
export const EXPANDED_ROW_PADDING = 8;

/**
 * Provider which instantiates and manages the scales used for the heatmap.
 */
export function ScaleProvider({ children }: PropsWithChildren) {
  const { maxCount } = useData();
  const { width, height } = useHeatmapDimensions();
  const [heatmapTheme, setHeatmapTheme] = useState<HeatmapTheme>(
    HEATMAP_THEMES[0],
  );
  const { set: selectedX, toggle: toggleX, reset: resetX } = useSet<string>();
  const { set: selectedY, toggle: toggleY, reset: resetY } = useSet<string>();

  const [columns] = useColumns();
  const [rows] = useRows();

  const [x, xExpanded, xCollapsed] = useMemo(() => {
    const scale = scaleBand<string>({
      range: [0, width],
      domain: columns,
      padding: 0.01,
    });
    const expandedSize = scale.bandwidth();
    const collapsedSize = scale.bandwidth();
    return [scale, expandedSize, collapsedSize];
  }, [width, columns]);

  // TODO: The custom axis logic should ideally be moved to a separate file
  // since it's taking up more than half of this file's length
  const [y, expandedSize, collapsedSize] = useMemo(() => {
    // Base case: use regular band scale
    if (
      // if no rows are selected/all rows are selected
      [0, rows.length].includes(selectedY.size) ||
      // if all selected rows are hidden
      [...selectedY].every((row) => !rows.includes(row))
    ) {
      const scale = scaleBand<string>({
        range: [height, 0],
        domain: rows,
        padding: 0.01,
      });
      const expandedHeight = scale.bandwidth();
      const collapsedHeight = scale.bandwidth();
      // @ts-expect-error augmenting scale with a lookup function
      scale.lookup = (num: number) => {
        const eachBand = scale.bandwidth();
        const index = Math.floor((height - num) / eachBand);
        return scale.domain()[index];
      };
      return [scale, expandedHeight, collapsedHeight];
    }

    // Otherwise, we need to adjust the scale to account for the expanded rows
    // First, we need to determine the height of the selected rows
    const expandedRowHeight = height / (2 + selectedY.size);
    const totalExpandedHeight = selectedY.size * expandedRowHeight;
    const totalCollapsedHeight = height - totalExpandedHeight;
    const numberOfUnselectedRows = rows.length - selectedY.size;
    const collapsedRowHeight = totalCollapsedHeight / numberOfUnselectedRows;
    // Then, we need to split the domain up, keeping the order of the existing rows
    // and creating separate domains for each subsection
    const domains = rows
      .reduce(
        (acc, curr) => {
          // If the current value is one of the selected rows,
          // close the current domain and add a new one consisting of just the selected row
          if (selectedY.has(curr)) {
            acc.push([curr]);
            // Add an empty domain to start the next section
            acc.push([]);
          } else {
            // Otherwise, add the current value to the current domain
            acc[acc.length - 1].push(curr);
          }
          return acc;
        },
        [[]] as string[][],
      )
      .filter((domain) => domain.length > 0);
    // Calculate heights allotted to each domain
    const heights: number[] = [];
    for (const domain of domains) {
      if (selectedY.has(domain[0])) {
        heights.push(expandedRowHeight);
      } else {
        const height = domain.length * collapsedRowHeight;
        heights.push(height);
      }
    }
    // Create the scales for each domain
    let cumulativeHeight = height;
    const scales = domains
      .map((domain, index) => {
        const domainHeight = heights[index];
        const initialHeight = cumulativeHeight;
        cumulativeHeight -= domainHeight;
        const isExpanded = domain.some((row) => selectedY.has(row));
        const rangeTop =
          cumulativeHeight + (isExpanded ? EXPANDED_ROW_PADDING : 0);
        const rangeBottom =
          initialHeight - (isExpanded ? EXPANDED_ROW_PADDING : 0);
        return scaleBand<string>({
          range: [rangeTop, rangeBottom],
          domain,
          padding: 0.01,
        });
      })
      .reverse();
    // Create a custom scale that uses the correct scale for each ordinal value
    const customScale = (value: string) => {
      for (const scale of scales) {
        if (scale.domain().includes(value)) {
          return scale(value);
        }
      }
      return 0;
    };
    customScale.bandwidth = () => collapsedRowHeight;
    customScale.bandwidth = (item?: string) => {
      if (item === undefined) {
        return collapsedRowHeight;
      } else {
        for (const scale of scales) {
          if (scale.domain().includes(item)) {
            return scale.bandwidth();
          }
        }
        return collapsedRowHeight;
      }
    };
    customScale.domain = (newDomain?: string[]) =>
      newDomain ? customScale : rows;
    customScale.range = (newRange?: [number, number]) =>
      newRange ? customScale : ([height, 0] as [number, number]);
    customScale.rangeRound = (newRange?: [number, number]) =>
      newRange ? customScale : [height, 0];
    customScale.round = (arg?: boolean) => {
      if (arg === undefined) {
        return false;
      }
      scales.forEach((scale) => scale.round(arg));
      return customScale;
    };
    customScale.padding = (arg?: number) => {
      if (arg === undefined) {
        return 0.01;
      }
      scales.forEach((scale) => scale.padding(arg));
      return customScale;
    };
    customScale.paddingInner = (arg?: number) => {
      if (arg === undefined) {
        return 0.01;
      }
      scales.forEach((scale) => scale.paddingInner(arg));
      return customScale;
    };
    customScale.paddingOuter = (arg?: number) => {
      if (arg === undefined) {
        return 0.0;
      }
      scales.forEach((scale) => scale.paddingOuter(arg));
      return customScale;
    };
    customScale.align = (arg?: number) => {
      if (arg === undefined) {
        return 0.5 as number;
      }
      scales.forEach((scale) => scale.align(arg));
      return customScale as ScaleBand<string>;
    };
    customScale.copy = () => customScale;
    customScale.step = () => collapsedRowHeight;
    customScale.lookup = (num: number) => {
      for (const scale of scales) {
        const [bottom, top] = scale.range();
        if (num >= bottom && num <= top) {
          const eachBand = scale.bandwidth();
          const diff = num - bottom;

          const index = Math.floor(diff / eachBand);
          return scale.domain()[index];
        }
      }
      return "";
    };
    return [
      customScale as ScaleBand<string>,
      expandedRowHeight,
      collapsedRowHeight,
    ];
  }, [height, rows, selectedY.size]);

  const [xTickLabelSize, setXTickLabelSize] = React.useState(0);
  const [yTickLabelSize, setYTickLabelSize] = React.useState(0);

  const xScaleContext = useMemo(
    () => ({
      scale: x,
      selectedValues: selectedX,
      toggleSelection: toggleX,
      tickLabelSize: xTickLabelSize,
      setTickLabelSize: setXTickLabelSize,
      reset: resetX,
      expandedSize: xExpanded,
      nonExpandedSize: xCollapsed,
    }),
    [x, selectedX, toggleX, xTickLabelSize, resetX, xExpanded, xCollapsed],
  );
  const yScaleContext = useMemo(
    () => ({
      scale: y,
      selectedValues: selectedY,
      toggleSelection: toggleY,
      tickLabelSize: yTickLabelSize,
      setTickLabelSize: setYTickLabelSize,
      reset: resetY,
      expandedSize,
      nonExpandedSize: collapsedSize,
    }),
    [
      y,
      selectedY,
      toggleY,
      yTickLabelSize,
      resetY,
      expandedSize,
      collapsedSize,
    ],
  );
  const colorScaleContext = useMemo(() => {
    const theme = heatmapThemes[heatmapTheme];
    const scale = scaleLinear<string>({
      range: [theme(0), theme(1)],
      domain: [0, maxCount],
    });
    return {
      scale,
      maxValue: maxCount,
      heatmapTheme,
      setHeatmapTheme,
    };
  }, [heatmapTheme, maxCount]);

  return (
    <XScaleContext.Provider value={xScaleContext}>
      <YScaleContext.Provider value={yScaleContext}>
        <ColorScaleContext.Provider value={colorScaleContext}>
          <SelectedDimensionProvider>{children}</SelectedDimensionProvider>
        </ColorScaleContext.Provider>
      </YScaleContext.Provider>
    </XScaleContext.Provider>
  );
}
