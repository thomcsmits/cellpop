import { AxisRight, Orientation } from "@visx/axis";
import React from "react";
import { useRowConfig } from "../contexts/AxisConfigContext";
import { useRows } from "../contexts/AxisOrderContext";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useYScale } from "../contexts/ScaleContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";
import { textSize } from "./constants";

/**
 * Component which renders the y-axis of the heatmap.
 */
export default function HeatmapYAxis() {
  const { rowCounts } = useData();
  const { theme } = useCellPopTheme();
  const { scale: y } = useYScale();
  const { width, height } = usePanelDimensions("right_middle");
  const { label, createHref } = useRowConfig();

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [rows] = useRows();

  const openInNewTab = (tick: string) => {
    const href = createHref?.(tick);
    if (href) {
      window.open(href, "_blank");
    }
  };

  const size = y.bandwidth() > textSize ? textSize : y.bandwidth();

  return (
    <svg width={width} height={height} className="cellpop__heatmap_axis_y">
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
          fontSize: textSize * 1.5,
          fill: theme.text,
        }}
      />
    </svg>
  );
}
