import { AxisBottom } from "@visx/axis";
import { formatPrefix, max } from "d3";
import React from "react";
import { useRowConfig } from "../../contexts/AxisConfigContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useFraction } from "../../contexts/FractionContext";
import { useYScale } from "../../contexts/ScaleContext";
import HeatmapYAxis from "../heatmap/HeatmapYAxis";
import Bars from "./Bars";
import Violins from "./Violin";
import { LEFT_MARGIN } from "./constants";
import { useCountsScale } from "./hooks";

function LeftBar() {
  const { width } = usePanelDimensions("left_middle");
  const { rowCounts } = useData();
  // Use same y scale as the heatmap
  const { scale: yScale } = useYScale();
  const xScale = useCountsScale(
    [0, max(Object.values(rowCounts)) || 0],
    [0, width - LEFT_MARGIN],
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

export function LeftGraphScale() {
  const { width, height } = usePanelDimensions("left_bottom");
  const { rowCounts } = useData();
  const xScale = useCountsScale(
    [0, max(Object.values(rowCounts)) || 0],
    [0, width - LEFT_MARGIN],
  );

  const axisScale = xScale.copy().range([width - LEFT_MARGIN, 0]);
  const { theme } = useCellPopTheme();
  return (
    <svg width={width} height={height}>
      <AxisBottom
        scale={axisScale}
        hideZero
        top={0}
        left={LEFT_MARGIN}
        orientation="bottom"
        stroke={theme.text}
        tickLabelProps={{ fill: theme.text }}
        tickStroke={theme.text}
        tickFormat={(t) => formatPrefix(".0k", t as number)(t)}
      />
    </svg>
  );
}

function LeftViolin() {
  return <Violins side="left" />;
}

/**
 * Container component for the left graph.
 */
export default function LeftGraph() {
  const { width, height } = usePanelDimensions("left_middle");

  const { fraction } = useFraction();
  const { flipAxisPosition } = useRowConfig();
  return (
    <svg className="left-graph-container" height={height} width={width}>
      {fraction ? <LeftViolin /> : <LeftBar />}
      {flipAxisPosition && <HeatmapYAxis />}
    </svg>
  );
}
