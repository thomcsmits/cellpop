import { scaleLinear } from "@visx/scale";
import React from "react";

import { useTheme } from "@mui/material/styles";
import { useColorScale } from "../../contexts/ColorScaleContext";
import {
  useColumns,
  useData,
  useDataMap,
  useRowMaxes,
  useRows,
} from "../../contexts/DataContext";
import { useHeatmapDimensions } from "../../contexts/DimensionsContext";
import { useSelectedValues } from "../../contexts/ExpandedValuesContext";
import { useNormalization } from "../../contexts/NormalizationContext";
import { useXScale, useYScale } from "../../contexts/ScaleContext";
import { useSelectedDimension } from "../../contexts/SelectedDimensionContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import DragOverlayContainer from "./DragOverlay";

function HeatmapRow({ row }: { row: string }) {
  const { width } = useHeatmapDimensions();
  const { scale: xScale } = useXScale();
  const { scale: yScale } = useYScale();
  const selectedValues = useSelectedValues((s) => s.selectedValues);
  const normalization = useNormalization((s) => s.normalization);
  const { scale: globalScale, rowScales, columnScales } = useColorScale();
  const cellWidth = Math.ceil(xScale.bandwidth());
  const cellHeight = Math.ceil(yScale.bandwidth(row));
  const { removedRows, removedColumns } = useData();
  const dataMap = useDataMap();
  const rowMaxes = useRowMaxes();
  const columns = useColumns();

  const theme = useTheme();
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
          fill={theme.palette.background.default}
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
                fill={theme.palette.background.default}
              />
              <rect
                x={x}
                y={yBar}
                width={cellWidth}
                height={barHeight}
                fill={theme.palette.text.primary}
                stroke={theme.palette.background.default}
              />
            </g>
          );
        })}
        <line
          // x axis line for the embedded bar graph
          x1={0}
          x2={width}
          y1={yScale(row) + cellHeight}
          y2={yScale(row) + cellHeight}
          stroke={theme.palette.text.primary}
        />
      </g>
    );
  }
  return (
    <g>
      {rowKeys.map((key) => {
        const [row, col] = key.split("-");
        const colors =
          normalization === "Row"
            ? rowScales[row]
            : normalization === "Column"
              ? columnScales[col]
              : globalScale;
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
            stroke={colors(colors.domain()[1] / 2)}
            strokeOpacity={0.5}
          />
        );
      })}
    </g>
  );
}

export default function Heatmap() {
  const { width, height } = useHeatmapDimensions();
  const { selectedDimension } = useSelectedDimension();
  const rows = useRows();
  const columns = useColumns();

  const items = selectedDimension === "X" ? columns : rows;

  const { setItems, resetSort } = useData((store) => ({
    setItems:
      selectedDimension === "X" ? store.setColumnOrder : store.setRowOrder,
    resetSort:
      selectedDimension === "X"
        ? store.clearColumnSortOrder
        : store.clearRowSortOrder,
  }));

  const { closeTooltip } = useSetTooltipData();

  const theme = useTheme();

  return (
    <DragOverlayContainer
      items={items}
      setItems={setItems}
      resetSort={resetSort}
    >
      <svg
        width={width}
        height={height}
        className="heatmap"
        style={{
          outline: `1px solid ${theme.palette.text.primary}`,
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
