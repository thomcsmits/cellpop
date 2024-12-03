import { useTheme } from "@mui/material/styles";
import {
  AxisLeft,
  AxisRight,
  Orientation,
  TickRendererProps,
} from "@visx/axis";
import { scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import React, { useId } from "react";
import { AxisConfig, useRowConfig } from "../../contexts/AxisConfigContext";
import {
  useData,
  useRowCounts,
  useRowMaxes,
  useRows,
} from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useSelectedValues } from "../../contexts/ExpandedValuesContext";
import { EXPANDED_ROW_PADDING, useYScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import SVGBackgroundColorFilter from "../SVGBackgroundColorFilter";
import { TICK_TEXT_SIZE } from "./constants";
import { useHeatmapAxis, useSetTickLabelSize } from "./hooks";

/**
 * Component which renders the y-axis of the heatmap.
 */
export default function HeatmapYAxis() {
  const theme = useTheme();
  const selectedValues = useSelectedValues((s) => s.selectedValues);
  const { scale: y, tickLabelSize, setTickLabelSize } = useYScale();
  const axisConfig = useRowConfig();
  const { label, flipAxisPosition } = axisConfig;
  const { openTooltip, closeTooltip } = useSetTooltipData();

  const rows = useRows();
  const rowCounts = useRowCounts();
  const filteredRowsCount = rows.length;
  const allColumnsCount = useData((s) => s.rowOrder.length);

  const labelWithCounts =
    filteredRowsCount !== allColumnsCount
      ? `${label} (${filteredRowsCount}/${allColumnsCount})`
      : `${label} (${allColumnsCount})`;

  const filterId = useId();
  const { openInNewTab, tickTitle, tickLabelStyle } = useHeatmapAxis(
    axisConfig,
    filterId,
  );

  const fontSize =
    y.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : y.bandwidth();

  useSetTickLabelSize(flipAxisPosition, setTickLabelSize, "y", fontSize);

  return (
    <>
      <SVGBackgroundColorFilter
        color={theme.palette.background.default}
        id={filterId}
      />
      <AxisRight
        scale={y}
        label={labelWithCounts}
        left={1}
        stroke={theme.palette.text.primary}
        tickStroke={theme.palette.text.primary}
        tickComponent={
          selectedValues.size > 0
            ? (props) =>
                ExpandedRowTick({
                  ...props,
                  axisConfig,
                  openInNewTab,
                  tickTitle,
                  tickLabelStyle,
                })
            : undefined
        }
        tickLabelProps={(t) =>
          ({
            fontSize,
            fill: theme.palette.text.primary,
            className: "y-axis-tick-label text",
            style: tickLabelStyle,
            transform: `translate(0, ${fontSize / 4})`,
            onMouseOver: (e) => {
              openTooltip(
                {
                  title: tickTitle(t),
                  data: {
                    "Cell Count": rowCounts[t],
                    [label]: t,
                  },
                },
                e.clientX,
                e.clientY,
              );
            },
            onMouseOut: closeTooltip,
            onClick: () => openInNewTab(t),
          }) as const
        }
        tickValues={rows}
        orientation={Orientation.right}
        labelOffset={tickLabelSize + TICK_TEXT_SIZE}
        labelProps={{
          fontSize: TICK_TEXT_SIZE * 1.5,
          fill: theme.palette.text.primary,
          pointerEvents: "none",
          className: "y-axis-label text",
        }}
        hideTicks={selectedValues.size > 0}
      />
    </>
  );
}

function ExpandedRowTick({
  x,
  y,
  formattedValue: row,
  axisConfig,
  openInNewTab,
  tickTitle,
  tickLabelStyle,
  ...tickLabelProps
}: TickRendererProps & {
  axisConfig: AxisConfig;
} & ReturnType<typeof useHeatmapAxis>) {
  const { expandedSize } = useYScale();
  const selectedValues = useSelectedValues((s) => s.selectedValues);
  const { flipAxisPosition } = axisConfig;
  const rowMaxes = useRowMaxes();

  const panelSize = usePanelDimensions(
    flipAxisPosition ? "left_middle" : "right_middle",
  );
  const { openTooltip, closeTooltip } = useSetTooltipData();
  const theme = useTheme();

  if (selectedValues.has(row)) {
    // Display an axis scaled for the selected value instead of the tick if the value is expanded
    // Use the tick label as the axis label
    const Axis = flipAxisPosition ? AxisLeft : AxisRight;
    const max = rowMaxes[row];
    const yScale = scaleLinear({
      domain: [max, 0],
      range: [EXPANDED_ROW_PADDING, expandedSize - EXPANDED_ROW_PADDING],
      nice: true,
    });
    return (
      <Axis
        top={y - EXPANDED_ROW_PADDING * 2}
        left={panelSize.width}
        scale={yScale}
        label={row}
        labelOffset={expandedSize / 2}
        tickLabelProps={{
          fill: theme.palette.text.primary,
          style: tickLabelStyle,
          onMouseOut: closeTooltip,
          onClick: () => openInNewTab(row),
          className: "text",
        }}
        labelProps={{
          style: tickLabelStyle,
          fill: theme.palette.text.primary,
          className: "text",
          onMouseMove: (e) => {
            openTooltip(
              {
                title: tickTitle(row),
                data: {
                  "Cell Count": max,
                },
              },
              e.clientX,
              e.clientY,
            );
          },
          onMouseOut: closeTooltip,
          onClick: () => openInNewTab(row),
        }}
      />
    );
  }
  return (
    <Text x={x} y={y} {...tickLabelProps} className="text">
      {row}
    </Text>
  );
}
