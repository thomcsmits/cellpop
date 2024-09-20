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

/**
 * Component which renders the y-axis of the heatmap.
 */
export default function HeatmapYAxis() {
  const { rowCounts } = useData();
  const { theme } = useCellPopTheme();
  const { scale: y } = useYScale();
  const { label, createHref, flipAxisPosition } = useRowConfig();

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [rows] = useRows();

  const openInNewTab = (tick: string) => {
    const href = createHref?.(tick);
    if (href) {
      window.open(href, "_blank");
    }
  };
  const filterId = useId();

  const size = y.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : y.bandwidth();

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
            style: {
              fontFamily: "sans-serif",
              fontVariantNumeric: "tabular-nums",
              cursor: createHref ? "pointer" : "default",
              filter: flipAxisPosition ? `url(#${filterId})` : "none",
            },
            transform: `translate(0, ${size / 2})`,
            onMouseOver: (e) => {
              openTooltip(
                {
                  title: createHref ? `${t} (Click to view in new tab)` : t,
                  data: {
                    "Cell Count": rowCounts[t],
                    column: t,
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
        labelOffset={Math.max(...y.domain().map((s) => s.length)) * 10}
        labelProps={{
          fontSize: TICK_TEXT_SIZE * 1.5,
          fill: theme.text,
        }}
      />
    </>
  );
}
