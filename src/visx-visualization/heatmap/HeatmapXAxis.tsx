import { useTheme } from "@mui/material/styles";
import { AxisBottom, Orientation } from "@visx/axis";
import React, { useId } from "react";
import { useColumnConfig } from "../../contexts/AxisConfigContext";
import { useColumns } from "../../contexts/AxisOrderContext";
import { useData } from "../../contexts/DataContext";
import { useXScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import SVGBackgroundColorFilter from "../SVGBackgroundColorFilter";
import { TICK_TEXT_SIZE } from "./constants";
import { useHeatmapAxis, useSetTickLabelSize } from "./hooks";

/**
 * Component which renders the x-axis of the heatmap.
 * @returns
 */
export default function HeatmapXAxis() {
  const { columnCounts } = useData();
  const theme = useTheme();
  const { scale: x, tickLabelSize, setTickLabelSize } = useXScale();
  const axisConfig = useColumnConfig();
  const { label, flipAxisPosition } = axisConfig;

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [columns] = useColumns();

  const filterId = useId();
  const { openInNewTab, tickTitle, tickLabelStyle } = useHeatmapAxis(
    axisConfig,
    filterId,
  );
  const size = x.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : x.bandwidth();

  useSetTickLabelSize(flipAxisPosition, setTickLabelSize, "x", size);

  return (
    <>
      <SVGBackgroundColorFilter
        color={theme.palette.background.default}
        id={filterId}
      />
      <AxisBottom
        scale={x}
        label={label}
        numTicks={x.domain().length}
        stroke={theme.palette.text.primary}
        tickStroke={theme.palette.text.primary}
        tickLabelProps={(t) =>
          ({
            textAnchor: "end",
            fontSize: size,
            style: tickLabelStyle,
            fill: theme.palette.text.primary,
            dy: "0.25em",
            className: "x-axis-tick-label text",
            transform: `rotate(-90, ${x(t)}, ${size})translate(0, ${size / 4})`,
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
        orientation={Orientation.bottom}
        labelProps={{
          fontSize: TICK_TEXT_SIZE * 1.5,
          fill: theme.palette.text.primary,
          className: "x-axis-label text",
          pointerEvents: "none",
        }}
        labelOffset={tickLabelSize - TICK_TEXT_SIZE * 2}
      />
    </>
  );
}
