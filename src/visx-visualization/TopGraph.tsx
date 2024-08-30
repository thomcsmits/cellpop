import React from "react";

import { max } from "d3";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useXScale } from "../contexts/ScaleContext";
import { useCountsScale } from "./hooks";

function useTopGraphYScale() {
  const { columnCounts } = useData();
  const {
    dimensions: {
      barTop: { height },
    },
  } = useDimensions();

  return useCountsScale(
    [0, max(Object.values(columnCounts)) || 0],
    [height, 0],
  );
}

function TopBar() {
  const {
    dimensions: {
      barTop: { height },
    },
  } = useDimensions();
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const { scale: xScale } = useXScale();
  const yScale = useTopGraphYScale();

  return (
    <g className="bartop">
      {Object.entries(columnCounts).map(([col, count]) => {
        return (
          <rect
            key={col}
            x={xScale(col)}
            y={yScale(count)}
            width={xScale.bandwidth()}
            height={height - yScale(count)}
            fill="steelblue"
          />
        );
      })}
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
