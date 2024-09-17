import { AxisRight, Orientation } from "@visx/axis";
import React from "react";
import { useRows } from "../contexts/AxisOrderContext";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { usePanelDimensions } from "../contexts/DimensionsContext";
import { useYScale } from "../contexts/ScaleContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";
import { AxisButtons } from "./AxisButtons";
import { textSize } from "./constants";

/**
 * Component which renders the y-axis of the heatmap.
 */
export default function HeatmapYAxis() {
  const { rowCounts } = useData();
  const { theme } = useCellPopTheme();
  const { scale: y } = useYScale();
  const { width, height } = usePanelDimensions("right_middle");

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [rows, { setSortOrder }] = useRows();

  return (
    <div style={{ width: "100%" }}>
      <svg width={width} height={height} className="cellpop__heatmap_axis_y">
        <AxisRight
          scale={y}
          label="Sample"
          numTicks={y.domain().length}
          tickLineProps={{
            fontSize: textSize,
          }}
          tickLabelProps={{
            fontSize: textSize,
            fill: theme.text,
            style: {
              fontFamily: "sans-serif",
              fontVariantNumeric: "tabular-nums",
            },
            onMouseOver: (e) => {
              const target = e.target as SVGTextElement;
              const title = target.textContent;
              const totalCounts = rowCounts[title];
              openTooltip(
                {
                  title,
                  data: {
                    "Cell Count": totalCounts,
                    row: title,
                  },
                },
                e.clientX,
                e.clientY,
              );
            },
            onMouseOut: closeTooltip,
          }}
          tickValues={rows}
          orientation={Orientation.right}
          labelOffset={Math.max(...y.domain().map((s) => s.length)) * 10}
          labelProps={{
            fontSize: textSize,
            fill: theme.text,
          }}
        />
      </svg>
      <AxisButtons axis="Y" setSortOrder={setSortOrder} />
    </div>
  );
}
