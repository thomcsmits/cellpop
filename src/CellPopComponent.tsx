import React, { useCallback, useMemo } from "react";

import Skeleton from "@mui/material/Skeleton";
import { withParentSize, WithParentSizeProvidedProps } from "@visx/responsive";
import { CellPopData, CellPopTheme } from "./cellpop-schema";
import { AxisConfig } from "./contexts/AxisConfigContext";
import { Dimensions } from "./contexts/DimensionsContext";
import { Providers } from "./contexts/Providers";
import Controls from "./visx-visualization/Controls";
import VizContainer from "./visx-visualization/layout";

interface CellPopConfig {
  yAxis: AxisConfig;
  xAxis: AxisConfig;
  onClick?: (e: React.MouseEvent) => void;
  dimensions?: Dimensions;
  theme?: CellPopTheme;
}

export interface CellPopProps
  extends WithParentSizeProvidedProps,
    CellPopConfig {
  data: CellPopData;
}

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export const CellPop = withParentSize(
  ({
    theme = "light",
    dimensions: definedDimensions,
    data,
    xAxis,
    yAxis,
    onClick,
    parentHeight,
    parentWidth,
  }: CellPopProps) => {
    // If dimensions are provided, use them.
    // Otherwise, fall back to using parentWidth and parentHeight.
    const dimensions = useMemo(() => {
      if (definedDimensions) {
        return definedDimensions;
      }
      return {
        width: parentWidth || 0,
        height: parentHeight || 0,
      };
    }, [definedDimensions, parentHeight, parentWidth]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        stopPropagation(e);
        onClick?.(e);
      },
      [onClick],
    );

    if (!data) {
      return <Skeleton />;
    }

    return (
      <div onClick={handleClick}>
        <Providers
          data={data}
          dimensions={dimensions}
          theme={theme}
          xAxis={xAxis}
          yAxis={yAxis}
        >
          <Controls />
          <VizContainer />
        </Providers>
      </div>
    );
  },
);
