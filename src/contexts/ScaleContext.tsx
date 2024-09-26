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
function useFilteredMaxCount() {
  const {
    data: { countsMatrix },
  } = useData();
  const [, { removedValues: filteredRows }] = useRows();
  const [, { removedValues: filteredColumns }] = useColumns();
  return Math.max(
    ...countsMatrix
      .filter(
        ({ col, row }) => !filteredColumns.has(col) && !filteredRows.has(row),
      )
      .map(({ value }) => value),
  );
}
const ColorScaleContext = createContext<ColorScaleContext>("ColorScaleContext");
export const useColorScale = () => useContext(ColorScaleContext);

/**
 * Provider which instantiates and manages the scales used for the heatmap.
 */
export function ScaleProvider({ children }: PropsWithChildren) {
  const { data } = useData();
  const { width, height } = useHeatmapDimensions();
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

  const y = useMemo(() => {
    return scaleBand<string>().range([height, 0]).domain(rows).padding(0.01);
  }, [height, rows]);

  const { set: selectedX, toggle: toggleX } = useSet<string>();
  const { set: selectedY, toggle: toggleY } = useSet<string>();

  const [xTickLabelSize, setXTickLabelSize] = React.useState(0);
  const [yTickLabelSize, setYTickLabelSize] = React.useState(0);

  const xScaleContext = useMemo(
    () => ({
      scale: x,
      selectedValues: selectedX,
      toggleSelection: toggleX,
      tickLabelSize: xTickLabelSize,
      setTickLabelSize: setXTickLabelSize,
    }),
    [x, selectedX, toggleX, xTickLabelSize],
  );
  const yScaleContext = useMemo(
    () => ({
      scale: y,
      selectedValues: selectedY,
      toggleSelection: toggleY,
      tickLabelSize: yTickLabelSize,
      setTickLabelSize: setYTickLabelSize,
    }),
    [y, selectedY, toggleY, yTickLabelSize],
  );
  const maxValue = useFilteredMaxCount();
  const colors = useMemo(() => {
    return scaleLinear<string>({
      range: [heatmapZero, heatmapMax],
      domain: [0, maxValue],
    });
  }, [data.countsMatrix, heatmapZero, heatmapMax]);
  const colorScaleContext = useMemo(
    () => ({ scale: colors, maxValue }),
    [colors, maxValue],
  );

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
