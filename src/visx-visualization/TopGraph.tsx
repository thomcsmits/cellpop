import React from "react";

import { max } from "d3";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useXScale } from "../contexts/ScaleContext";
import { Bars } from "./Bars";
import { useCountsScale } from "./hooks";
import Violins from "./Violin";

function TopBar() {
  const {
    dimensions: {
      barTop: { height, margin, offsetHeight, offsetWidth },
    },
  } = useDimensions();
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const { scale: xScale } = useXScale();
  const yScale = useCountsScale(
    [max(Object.values(columnCounts)) || 0, 0],
    [height, 0],
  );

  return (
    <g
      className="bartop"
      transform={`translate(${-margin.left},${-margin.top})`}
    >
      <Bars
        orientation="vertical"
        categoricalScale={xScale}
        numericalScale={yScale}
        data={columnCounts}
        domainLimit={height}
        xOffset={margin.left + offsetWidth}
        yOffset={margin.top + offsetHeight}
      />
    </g>
  );
}

function TopViolin() {
  return <Violins side="top" />;
}

export default function TopGraph() {
  const {
    dimensions: {
      barTop: { offsetHeight, offsetWidth, height, width, margin },
    },
  } = useDimensions();

  const { fraction } = useFraction();
  return (
    <g
      className="top-graph-container"
      transform={`translate(${offsetWidth + margin.left}, ${offsetHeight + margin.top})`}
      height={height}
      width={width}
    >
      {fraction ? <TopViolin /> : <TopBar />}
    </g>
  );
}
