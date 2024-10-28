import React, { useId } from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import {
  HEATMAP_THEMES,
  HeatmapTheme,
  useColorScale,
} from "../contexts/ScaleContext";

export default function Legend() {
  const {
    scale: colors,
    maxValue,
    setHeatmapTheme,
    heatmapTheme,
  } = useColorScale();
  const { width } = usePanelDimensions("left_top");
  const { theme } = useCellPopTheme();
  const id = useId() + "-legend";

  const adjustedWidth = width - 40; // 20px padding on each side
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        gap: "1rem",
      }}
    >
      <label htmlFor={id} style={{ color: theme.text }} className="text">
        Counts
      </label>
      <div style={{ height: "1.5rem" }}>
        <div
          style={{
            width: adjustedWidth,
            display: "flex",
            justifyContent: "space-between",
            background: `linear-gradient(to right, ${colors(0)}, ${colors(maxValue)})`,
            padding: ".25rem",
            borderRadius: ".25rem",
            outline: `1px solid ${theme.text}`,
          }}
        >
          <div style={{ color: colors(maxValue) }}>0</div>
          <div style={{ color: colors(0) }}>{maxValue} </div>
        </div>
      </div>
      <div>
        <label
          htmlFor={"heatmap-theme-select"}
          style={{ color: theme.text }}
          className="text"
        >
          Theme:
        </label>
        <select
          id={"heatmap-theme-select"}
          value={heatmapTheme}
          onChange={(e) => setHeatmapTheme(e.target.value as HeatmapTheme)}
        >
          {HEATMAP_THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
