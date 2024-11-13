import React, { useCallback } from "react";

import Skeleton from "@mui/material/Skeleton";
import { CellPopData, CellPopTheme } from "./cellpop-schema";
import { AxisConfig } from "./contexts/AxisConfigContext";
import { Dimensions } from "./contexts/DimensionsContext";
import { Providers } from "./contexts/Providers";
import VizContainer from "./visx-visualization/layout";

export interface CellPopProps {
  data: CellPopData;
  theme: CellPopTheme;
  dimensions: Dimensions;
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
  onClick?: (e: React.MouseEvent) => void;
}

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export const CellPop = ({
  theme,
  dimensions,
  data,
  xAxisConfig,
  yAxisConfig,
  onClick,
}: CellPopProps) => {
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
        xAxisConfig={xAxisConfig}
        yAxisConfig={yAxisConfig}
      >
        <VizContainer />
      </Providers>
    </div>
  );
};
