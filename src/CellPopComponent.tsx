import React, { useCallback, useMemo } from "react";

import { Theme } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { withParentSize, WithParentSizeProvidedProps } from "@visx/responsive";
import { CellPopData, CellPopTheme } from "./cellpop-schema";
import { AxisConfig } from "./contexts/AxisConfigContext";
import { OuterContainerRefProvider } from "./contexts/ContainerRefContext";
import { Dimensions, GridSizeTuple } from "./contexts/DimensionsContext";
import { Providers } from "./contexts/Providers";
import "./style.css";
import Controls from "./visx-visualization/Controls";
import VizContainer from "./visx-visualization/layout";

type DisableableControls = "fraction" | "selection" | "theme";

interface CellPopConfig {
  yAxis: AxisConfig;
  xAxis: AxisConfig;
  onClick?: (e: React.MouseEvent) => void;
  dimensions?: Dimensions;
  theme?: CellPopTheme;
  customTheme?: Theme;
  disabledControls?: DisableableControls[];
  initialProportions?: [GridSizeTuple, GridSizeTuple];
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
    customTheme,
    disabledControls,
    initialProportions,
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

    const outerContainerRef = React.useRef<HTMLDivElement | null>(null);

    if (!data) {
      return <Skeleton />;
    }

    return (
      <OuterContainerRefProvider value={outerContainerRef}>
        <div onClick={handleClick} ref={outerContainerRef}>
          <Providers
            data={data}
            dimensions={dimensions}
            theme={theme}
            customTheme={customTheme}
            xAxis={xAxis}
            yAxis={yAxis}
            disabledControls={disabledControls}
            initialProportions={initialProportions}
          >
            <Controls />
            <VizContainer />
          </Providers>
        </div>
      </OuterContainerRefProvider>
    );
  },
);
