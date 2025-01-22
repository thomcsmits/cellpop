import { useTheme } from "@mui/material/styles";
import { Axis, Orientation } from "@visx/axis";
import React, { useId } from "react";
import { useColumnConfig } from "../../contexts/AxisConfigContext";
import {
  useColumnCounts,
  useColumns,
  useData,
} from "../../contexts/DataContext";
import { useXScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import { LEFT_MULTIPLIER, TOP_MULTIPLIER } from "../side-graphs/constants";
import SVGBackgroundColorFilter from "../SVGBackgroundColorFilter";
import { TICK_TEXT_SIZE } from "./constants";
import { useHeatmapAxis, useSetTickLabelSize } from "./hooks";

/**
 * Component which renders the x-axis of the heatmap.
 * @returns
 */
export default function HeatmapXAxis() {
  const columnCounts = useColumnCounts();
  const theme = useTheme();
  const { scale: x, tickLabelSize, setTickLabelSize } = useXScale();
  const axisConfig = useColumnConfig();
  const { label, flipAxisPosition } = axisConfig;

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const columns = useColumns();
  const filteredColumns = columns.length;
  const allColumns = useData((s) => s.columnOrder.length);

  const labelWithCounts =
    filteredColumns !== allColumns
      ? `${label} (${filteredColumns}/${allColumns})`
      : `${label} (${allColumns})`;

  const filterId = useId();
  const { openInNewTab, tickTitle, tickLabelStyle } =
    useHeatmapAxis(axisConfig);
  const size = x.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : x.bandwidth();

  useSetTickLabelSize(flipAxisPosition ?? false, setTickLabelSize, "x", size);

  return (
    <>
      <SVGBackgroundColorFilter
        color={theme.palette.background.default}
        id={filterId}
      />
      <Axis
        scale={x}
        label={labelWithCounts}
        numTicks={x.domain().length}
        stroke={theme.palette.text.primary}
        tickStroke={theme.palette.text.primary}
        top={tickLabelSize * TOP_MULTIPLIER}
        tickLabelProps={(t) =>
          ({
            angle: -90,
            dx: "0.25em",
            dy: "-0.25em",
            textAnchor: "start",
            fontSize: size,
            style: tickLabelStyle,
            fill: theme.palette.text.primary,
            className: "x-axis-tick-label",
            fontFamily: theme.typography.fontFamily,
            onMouseOver: (e) => {
              openTooltip(
                {
                  title: tickTitle(t),
                  data: {
                    "Cell Count": columnCounts[t],
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
        tickValues={columns}
        orientation={Orientation.top}
        labelProps={{
          fontSize: TICK_TEXT_SIZE * LEFT_MULTIPLIER,
          fill: theme.palette.text.primary,
          className: "x-axis-label text",
          pointerEvents: "none",
          fontFamily: theme.typography.fontFamily,
        }}
        labelOffset={tickLabelSize}
      />
    </>
  );
}
