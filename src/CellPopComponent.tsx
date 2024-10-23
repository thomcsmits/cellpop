import React from "react";

import Skeleton from "@mui/material/Skeleton";
import { CellPopData, CellPopTheme } from "./cellpop-schema";
import CellPopConfig from "./CellPopConfig";
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
}

export const CellPop = ({
  theme,
  dimensions,
  data,
  xAxisConfig,
  yAxisConfig,
}: CellPopProps) => {
  if (!data) {
    return <Skeleton />;
  }

  return (
    <div>
      <Providers
        data={data}
        dimensions={dimensions}
        theme={theme}
        xAxisConfig={xAxisConfig}
        yAxisConfig={yAxisConfig}
      >
        <CellPopConfig />
        <VizContainer />
      </Providers>
    </div>
  );
};
