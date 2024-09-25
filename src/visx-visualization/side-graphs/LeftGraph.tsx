import { AxisBottom } from "@visx/axis";
import { formatPrefix, max } from "d3";
import React from "react";
import { useRowConfig } from "../../contexts/AxisConfigContext";
import { useRows } from "../../contexts/AxisOrderContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useFraction } from "../../contexts/FractionContext";
import { useYScale } from "../../contexts/ScaleContext";
import HeatmapYAxis from "../heatmap/HeatmapYAxis";
import Bars from "./Bars";
import Violins from "./Violin";
import { LEFT_MARGIN } from "./constants";
import { useCountsScale } from "./hooks";

const useXAxisCountsScale = () => {
  const { width } = usePanelDimensions("left_middle");
  const [, { filteredCounts }] = useRows();
  const { tickLabelSize } = useYScale();
  return useCountsScale(
    [0, max(Object.values(filteredCounts)) || 0],
    [0, width - LEFT_MARGIN - tickLabelSize],
  );
};

function LeftBar() {
  const { width } = usePanelDimensions("left_middle");
  const [, { filteredCounts }] = useRows();
  const { tickLabelSize } = useYScale();
  const xScale = useCountsScale(
    [0, max(Object.values(filteredCounts)) || 0],
    [0, width - LEFT_MARGIN - tickLabelSize],
  );
  // Use same y scale as the heatmap
  const { scale: yScale } = useYScale();

  return (
    <g className="barleft">
      <Bars
        orientation="horizontal"
        categoricalScale={yScale}
        numericalScale={xScale}
        data={filteredCounts}
        domainLimit={width}
      />
    </g>
  );
}

export function LeftGraphScale() {
  const { width, height } = usePanelDimensions("left_bottom");
  const xScale = useXAxisCountsScale();
  const { tickLabelSize } = useYScale();

  const axisScale = xScale.copy().range([width - LEFT_MARGIN, tickLabelSize]);
  const { theme } = useCellPopTheme();
  return (
    <svg
      width={width}
      height={height}
      style={{ borderTop: `1px solid ${theme.sideCharts}` }}
    >
      <AxisBottom
        scale={axisScale}
        hideZero
        hideAxisLine
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
