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

  const x = useMemo(() => {
    return scaleBand<string>({
      range: [0, width],
      domain: columns,
      padding: 0.01,
    });
  }, [width, columns]);

  // TODO: The custom axis logic should ideally be moved to a separate file
  // since it's taking up more than half of this file's length
  const y = useMemo(() => {
    // Base case: no selected rows
    if (selectedY.size === 0) {
      return scaleBand<string>({
        range: [height, 0],
        domain: rows,
        padding: 0.01,
      });
    }
    // If there are selected rows, we need to adjust the scale to account for the expanded rows
    // First, we need to determine the height of the selected rows
    const expandedRowHeight = height / (2 + selectedY.size);
    const restRowsHeight = height - selectedY.size * expandedRowHeight;
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
      cumulativeHeight += domainHeight;
      return scaleBand<string>({
        range: [cumulativeHeight, cumulativeHeight - domainHeight],
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
    customScale.bandwidth = () => restRowsHeight / rows.length;
    customScale.bandwidth = (item?: string) => {
      if (item === undefined) {
        return restRowsHeight / rows.length;
      } else {
        for (const scale of scales) {
          if (scale.domain().includes(item)) {
            return scale.bandwidth();
          }
        }
        return restRowsHeight / rows.length;
      }
    };
    customScale.domain = () => rows;
    customScale.range = () => [0, height];
    customScale.round = () => false;
    return customScale;
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
    }),
    [x, selectedX, toggleX, xTickLabelSize, resetX],
  );
  const yScaleContext = useMemo(
    () => ({
      scale: y,
      selectedValues: selectedY,
      toggleSelection: toggleY,
      tickLabelSize: yTickLabelSize,
      setTickLabelSize: setYTickLabelSize,
      reset: resetY,
    }),
    [y, selectedY, toggleY, yTickLabelSize, resetY],
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
