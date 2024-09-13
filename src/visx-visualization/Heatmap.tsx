import {
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { Ref, RefObject } from "react";
import { useColumns, useRows } from "../contexts/AxisOrderContext";
import { useData } from "../contexts/DataContext";
import { useHeatmapDimensions } from "../contexts/DimensionsContext";
import { useColorScale, useXScale, useYScale } from "../contexts/ScaleContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";
import DragOverlayContainer from "./DragOverlay";

interface HeatmapArrayProps {
  dataKey: string;
  selectedDimension: "X" | "Y";
}

function HeatmapArray({ dataKey, selectedDimension }: HeatmapArrayProps) {
  const { dataMap } = useData();
  const { scale: xScale } = useXScale();
  const { scale: yScale } = useYScale();
  const { scale: colors } = useColorScale();
  const { width, height } = useHeatmapDimensions();
  const [rows] = useRows();
  const [columns] = useColumns();
  const { openTooltip } = useSetTooltipData();

  const otherAxisItems = selectedDimension === "X" ? rows : columns;

  const widthScale = selectedDimension === "X" ? xScale : yScale;
  const rowWidth = widthScale.bandwidth();
  const rowHeight = selectedDimension === "X" ? height : width;

  const strategy =
    selectedDimension === "X"
      ? verticalListSortingStrategy
      : horizontalListSortingStrategy;
  const { attributes, listeners, setNodeRef, isDragging, setActivatorNodeRef } =
    useSortable({
      id: dataKey,
      strategy,
    });

  const cellWidth = xScale.bandwidth();
  const cellHeight = yScale.bandwidth();

  return (
    <g
      className="cellpop__heatmap-array"
      width={rowWidth}
      height={rowHeight}
      x={xScale(dataKey)}
      y={yScale(dataKey)}
      ref={setNodeRef as unknown as Ref<SVGGElement>}
      {...attributes}
      {...listeners}
    >
      {otherAxisItems.map((itemKey) => {
        const row = selectedDimension === "X" ? itemKey : dataKey;
        const column = selectedDimension === "X" ? dataKey : itemKey;
        const counts = dataMap.get(`${row}-${column}`);
        return (
          <rect
            key={`${row}-${column}`}
            x={xScale(column)}
            y={yScale(row)}
            width={cellWidth}
            height={cellHeight}
            fill={colors(counts)}
            tabIndex={100}
            onMouseOver={(e) => {
              openTooltip(
                {
                  title: `${row} - ${column}`,
                  data: {
                    "cell count": counts,
                    row,
                    column,
                  },
                },
                e.clientX,
                e.clientY,
              );
            }}
          />
        );
      })}
      <rect
        x={xScale(dataKey)}
        y={yScale(dataKey)}
        width={rowWidth}
        height={rowHeight}
        fill="transparent"
        style={{
          outline: isDragging ? "1px solid black" : "none",
          outlineOffset: isDragging ? "-1px" : "none",
          pointerEvents: "none",
        }}
      />
    </g>
  );
}

export default function Heatmap() {
  const { width, height } = useHeatmapDimensions();
  const { selectedDimension } = useSelectedDimension();
  const [rows] = useRows();
  const [columns] = useColumns();

  const items = selectedDimension === "X" ? columns : rows;

  return (
    <svg width={width} height={height} className="heatmap">
      <DragOverlayContainer>
        {items.map((key) => (
          <HeatmapArray
            key={key}
            dataKey={key}
            selectedDimension={selectedDimension}
          />
        ))}
      </DragOverlayContainer>
    </svg>
  );
}
