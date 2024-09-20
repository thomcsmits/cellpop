import React from "react";

import { AxisRight } from "@visx/axis";
import { formatPrefix, max } from "d3";
import { useColumnConfig } from "../../contexts/AxisConfigContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useFraction } from "../../contexts/FractionContext";
import { useXScale } from "../../contexts/ScaleContext";
import HeatmapXAxis from "../heatmap/HeatmapXAxis";
import Bars from "./Bars";
import Violins from "./Violin";
import { TOP_MARGIN } from "./constants";
import { useCountsScale } from "./hooks";

function TopBar() {
  const { height } = usePanelDimensions("center_top");
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const { scale: xScale } = useXScale();
  const yScale = useCountsScale(
    [max(Object.values(columnCounts)) || 0, 0],
    [height - TOP_MARGIN, 0],
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

export function TopGraphScale() {
  const { width, height } = usePanelDimensions("right_top");
  const { columnCounts } = useData();
  // Use same x scale as the heatmap
  const yScale = useCountsScale(
    [max(Object.values(columnCounts)) || 0, 0],
    [height - TOP_MARGIN, 0],
  );

  const axisScale = yScale.copy().range([0, height - TOP_MARGIN]);
  const { theme } = useCellPopTheme();

  return (
    <svg width={width} height={height}>
      <AxisRight
        scale={axisScale}
        top={16}
        left={0}
        orientation="right"
        hideZero
        stroke={theme.text}
        tickLabelProps={{ fill: theme.text }}
        tickStroke={theme.text}
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

  const { flipAxisPosition } = useColumnConfig();

  const { fraction } = useFraction();
  return (
    <svg className="top-graph-container" height={height} width={width}>
      {fraction ? <TopViolin /> : <TopBar />}
      {flipAxisPosition && <HeatmapXAxis />}
    </svg>
  );
}
