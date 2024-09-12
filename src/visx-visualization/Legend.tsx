import { rgbToHex } from "@mui/material";
import React from "react";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useColorScale } from "../contexts/ScaleContext";

export function Legend() {
  const { scale: colors } = useColorScale();
  const { width } = usePanelDimensions("left_top");
  const { maxCount } = useData();
  const domain = colors.domain();
  return (
    <svg width={width}>
      <defs>
        <linearGradient id="legendGradient" gradientTransform="rotate(0)">
          <stop offset="5%" stopColor={rgbToHex(colors(domain[0]))} />
          <stop offset="95%" stopColor={rgbToHex(colors(domain[1]))} />
        </linearGradient>
      </defs>
      <rect width={width} height={20} y={20} fill="url(#legendGradient)" />
      <text y={36} x={40}>
        0
      </text>
      <text y={36} x={width - 40}>
        {maxCount}
      </text>
    </svg>
  );
}
