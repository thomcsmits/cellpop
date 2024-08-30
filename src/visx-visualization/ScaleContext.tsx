import { scaleBand, scaleLinear } from "@visx/scale";
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { getUpperBound } from "../visualization/util";

import { createContext, useContext } from "../utils/context";
import { useData, useDimensions, useTheme } from "./ConfigContext";

const SCALES = ["X", "Y", "Color"] as const;
type ScaleType = (typeof SCALES)[number];

type ScaleLinear<T> = ReturnType<typeof scaleLinear<T>>;
type ScaleBand<T> = ReturnType<typeof scaleBand<T>>;

interface DimensionScaleContext {
  scale: ScaleBand<string>;
  selectedValues: Set<string>;
  toggleSelection: (value: string) => void;
}

interface ColorScaleContext {
  scale: ScaleLinear<string>;
}

const [XScaleContext, YScaleContext] = SCALES.map((dimension: ScaleType) => {
  return createContext<DimensionScaleContext>(`${dimension}ScaleContext`);
});
const ColorScaleContext = createContext<ColorScaleContext>("ColorScaleContext");

export const useXScale = () => useContext(XScaleContext);
export const useYScale = () => useContext(YScaleContext);
export const useColorScale = () => useContext(ColorScaleContext);

export function useToggleSet<T>(initialValues: T[] = []) {
  const [set, update] = useState<Set<T>>(new Set([...initialValues]));
  const add = useCallback(
    (value: T) => {
      update((prev) => {
        const next = new Set(prev);
        next.add(value);
        return next;
      });
    },
    [update],
  );
  const remove = useCallback(
    (value: T) => {
      update((prev) => {
        const next = new Set(prev);
        next.delete(value);
        return next;
      });
    },
    [update],
  );
  const toggle = useCallback(
    (value: T) => {
      update((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        return next;
      });
    },
    [update],
  );
  return { set, add, remove, update: update, toggle };
}

export function ScaleProvider({ children }: PropsWithChildren) {
  const data = useData();
  const {
    dimensions: {
      heatmap: { width, height },
    },
  } = useDimensions();
  const {
    theme: { heatmapZero, heatmapMax },
  } = useTheme();

  const x = useMemo(() => {
    return scaleBand<string>({
      range: [0, width],
      domain: data.colNames,
      padding: 0.01,
    });
  }, [width, data.colNames]);

  const y = useMemo(() => {
    return scaleBand<string>()
      .range([height, 0])
      .domain(data.rowNames)
      .padding(0.01);
  }, [height, data.rowNames]);

  const colors = useMemo(() => {
    return scaleLinear<string>({
      range: [heatmapZero, heatmapMax],
      domain: [0, getUpperBound(data.countsMatrix.map((r) => r.value))],
    });
  }, [data.countsMatrix, heatmapZero, heatmapMax]);

  const { set: selectedX, toggle: toggleX } = useToggleSet<string>();
  const { set: selectedY, toggle: toggleY } = useToggleSet<string>();

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
          {children}
        </ColorScaleContext.Provider>
      </YScaleContext.Provider>
    </XScaleContext.Provider>
  );
}
