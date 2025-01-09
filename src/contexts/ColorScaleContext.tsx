import { scaleLinear } from "@visx/scale";
import React, { PropsWithChildren, useMemo, useState } from "react";
import { createContext, useContext } from "../utils/context";
import {
  HEATMAP_THEMES_LIST,
  HeatmapTheme,
  heatmapThemes,
} from "../utils/heatmap-themes";
import { useMaxCount } from "./DataContext";
import { ScaleLinear } from "./ScaleContext";

// Color context does not have selection
interface ColorScaleContext {
  scale: ScaleLinear<string>;
  percentageScale: ScaleLinear<string>;
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

  const colorScaleContext = useMemo(() => {
    const theme = heatmapThemes[heatmapTheme];
    const lowColor = theme(0);
    const highColor = theme(1);
    const scale = scaleLinear<string>({
      range: [lowColor, highColor],
      domain: [0, maxCount],
    });

    const percentageScale = scaleLinear<string>({
      range: [lowColor, highColor],
      domain: [0, 1],
    });

    return {
      scale,
      percentageScale,
      maxValue: maxCount,
      heatmapTheme,
      setHeatmapTheme,
    };
  }, [heatmapTheme, maxCount]);

  return (
    <ColorScaleContext.Provider value={colorScaleContext}>
      {children}
    </ColorScaleContext.Provider>
  );
}
