import React, { useRef } from "react";

import Skeleton from "@mui/material/Skeleton";
import { CellPopProps } from "./cellpop-schema";
import CellPopConfig from "./CellPopConfig";
import { Providers } from "./contexts/Providers";
import Background from "./visx-visualization/Background";
import Heatmap from "./visx-visualization/Heatmap";
import LeftGraph from "./visx-visualization/LeftGraph";
import TopGraph from "./visx-visualization/TopGraph";
import VizContainer from "./visx-visualization/VizContainer";

export const CellPop = ({ theme, dimensions, data }: CellPopProps) => {
  const cellPopRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return <Skeleton />;
  }

  return (
    <div>
      <Providers data={data} dimensions={dimensions} theme={theme}>
        <CellPopConfig />
        <VizContainer ref={cellPopRef}>
          <Background />
          <Heatmap />
          <TopGraph />
          <LeftGraph />
        </VizContainer>
      </Providers>
    </div>
  );
};
