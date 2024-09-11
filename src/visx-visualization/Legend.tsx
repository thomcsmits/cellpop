import { rgbToHex } from "@mui/material";
import React from "react";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useColorScale } from "../contexts/ScaleContext";

export function Legend() {
  const { scale: colors } = useColorScale();
  const {
    dimensions: {
      barLeft: { width },
    },
  } = useDimensions();
  const { maxCount } = useData();
  const domain = colors.domain();
  return (
    <g>
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
    </g>
  );
}
