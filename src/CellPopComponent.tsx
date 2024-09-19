import React from "react";

import Skeleton from "@mui/material/Skeleton";
import { CellPopData, CellPopTheme } from "./cellpop-schema";
import CellPopConfig from "./CellPopConfig";
import { Dimensions } from "./contexts/DimensionsContext";
import { Providers } from "./contexts/Providers";
import VizContainer from "./visx-visualization/VizContainer";

export interface CellPopProps {
  data: CellPopData;
  theme: CellPopTheme;
  dimensions: Dimensions;
  createRowHref?: (row: string) => string;
  createColHref?: (col: string) => string;
}

export const CellPop = ({
  theme,
  dimensions,
  data,
  createColHref,
  createRowHref,
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
        createColHref={createColHref}
        createRowHref={createRowHref}
      >
        <CellPopConfig />
        <VizContainer />
      </Providers>
    </div>
  );
};
