import { rgbToHex } from "@mui/material";
import React, { useId } from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useColorScale } from "../contexts/ScaleContext";

export default function Legend() {
  const { scale: colors } = useColorScale();
  const { width } = usePanelDimensions("left_top");
  const { maxCount } = useData();
  const { theme } = useCellPopTheme();
  const domain = colors.domain();
  const id = useId() + "-legend";
  return (
    <div>
      <label htmlFor={id} style={{ color: theme.text }}>
        Counts
      </label>
      <svg width={width} id={id}>
        <defs>
          <linearGradient id="legendGradient" gradientTransform="rotate(0)">
            <stop offset="5%" stopColor={rgbToHex(colors(domain[0]))} />
            <stop offset="95%" stopColor={rgbToHex(colors(domain[1]))} />
          </linearGradient>
        </defs>
        <rect width={width} height={20} y={20} fill="url(#legendGradient)" />
        <text y={36} x={40} fill={theme.text}>
          0
        </text>
        <text y={36} x={width - 40} fill={theme.text}>
          {maxCount}
        </text>
      </svg>
    </div>
  );
}
