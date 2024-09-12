import { AxisBottom } from "@visx/axis";
import { formatPrefix, max } from "d3";
import React from "react";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useFraction } from "../contexts/FractionContext";
import { useYScale } from "../contexts/ScaleContext";
import { Bars } from "./Bars";
import { useCountsScale } from "./hooks";
import Violins from "./Violin";

function LeftBar() {
  const { width } = usePanelDimensions("left_middle");
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
        xOffset={0}
        yOffset={0}
      />
    </g>
  );
}

export function LeftGraphScale() {
  const { width } = usePanelDimensions("left_bottom");
  const { rowCounts } = useData();
  const xScale = useCountsScale(
    [0, max(Object.values(rowCounts)) || 0],
    [0, width],
  );

  const axisScale = xScale.copy().range([width, 0]);
  return (
    <svg>
      <AxisBottom
        scale={axisScale}
        top={0}
        left={0}
        orientation="bottom"
        tickFormat={(t) => formatPrefix(".0k", t as number)(t)}
      />
    </svg>
  );
}

function LeftViolin() {
  return <Violins side="left" />;
}

export default function LeftGraph() {
  const { width, height } = usePanelDimensions("left_middle");

  const { fraction } = useFraction();

  return (
    <svg className="left-graph-container" height={height} width={width}>
      {fraction ? <LeftViolin /> : <LeftBar />}
    </svg>
  );
}
