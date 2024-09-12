import { scaleBand, scaleLinear } from "@visx/scale";
import React, { PropsWithChildren, useMemo } from "react";
import { getUpperBound } from "../visualization/util";

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
}
const [XScaleContext, YScaleContext] = SCALES.map((dimension: string) => {
  return createContext<DimensionScaleContext>(`${dimension}ScaleContext`);
});
export const useXScale = () => useContext(XScaleContext);
export const useYScale = () => useContext(YScaleContext);

// Color context does not have selection
interface ColorScaleContext {
  scale: ScaleLinear<string>;
}
const ColorScaleContext = createContext<ColorScaleContext>("ColorScaleContext");
export const useColorScale = () => useContext(ColorScaleContext);

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

  const colors = useMemo(() => {
    return scaleLinear<string>({
      range: [heatmapZero, heatmapMax],
      domain: [0, getUpperBound(data.countsMatrix.map((r) => r.value))],
    });
  }, [data.countsMatrix, heatmapZero, heatmapMax]);

  const { set: selectedX, toggle: toggleX } = useSet<string>();
  const { set: selectedY, toggle: toggleY } = useSet<string>();

  const xScaleContext = useMemo(
    () => ({ scale: x, selectedValues: selectedX, toggleSelection: toggleX }),
    [x, selectedX, toggleX],
  );
  const yScaleContext = useMemo(
    () => ({ scale: y, selectedValues: selectedY, toggleSelection: toggleY }),
    [y, selectedY, toggleY],
  );
  const colorScaleContext = useMemo(() => ({ scale: colors }), [colors]);

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
