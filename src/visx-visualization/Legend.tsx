import { rgbToHex } from "@mui/material";
import React, { useId } from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { HEATMAP_THEMES, useColorScale } from "../contexts/ScaleContext";

export default function Legend() {
  const {
    scale: colors,
    maxValue,
    setHeatmapTheme,
    heatmapTheme,
  } = useColorScale();
  const { width } = usePanelDimensions("left_top");
  const { theme } = useCellPopTheme();
  const domain = colors.domain();
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
      }}
    >
      <label htmlFor={id} style={{ color: theme.text }}>
        Counts
      </label>
      <svg width={adjustedWidth} id={id}>
        <defs>
          <linearGradient id="legendGradient" gradientTransform="rotate(0)">
            <stop offset="5%" stopColor={rgbToHex(colors(domain[0]))} />
            <stop offset="95%" stopColor={rgbToHex(colors(domain[1]))} />
          </linearGradient>
        </defs>
        <rect
          width={adjustedWidth}
          height={20}
          y={20}
          fill="url(#legendGradient)"
          rx={5}
          ry={5}
          stroke={theme.text}
          strokeWidth={2}
        />
        <text y={36} x={8} fill={colors(maxValue)}>
          0
        </text>
        <text y={36} x={adjustedWidth - 8} textAnchor="end" fill={colors(0)}>
          {maxValue}
        </text>
      </svg>
      <select
        value={heatmapTheme}
        onChange={(e) => setHeatmapTheme(e.target.value)}
      >
        {HEATMAP_THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
}
