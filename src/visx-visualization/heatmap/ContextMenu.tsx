import * as ContextMenu from "@radix-ui/react-context-menu";
import React from "react";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useData } from "../../contexts/DataContext";
import { useYScale } from "../../contexts/ScaleContext";
import {
  useSetTooltipData,
  useTooltipData,
} from "../../contexts/TooltipDataContext";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  RightSlot,
} from "./ContextMenu.styles";

const HideRow = () => {
  const { tooltipData } = useTooltipData();
  const { label: rowLabel } = useRowConfig();
  const { removeRow } = useData();

  if (!tooltipData?.data) {
    return null;
  }

  if (tooltipData.data[rowLabel]) {
    const rowValue = tooltipData.data[rowLabel] as string;
    return (
      <ContextMenuItem onClick={() => removeRow(rowValue)}>
        Hide {rowLabel} ({rowValue})
      </ContextMenuItem>
    );
  }
};

const HideColumn = () => {
  const { tooltipData } = useTooltipData();
  const { label: columnLabel } = useColumnConfig();
  const { removeColumn } = useData();

  if (!tooltipData?.data) {
    return null;
  }

  if (tooltipData.data[columnLabel]) {
    const columnValue = tooltipData.data[columnLabel] as string;
    return (
      <ContextMenuItem onClick={() => removeColumn(columnValue)}>
        Hide {columnLabel} ({columnValue})
      </ContextMenuItem>
    );
  }
};

const RestoreHiddenRows = () => {
  const { removedRows, resetRemovedRows } = useData();
  const { label: rowLabel } = useRowConfig();

  if (!removedRows.size) {
    return null;
  }

  return (
    <ContextMenuItem onClick={resetRemovedRows}>
      Restore Hidden {rowLabel}s
    </ContextMenuItem>
  );
};

const RestoreHiddenColumns = () => {
  const { removedColumns, resetRemovedColumns } = useData();
  const { label: columnLabel } = useColumnConfig();

  if (!removedColumns.size) {
    return null;
  }

  return (
    <ContextMenuItem onClick={resetRemovedColumns}>
      Restore Hidden {columnLabel}s
    </ContextMenuItem>
  );
};

const ExpandRow = () => {
  const {
    tooltipData: { data },
  } = useTooltipData();
  const { label } = useRowConfig();
  const { toggleSelection, selectedValues } = useYScale();
  const { closeContextMenu } = useSetTooltipData();

  if (!data[label] || selectedValues.has(data[label] as string)) {
    return null;
  }

  return (
    <ContextMenuItem
      onClick={() => {
        toggleSelection(data[label] as string);
        closeContextMenu();
      }}
    >
      Expand {label}
    </ContextMenuItem>
  );
};

const CollapseRows = () => {
  const { selectedValues, reset } = useYScale();
  if (selectedValues.size === 0) {
    return null;
  }
  return <ContextMenuItem onClick={reset}>Clear Selection</ContextMenuItem>;
};

const MoveToStart = ({ dimension }: { dimension: "row" | "column" }) => {
  const [, { moveToStart: moveRowToStart }] = useRows();
  const [, { moveToStart: moveColumnToStart }] = useColumns();
  const {
    tooltipData: { data },
  } = useTooltipData();
  const { label: rowLabel } = useRowConfig();

  const { label: columnLabel } = useColumnConfig();

  const move = dimension === "row" ? moveRowToStart : moveColumnToStart;
  const label = dimension === "row" ? rowLabel : columnLabel;
  const moveLabel = dimension === "row" ? "Top" : "Left";

  if (!data[label]) {
    return null;
  }

  return (
    <ContextMenuItem onClick={() => move(data[label] as string)}>
      Move to {moveLabel}
    </ContextMenuItem>
  );
};

const MoveToEnd = ({ dimension }: { dimension: "row" | "column" }) => {
  const [, { moveToEnd: moveRowToEnd }] = useRows();
  const [, { moveToEnd: moveColumnToEnd }] = useColumns();
  const {
    tooltipData: { data },
  } = useTooltipData();
  const { label: rowLabel } = useRowConfig();

  const { label: columnLabel } = useColumnConfig();

  const move = dimension === "row" ? moveRowToEnd : moveColumnToEnd;
  const label = dimension === "row" ? rowLabel : columnLabel;
  const moveLabel = dimension === "row" ? "Bottom" : "Right";

  if (!data[label]) {
    return null;
  }

  return (
    <ContextMenuItem onClick={() => move(data[label] as string)}>
      Move to {moveLabel}
    </ContextMenuItem>
  );
};

const SortDimension = ({ dimension }: { dimension: "row" | "column" }) => {
  const [
    ,
    {
      setSortOrder: sortColumns,
      sortOrder: colSortOrder,
      sortOrders: colSortOrders,
    },
  ] = useColumns();
  const [
    ,
    {
      setSortOrder: sortRows,
      sortOrder: rowSortOrder,
      sortOrders: rowSortOrders,
    },
  ] = useRows();

  const sort = dimension === "row" ? sortRows : sortColumns;
  const sortOrders = dimension === "row" ? rowSortOrders : colSortOrders;
  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();
  const label = dimension === "row" ? rowLabel : columnLabel;
  const currentSortOrder = dimension === "row" ? rowSortOrder : colSortOrder;

  return (
    <ContextMenu.Sub>
      <ContextMenuSubTrigger>
        Sort {label}s <RightSlot>&rsaquo;</RightSlot>
      </ContextMenuSubTrigger>
      <ContextMenu.Portal>
        <ContextMenuSubContent sideOffset={2} alignOffset={-5}>
          {sortOrders
            .filter((order) => order !== "Custom")
            .map((order) => (
              <ContextMenuItem key={order} onClick={() => sort(order)}>
                {order
                  .split("_")
                  .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                  .join(" ")}
                {currentSortOrder === order && <RightSlot>✓</RightSlot>}
              </ContextMenuItem>
            ))}
        </ContextMenuSubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
};

const ContextMenuComponent = () => {
  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();

  const { tooltipData, contextMenuOpen } = useTooltipData();
  if (!tooltipData || !contextMenuOpen) {
    return null;
  }

  const hasColumn = Object.keys(tooltipData.data).some((key) =>
    key.includes(columnLabel),
  );

  const hasRow = Object.keys(tooltipData.data).some((key) =>
    key.includes(rowLabel),
  );

  return (
    <ContextMenu.Portal>
      <ContextMenuContent>
        <ContextMenuLabel>Global Actions</ContextMenuLabel>
        <RestoreHiddenRows />
        <SortDimension dimension="row" />
        <RestoreHiddenColumns />
        <SortDimension dimension="column" />
        {hasRow && (
          <>
            <ContextMenuSeparator />
            <ContextMenuLabel>Rows ({rowLabel}s)</ContextMenuLabel>
            <HideRow />
            <MoveToStart dimension="row" />
            <MoveToEnd dimension="row" />
            <ExpandRow />
            <CollapseRows />
          </>
        )}
        {hasColumn && (
          <>
            <ContextMenuSeparator />
            <ContextMenuLabel>Columns ({columnLabel}s)</ContextMenuLabel>
            <HideColumn />
            <MoveToStart dimension="column" />
            <MoveToEnd dimension="column" />
          </>
        )}
      </ContextMenuContent>
    </ContextMenu.Portal>
  );
};

export default ContextMenuComponent;
