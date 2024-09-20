import { AxisBottom, Orientation } from "@visx/axis";
import React from "react";
import { useColumnConfig } from "../contexts/AxisConfigContext";
import { useColumns } from "../contexts/AxisOrderContext";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useXScale } from "../contexts/ScaleContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";
import { textSize } from "./constants";

/**
 * Component which renders the x-axis of the heatmap.
 * @returns
 */
export default function HeatmapXAxis() {
  const { columnCounts } = useData();
  const { theme } = useCellPopTheme();
  const { scale: x } = useXScale();
  const { width, height } = usePanelDimensions("center_bottom");
  const { label, createHref } = useColumnConfig();

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [columns] = useColumns();

  const openInNewTab = (tick: string) => {
    const href = createHref?.(tick);
    if (href) {
      window.open(href, "_blank");
    }
  };
  const size = x.bandwidth() > textSize ? textSize : x.bandwidth();

  return (
    <svg width={width} height={height} className="cellpop__heatmap_axis_x">
      <AxisBottom
        scale={x}
        label={label}
        numTicks={x.domain().length}
        stroke={theme.text}
        tickStroke={theme.text}
        tickLabelProps={(t) =>
          ({
            textAnchor: "end",
            fontSize: size,
            fontFamily: "sans-serif",
            style: {
              fontFamily: "sans-serif",
              fontVariantNumeric: "tabular-nums",
              cursor: createHref ? "pointer" : "default",
            },
            fill: theme.text,
            dy: "0.25em",
            transform: `rotate(-90, ${x(t)}, ${size})translate(0, ${size / 2})`,
            onMouseOver: (e) => {
              openTooltip(
                {
                  title: createHref ? `${t} (Click to view in new tab)` : t,
                  data: {
                    "Cell Count": columnCounts[t],
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
        tickValues={columns}
        orientation={Orientation.bottom}
        labelProps={{
          fontSize: textSize * 1.5,
          fill: theme.text,
        }}
        labelOffset={Math.max(...x.domain().map((s) => s.length)) * 8}
      />
    </svg>
  );
}
