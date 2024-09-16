import { AxisBottom, Orientation } from "@visx/axis";
import React from "react";
import { useColumns } from "../contexts/AxisOrderContext";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useXScale } from "../contexts/ScaleContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";
import { AxisButtons } from "./AxisButtons";
import { textSize } from "./constants";

export default function HeatmapXAxis() {
  const { columnCounts } = useData();
  const { theme } = useCellPopTheme();
  const { scale: x } = useXScale();
  const { width, height } = usePanelDimensions("center_bottom");

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [columns, { setSortOrder }] = useColumns();

  return (
    <>
      <svg width={width} height={height} className="cellpop__heatmap_axis_x">
        <AxisBottom
          scale={x}
          label="Cell Type"
          numTicks={x.domain().length}
          tickLineProps={{
            fontSize: textSize,
          }}
          tickLabelProps={(t) =>
            ({
              textAnchor: "end",
              fontSize: "12px",
              fontFamily: "sans-serif",
              style: {
                fontVariantNumeric: "tabular-nums",
              },
              fill: theme.text,
              dy: "0.25em",
              transform: `rotate(-90, ${x(t)}, 12)translate(0, ${x.bandwidth() / 2})`,
              onMouseOver: (e) => {
                const totalCounts = columnCounts[t];
                openTooltip(
                  {
                    title: t,
                    data: {
                      "Cell Count": totalCounts,
                      column: t,
                    },
                  },
                  e.clientX,
                  e.clientY,
                );
              },
              onMouseOut: closeTooltip,
            }) as const
          }
          tickValues={columns}
          orientation={Orientation.bottom}
          labelOffset={Math.max(...x.domain().map((s) => s.length)) * 8}
          labelProps={{
            fontSize: textSize,
            fill: theme.text,
          }}
        />
      </svg>
      <AxisButtons axis="X" setSortOrder={setSortOrder} />
    </>
  );
}
