import { scaleLinear } from "@visx/scale";
import React, { useMemo } from "react";

import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { useHeatmapDimensions } from "../../contexts/DimensionsContext";
import {
  useColorScale,
  useXScale,
  useYScale,
} from "../../contexts/ScaleContext";
import { useSelectedDimension } from "../../contexts/SelectedDimensionContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import DragOverlayContainer from "./DragOverlay";

function HeatmapRow({ row }: { row: string }) {
  const { width } = useHeatmapDimensions();
  const { scale: xScale } = useXScale();
  const { scale: yScale, selectedValues } = useYScale();
  const { scale: colors } = useColorScale();
  const cellWidth = Math.ceil(xScale.bandwidth());
  // @ts-expect-error - custom y scale provides the appropriate band width for the given row
  // and providing an arg to a regular scale's bandwidth function doesn't throw, so this is fine
  const cellHeight = Math.ceil(yScale.bandwidth(row));
  const { removedRows, removedColumns, rowMaxes, dataMap } = useData();
  const [columns] = useColumns();

  if (removedRows.has(row)) {
    return null;
  }

  const rowKeys = columns.map((col) => `${row}-${col}`);
  const max = rowMaxes[row];

  if (selectedValues.has(row)) {
    const inlineYScale = scaleLinear({
      domain: [0, max],
      range: [0, cellHeight],
      nice: true,
    });
    return (
      <g>
        <rect
          x={0}
          y={yScale(row)}
          width={width}
          height={cellHeight}
          fill="white"
        />
        {rowKeys.map((key) => {
          const [row, col] = key.split("-");
          if (removedColumns.has(col)) {
            return null;
          }
          const value = dataMap[key as keyof typeof dataMap];
          const x = xScale(col);
          const yBackground = yScale(row);
          const barHeight = inlineYScale(value);
          const yBar = yBackground + cellHeight - barHeight;
          return (
            <g key={key}>
              <rect
                x={x}
                y={yBackground}
                width={cellWidth}
                height={cellHeight}
                fill={"white"}
              />
              <rect
                x={x}
                y={yBar}
                width={cellWidth}
                height={barHeight}
                fill={"black"}
                stroke="white"
              />
            </g>
          );
        })}
      </g>
    );
  }
  return (
    <g>
      <rect
        x={0}
        y={yScale(row)}
        width={width}
        height={Math.ceil(cellHeight)}
        fill={colors(0)}
      />
      {rowKeys.map((key) => {
        const [row, col] = key.split("-");
        if (removedColumns.has(col)) {
          return null;
        }
        const value = dataMap[key as keyof typeof dataMap];
        return (
          <rect
            key={key}
            x={xScale(col)}
            y={yScale(row)}
            width={Math.ceil(cellWidth)}
            height={Math.ceil(cellHeight)}
            fill={colors(value)}
          />
        );
      })}
    </g>
  );
}

export default function Heatmap() {
  const { width, height } = useHeatmapDimensions();
  const { selectedDimension } = useSelectedDimension();
  const [rows, { setOrderedValues: setRows, setSortOrder: setRowOrder }] =
    useRows();
  const [
    columns,
    { setOrderedValues: setColumns, setSortOrder: setColumnOrder },
  ] = useColumns();

  const { closeTooltip } = useSetTooltipData();

  // Dynamically determine which dimension to use based on the selected dimension
  const { items, setItems, setSort } = useMemo(() => {
    const items = selectedDimension === "X" ? columns : rows;
    const setItems = selectedDimension === "X" ? setColumns : setRows;
    const setSort = selectedDimension === "X" ? setColumnOrder : setRowOrder;
    return { items, setItems, setSort };
  }, [selectedDimension, columns, rows]);

  const { theme } = useCellPopTheme();

  return (
    <DragOverlayContainer items={items} setItems={setItems} setSort={setSort}>
      <svg
        width={width}
        height={height}
        className="heatmap"
        style={{
          outline: `1px solid ${theme.text}`,
        }}
        onMouseOut={closeTooltip}
      >
        {rows.map((row) => (
          <HeatmapRow key={row} row={row} />
        ))}
      </svg>
    </DragOverlayContainer>
  );
}
