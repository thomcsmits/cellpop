import React from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useDimensions } from "../contexts/DimensionsContext";

export default function Background() {
  const {
    dimensions: {
      global: {
        width: { total: width },
        height: { total: height },
      },
    },
  } = useDimensions();
  const {
    theme: { background },
  } = useCellPopTheme();

  return <rect width={width} height={height} fill={background} />;
}
