import { scaleLinear } from "@visx/scale";
import React, { useMemo } from "react";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
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
  const { scale: yScale, selectedValues, expandedSize } = useYScale();
  const { scale: colors } = useColorScale();
  const cellWidth = xScale.bandwidth();
  // @ts-expect-error - custom y scale provides the appropriate band width for the given row
  // and providing an arg to a regular scale's bandwidth function doesn't throw, so this is fine
  const cellHeight = yScale.bandwidth(row);
  const { removedRows, removedColumns, rowCounts, data } = useData();

  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();
  const { openTooltip } = useSetTooltipData();

  const onMouseOver = (e: React.MouseEvent) => {
    if (!selectedValues) {
      return;
    }
    const target = e.target as SVGRectElement;
    const row = target.getAttribute("data-row");
    const col = target.getAttribute("data-col");
    const value = target.getAttribute("data-val");

    openTooltip(
      {
        title: `${row} - ${col}`,
        data: {
          "Cell Count": value,
          [rowLabel]: row,
          [columnLabel]: col,
        },
      },
      e.clientX,
      e.clientY,
    );
  };

  if (removedRows.has(row) || removedColumns.has(col)) {
    return null;
  }

  const dataProps = {
    "data-row": row,
    "data-col": col,
    "data-val": value,
  };

  if (selectedValues.has(row)) {
    // TODO: Lift this to a context so it doesn't have to recalculated
    const max = Math.max(
      ...data.countsMatrix.filter((d) => d.row === row).map((d) => d.value),
    );
    const inlineYScale = scaleLinear({
      domain: [0, max],
      range: [0, expandedSize],
      nice: true,
    });
    return (
      <rect
        x={xScale(col)}
        y={yScale(row) + expandedSize - inlineYScale(value)}
        width={cellWidth}
        height={inlineYScale(value)}
        fill="black"
        stroke="black"
        onMouseMove={onMouseOver}
        {...dataProps}
      />
    );
  }

  return (
    <rect
      x={xScale(col)}
      y={yScale(row)}
      width={cellWidth}
      height={cellHeight}
      fill={colors(value)}
      onMouseMove={onMouseOver}
      {...dataProps}
    />
  );
}

export default function Heatmap() {
  const { width, height } = useHeatmapDimensions();
  const { selectedDimension } = useSelectedDimension();
  const { data } = useData();
  const { selectedValues } = useYScale();
  const [rows, { setOrderedValues: setRows, setSortOrder: setRowOrder }] =
    useRows();
  const [
    columns,
    { setOrderedValues: setColumns, setSortOrder: setColumnOrder },
  ] = useColumns();

  const { closeTooltip } = useSetTooltipData();

  // Dynamically determine which dimension to use based on the selected dimension
  const { items, setItems, setSort } = useMemo(() => {
    if (selectedValues.size > 0) {
      return { items: [], setItems: () => {}, setSort: () => {} };
    }
    const items = selectedDimension === "X" ? columns : rows;
    const setItems = selectedDimension === "X" ? setColumns : setRows;
    const setSort = selectedDimension === "X" ? setColumnOrder : setRowOrder;
    return { items, setItems, setSort };
  }, [selectedDimension, columns, rows, selectedValues]);

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
