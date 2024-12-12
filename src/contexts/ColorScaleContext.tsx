import { scaleLinear } from "@visx/scale";
import React, { PropsWithChildren, useMemo, useState } from "react";
import { createContext, useContext } from "../utils/context";
import {
  HEATMAP_THEMES_LIST,
  HeatmapTheme,
  heatmapThemes,
} from "../utils/heatmap-themes";
import { useColumnCounts, useMaxCount, useRowCounts } from "./DataContext";
import { ScaleLinear } from "./ScaleContext";

// Color context does not have selection
interface ColorScaleContext {
  scale: ScaleLinear<string>;
  rowScales: Record<string, ScaleLinear<string>>;
  columnScales: Record<string, ScaleLinear<string>>;
  maxValue: number;
  heatmapTheme: HeatmapTheme;
  setHeatmapTheme: (theme: HeatmapTheme) => void;
}
const ColorScaleContext = createContext<ColorScaleContext>("ColorScaleContext");
export const useColorScale = () => useContext(ColorScaleContext);

/**
 * Provider which instantiates and manages the scales used for the heatmap.
 */
export function ColorScaleProvider({ children }: PropsWithChildren) {
  const maxCount = useMaxCount();
  const [heatmapTheme, setHeatmapTheme] = useState<HeatmapTheme>(
    HEATMAP_THEMES_LIST[0],
  );
  const columnCounts = useColumnCounts();
  const rowCounts = useRowCounts();

  const colorScaleContext = useMemo(() => {
    const theme = heatmapThemes[heatmapTheme];
    const lowColor = theme(0);
    const highColor = theme(1);
    const scale = scaleLinear<string>({
      range: [lowColor, highColor],
      domain: [0, maxCount],
    });

    const rowScales: Record<string, ScaleLinear<string>> = {};
    const columnScales: Record<string, ScaleLinear<string>> = {};

    for (const row of Object.keys(rowCounts)) {
      const count = rowCounts[row];
      rowScales[row] = scaleLinear<string>({
        range: [lowColor, highColor],
        domain: [0, count],
      });
    }

    for (const column of Object.keys(columnCounts)) {
      const count = columnCounts[column];
      columnScales[column] = scaleLinear<string>({
        range: [lowColor, highColor],
        domain: [0, count],
      });
    }

    return {
      scale,
      maxValue: maxCount,
      heatmapTheme,
      setHeatmapTheme,
      rowScales,
      columnScales,
    };
  }, [heatmapTheme, maxCount]);

  return (
    <ColorScaleContext.Provider value={colorScaleContext}>
      {children}
    </ColorScaleContext.Provider>
  );
}
