import React, { useRef } from "react";

import { Skeleton } from "@mui/material";
import { CellPopProps } from "./cellpop-schema";
import CellPopConfig from "./CellPopConfig";
import Background from "./visx-visualization/Background";
import { CellPopConfigProvider } from "./visx-visualization/ConfigContext";
import Heatmap from "./visx-visualization/Heatmap";
import VizContainer from "./visx-visualization/VizContainer";

export const CellPop = ({ theme, dimensions, data }: CellPopProps) => {
  const cellPopRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return <Skeleton />;
  }

  return (
    <div>
      <CellPopConfigProvider data={data} dimensions={dimensions} theme={theme}>
        <CellPopConfig />
        <VizContainer ref={cellPopRef}>
          <Background />
          <Heatmap />
        </VizContainer>
      </CellPopConfigProvider>
    </div>
  );
};
