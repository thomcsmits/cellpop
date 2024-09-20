import { AxisBottom, Orientation } from "@visx/axis";
import React, { useId } from "react";
import { useColumnConfig } from "../../contexts/AxisConfigContext";
import { useColumns } from "../../contexts/AxisOrderContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { useXScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import SVGBackgroundColorFilter from "../SVGBackgroundColorFilter";
import { TICK_TEXT_SIZE } from "./constants";

/**
 * Component which renders the x-axis of the heatmap.
 * @returns
 */
export default function HeatmapXAxis() {
  const { columnCounts } = useData();
  const { theme } = useCellPopTheme();
  const { scale: x } = useXScale();
  const { label, createHref, flipAxisPosition } = useColumnConfig();

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [columns] = useColumns();

  const openInNewTab = (tick: string) => {
    const href = createHref?.(tick);
    if (href) {
      window.open(href, "_blank");
    }
  };
  const size = x.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : x.bandwidth();

  const filterId = useId();

  return (
    <>
      <SVGBackgroundColorFilter color={theme.background} id={filterId} />
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
              filter: flipAxisPosition ? `url(#${filterId})` : "none",
            },
            fill: theme.text,
            dy: "0.25em",
            transform: `rotate(-90, ${x(t)}, ${size})`,
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
          fontSize: TICK_TEXT_SIZE * 1.5,
          fill: theme.text,
        }}
        labelOffset={Math.max(...x.domain().map((s) => s.length)) * 8}
      />
    </>
  );
}
