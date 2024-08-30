import { max } from "d3";
import React from "react";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useYScale } from "../contexts/ScaleContext";
import { useCountsScale } from "./hooks";

function useLeftGraphXScale() {
  const {
    dimensions: {
      barLeft: { width },
    },
  } = useDimensions();
  const { rowCounts } = useData();
  return useCountsScale([0, max(Object.values(rowCounts)) || 0], [0, width]);
}

function LeftBar() {
  const {
    dimensions: {
      barLeft: { width, height },
    },
  } = useDimensions();
  const { rowCounts } = useData();
  // Use same y scale as the heatmap
  const { scale: yScale } = useYScale();
  const xScale = useLeftGraphXScale();

  return (
    <g className="barleft">
      {Object.entries(rowCounts).map(([row, count]) => {
        return (
          <rect
            key={row}
            x={xScale(count)}
            y={yScale(row)}
            width={width - xScale(count)}
            height={yScale.bandwidth()}
            fill="steelblue"
          />
        );
      })}
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
