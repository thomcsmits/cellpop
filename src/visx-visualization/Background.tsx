import React from "react";
import { useDimensions, useTheme } from "./ConfigContext";

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
  } = useTheme();

  return <rect width={width} height={height} fill={background} />;
}
