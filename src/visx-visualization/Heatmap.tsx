import React from "react";
import { useData } from "../contexts/DataContext";
import { useHeatmapDimensions } from "../contexts/DimensionsContext";
import { useColorScale, useXScale, useYScale } from "../contexts/ScaleContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";

export default function Heatmap() {
  const { data } = useData();
  const { scale: x } = useXScale();
  const { scale: y } = useYScale();
  const { scale: colors } = useColorScale();
  const { width, height } = useHeatmapDimensions();

  const { openTooltip } = useSetTooltipData();

  return (
    <svg width={width} height={height} className="heatmap">
      {data.countsMatrix.map((cell) => {
        return (
          <rect
            key={`${cell.row}-${cell.col}`}
            x={x(cell.col) || 0}
            y={y(cell.row) || 0}
            width={x.bandwidth()}
            height={y.bandwidth()}
            fill={colors(cell.value)}
            onMouseOver={(e) => {
              openTooltip(
                {
                  title: `${cell.row} - ${cell.col}`,
                  data: {
                    "cell count": cell.value,
                    row: cell.row,
                    column: cell.col,
                  },
                },
                e.clientX,
                e.clientY,
              );
            }}
          />
        );
      })}
    </svg>
  );
}
