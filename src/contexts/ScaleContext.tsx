import { scaleBand, scaleLinear } from "@visx/scale";
import React, { PropsWithChildren, useMemo } from "react";

import { useSet } from "../hooks/useSet";
import { createContext, useContext } from "../utils/context";
import { useColumns, useRows } from "./AxisOrderContext";
import { useCellPopTheme } from "./CellPopThemeContext";
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
}
const ColorScaleContext = createContext<ColorScaleContext>("ColorScaleContext");
export const useColorScale = () => useContext(ColorScaleContext);

export const EXPANDED_ROW_PADDING = 16; // add 8px on either side of the expanded row for padding

/**
 * Provider which instantiates and manages the scales used for the heatmap.
 */
export function ScaleProvider({ children }: PropsWithChildren) {
  const { maxCount } = useData();
  const { width, height } = useHeatmapDimensions();
  const { set: selectedX, toggle: toggleX, reset: resetX } = useSet<string>();
  const { set: selectedY, toggle: toggleY, reset: resetY } = useSet<string>();
  const {
    theme: { heatmapZero, heatmapMax },
  } = useCellPopTheme();

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
    // Base case: use regular band scale if:
    // If no rows are selected,
    // all rows are unselected,
    // or all selected rows have been hidden.
    if (
      [0, rows.length].includes(selectedY.size) ||
      [...selectedY].every((row) => !rows.includes(row))
    ) {
      const scale = scaleBand<string>({
        range: [height, 0],
        domain: rows,
        padding: 0.01,
      });
      const expandedHeight = scale.step();
      const collapsedHeight = scale.bandwidth();
      return [scale, expandedHeight, collapsedHeight];
    }

    // Otherwise, we need to adjust the scale to account for the expanded rows
    // First, we need to determine the height of the selected rows
    const expandedRowHeight =
      height / (2 + selectedY.size) - EXPANDED_ROW_PADDING;
    const restRowsHeight = height - selectedY.size * expandedRowHeight;
    const collapsedRowHeight = restRowsHeight / (rows.length - selectedY.size);
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
      if (domain.length === 1 && selectedY.has(domain[0])) {
        heights.push(expandedRowHeight);
      } else {
        const height = (domain.length / rows.length) * restRowsHeight;
        heights.push(height);
      }
    }
    // Create the scales for each domain
    let cumulativeHeight = 0;
    const scales = domains.map((domain, index) => {
      const domainHeight = heights[index];
      const initialHeight = cumulativeHeight;
      cumulativeHeight += domainHeight;
      return scaleBand<string>({
        range: [cumulativeHeight, initialHeight],
        domain,
        padding: 0.01,
      });
    });
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
    customScale.round = () => false;
    customScale.padding = () => 0.01;
    customScale.paddingInner = () => 0;
    customScale.paddingOuter = () => 0;
    customScale.align = () => 0.5;
    customScale.copy = () => customScale;
    customScale.step = () => collapsedRowHeight;
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
    const scale = scaleLinear<string>({
      range: [heatmapZero, heatmapMax],
      domain: [0, maxCount],
    });
    return {
      scale,
      maxValue: maxCount,
    };
  }, [heatmapZero, heatmapMax, maxCount]);

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
