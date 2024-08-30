import { max } from "d3";
import React from "react";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useYScale } from "../contexts/ScaleContext";
import { Bars } from "./Bars";
import { useCountsScale } from "./hooks";

function LeftBar() {
  const {
    dimensions: {
      barLeft: { width },
    },
  } = useDimensions();
  const { rowCounts } = useData();
  // Use same y scale as the heatmap
  const { scale: yScale } = useYScale();
  const xScale = useCountsScale(
    [0, max(Object.values(rowCounts)) || 0],
    [0, width],
  );

  return (
    <g className="barleft">
      <Bars
        orientation="horizontal"
        categoricalScale={yScale}
        numericalScale={xScale}
        data={rowCounts}
        domainLimit={width}
      />
    </g>
  );
}

// Placeholder
function LeftViolin() {
  return <rect />;
}

export default function LeftGraph() {
  const {
    dimensions: {
      barLeft: { offsetHeight, offsetWidth, height, width },
    },
  } = useDimensions();

  const { fraction } = useFraction();

  return (
    <g
      className="left-graph-container"
      transform={`translate(${offsetWidth}, ${offsetHeight})`}
      height={height}
      width={width}
    >
      {fraction ? <LeftViolin /> : <LeftBar />}
    </g>
  );
}
