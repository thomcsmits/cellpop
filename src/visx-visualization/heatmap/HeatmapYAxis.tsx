import { AxisRight, Orientation } from "@visx/axis";
import React, { useId } from "react";
import { useRowConfig } from "../../contexts/AxisConfigContext";
import { useRows } from "../../contexts/AxisOrderContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { useYScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import SVGBackgroundColorFilter from "../SVGBackgroundColorFilter";
import { TICK_TEXT_SIZE } from "./constants";
import { useHeatmapAxis, useSetTickLabelSize } from "./hooks";

/**
 * Component which renders the y-axis of the heatmap.
 */
export default function HeatmapYAxis() {
  const { theme } = useCellPopTheme();
  const { scale: y, tickLabelSize, setTickLabelSize } = useYScale();
  const axisConfig = useRowConfig();
  const { label, flipAxisPosition } = axisConfig;
  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [rows] = useRows();
  const { rowCounts } = useData();

  const filterId = useId();
  const { openInNewTab, tickTitle, tickLabelStyle } = useHeatmapAxis(
    axisConfig,
    filterId,
  );

  const size = y.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : y.bandwidth();

  useSetTickLabelSize(flipAxisPosition, setTickLabelSize, "y", size);

  return (
    <>
      <SVGBackgroundColorFilter color={theme.background} id={filterId} />
      <AxisRight
        scale={y}
        label={label}
        numTicks={y.domain().length}
        stroke={theme.text}
        tickStroke={theme.text}
        tickLabelProps={(t) =>
          ({
            fontSize: size,
            fill: theme.text,
            className: "y-axis-tick-label",
            style: tickLabelStyle,
            transform: `translate(0, ${size / 4})`,
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
        labelOffset={
          tickLabelSize || Math.max(...y.domain().map((s) => s.length)) * 8
        }
        labelProps={{
          fontSize: TICK_TEXT_SIZE * 1.5,
          fill: theme.text,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
