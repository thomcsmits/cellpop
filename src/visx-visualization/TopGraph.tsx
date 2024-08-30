import React from "react";

import { max } from "d3";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useXScale } from "../contexts/ScaleContext";
import { Bars } from "./Bars";
import { useCountsScale } from "./hooks";

function TopBar() {
  const {
    dimensions: {
      barTop: { height },
    },
  } = useDimensions();
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const { scale: xScale } = useXScale();
  const yScale = useCountsScale(
    [0, max(Object.values(columnCounts)) || 0],
    [height, 0],
  );

  return (
    <g className="bartop">
      <Bars
        orientation="vertical"
        categoricalScale={xScale}
        numericalScale={yScale}
        data={columnCounts}
        domainLimit={height}
      />
    </g>
  );
}

function TopViolin() {
  return <rect />;
}

export default function TopGraph() {
  const {
    dimensions: {
      barTop: { offsetHeight, offsetWidth, height, width },
    },
  } = useDimensions();

  const { fraction } = useFraction();
  return (
    <g
      className="top-graph-container"
      transform={`translate(${offsetWidth}, ${offsetHeight})`}
      height={height}
      width={width}
    >
      {fraction ? <TopViolin /> : <TopBar />}
    </g>
  );
}
