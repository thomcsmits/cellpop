import React from "react";
import useCellPopConfig from "./CellPopConfigContext";

export default function Background() {
  const {
    dimensions: {
      global: {
        width: { total: width },
        height: { total: height },
      },
    },
    theme: { background },
  } = useCellPopConfig();
  return <rect width={width} height={height} fill={background} />;
}
