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

function HeatmapCell({
  row,
  col,
  value,
}: {
  row: string;
  col: string;
  value: number;
}) {
  const { scale: xScale } = useXScale();
  const { scale: yScale } = useYScale();
  const { scale: colors } = useColorScale();
  const cellWidth = xScale.bandwidth();
  const cellHeight = yScale.bandwidth();
  const { removedRows, removedColumns } = useData();

  if (removedRows.has(row) || removedColumns.has(col)) {
    return null;
  }

  return (
    <rect
      x={xScale(col)}
      y={yScale(row)}
      width={cellWidth}
      height={cellHeight}
      fill={colors(value)}
    />
  );
}

export default function Heatmap() {
  const { width, height } = useHeatmapDimensions();
  const { selectedDimension } = useSelectedDimension();
  const { data } = useData();
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
        style={{ outline: `1px solid ${theme.text}` }}
        onMouseOut={closeTooltip}
      >
        {data.countsMatrix.map((cell) => (
          <HeatmapCell {...cell} key={`${cell.row}-${cell.col}`} />
        ))}
      </svg>
    </DragOverlayContainer>
  );
}
