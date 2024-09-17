import React from "react";

import { AxisRight } from "@visx/axis";
import { formatPrefix, max } from "d3";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useXScale } from "../contexts/ScaleContext";
import { Bars } from "./Bars";
import { useCountsScale } from "./hooks";
import Violins from "./Violin";

function TopBar() {
  const { width, height } = usePanelDimensions("center_top");
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const { scale: xScale } = useXScale();
  const yScale = useCountsScale(
    [max(Object.values(columnCounts)) || 0, 0],
    [height, 0],
  );
  const axisScale = yScale.copy().range([0, height]);

  return (
    <g className="bartop">
      <Bars
        orientation="vertical"
        categoricalScale={xScale}
        numericalScale={yScale}
        data={columnCounts}
        domainLimit={height}
      />
      <AxisRight
        scale={axisScale}
        top={0}
        left={width}
        orientation="right"
        tickFormat={(t) => formatPrefix(".0k", t as number)(t)}
      />
    </g>
  );
}

export function TopGraphScale() {
  const { width, height } = usePanelDimensions("right_top");
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const yScale = useCountsScale(
    [max(Object.values(columnCounts)) || 0, 0],
    [height, 0],
  );

  const axisScale = yScale.copy().range([0, height]);
  return (
    <svg width={width} height={height}>
      <AxisRight
        scale={axisScale}
        top={0}
        left={0}
        orientation="right"
        tickFormat={(t) => formatPrefix(".0k", t as number)(t)}
      />
    </svg>
  );
}

function TopViolin() {
  return <Violins side="top" />;
}

/**
 * Container component for the top graph.
 */
export default function TopGraph() {
  const { width, height } = usePanelDimensions("center_top");

  const { fraction } = useFraction();
  return (
    <svg className="top-graph-container" height={height} width={width}>
      {fraction ? <TopViolin /> : <TopBar />}
    </svg>
  );
}
