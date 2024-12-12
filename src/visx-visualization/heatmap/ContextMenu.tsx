import { useEventCallback } from "@mui/material";
import * as ContextMenu from "@radix-ui/react-context-menu";
import React from "react";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import {
  useColumnSorts,
  useData,
  useMoveColumnToEnd,
  useMoveColumnToStart,
  useMoveRowToEnd,
  useMoveRowToStart,
  useRowSorts,
} from "../../contexts/DataContext";
import { useSelectedValues } from "../../contexts/ExpandedValuesContext";
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
  const rowLabel = useRowConfig((store) => store.label);
  const { removeRow } = useData();
  const { deselectValue, selectedValues } = useSelectedValues();

  const onClick = useEventCallback(() => {
    const rowValue = tooltipData.data[rowLabel] as string;
    if (selectedValues.has(tooltipData.data[rowLabel] as string)) {
      deselectValue(tooltipData.data[rowLabel] as string);
    }
    removeRow(rowValue);
  });

  if (!tooltipData?.data) {
    return null;
  }

  if (tooltipData.data[rowLabel]) {
    const rowValue = tooltipData.data[rowLabel] as string;
    return (
      <ContextMenuItem onClick={onClick}>
        Hide {rowLabel} ({rowValue})
      </ContextMenuItem>
    );
  }
};

const HideColumn = () => {
  const { tooltipData } = useTooltipData();
  const columnLabel = useColumnConfig((store) => store.label);
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
  const rowLabel = useRowConfig((store) => store.label);

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
  const columnLabel = useColumnConfig((store) => store.label);

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
  const label = useRowConfig((store) => store.label);
  const expandRow = useSelectedValues((s) => s.toggleValue);
  const expandedRows = useSelectedValues((s) => s.selectedValues);
  const { closeContextMenu } = useSetTooltipData();

  if (!data[label] || expandedRows.has(data[label] as string)) {
    return null;
  }

  return (
    <ContextMenuItem
      onClick={() => {
        expandRow(data[label] as string);
        closeContextMenu();
      }}
    >
      Expand {label}
    </ContextMenuItem>
  );
};

const CollapseRows = () => {
  const expandedRows = useSelectedValues((s) => s.selectedValues);
  const reset = useSelectedValues((s) => s.reset);
  if (expandedRows.size === 0) {
    return null;
  }
  return <ContextMenuItem onClick={reset}>Clear Selection</ContextMenuItem>;
};

const MoveToStart = ({ dimension }: { dimension: "row" | "column" }) => {
  const moveRowToStart = useMoveRowToStart();
  const moveColumnToStart = useMoveColumnToStart();
  const {
    tooltipData: { data },
  } = useTooltipData();

  const rowLabel = useRowConfig((store) => store.label);
  const columnLabel = useColumnConfig((store) => store.label);

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
  const moveRowToEnd = useMoveRowToEnd();
  const moveColumnToEnd = useMoveColumnToEnd();

  const {
    tooltipData: { data },
  } = useTooltipData();
  const rowLabel = useRowConfig((store) => store.label);

  const columnLabel = useColumnConfig((store) => store.label);

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
  const { sortColumns, sortRows, colSortOrder, rowSortOrder } = useData((s) => {
    return {
      sortColumns: s.setColumnSortOrder,
      sortRows: s.setRowSortOrder,
      colSortOrder: s.columnSortOrder,
      rowSortOrder: s.rowSortOrder,
    };
  });
  const rowSortOrders = useRowSorts();
  const colSortOrders = useColumnSorts();

  const sort = dimension === "row" ? sortRows : sortColumns;
  const sortOrders = dimension === "row" ? rowSortOrders : colSortOrders;
  const { label: rowLabel } = useRowConfig();
  const columnLabel = useColumnConfig((store) => store.label);
  const label = dimension === "row" ? rowLabel : columnLabel;
  const currentSortOrder = dimension === "row" ? rowSortOrder : colSortOrder;

  return (
    <ContextMenu.Sub>
      <ContextMenuSubTrigger>
        Sort {label}s <RightSlot>&rsaquo;</RightSlot>
      </ContextMenuSubTrigger>
      <ContextMenu.Portal>
        <ContextMenuSubContent sideOffset={2} alignOffset={-5}>
          {sortOrders.map((order) => (
            <ContextMenuItem
              key={order.key + order.direction}
              onClick={() => sort([order])}
            >
              {order.key.charAt(0).toUpperCase()}
              {order.key.slice(1).replace("_", " ")}{" "}
              {order.direction === "asc" ? "Ascending" : "Descending"}
              {currentSortOrder.includes(order) && <RightSlot>✓</RightSlot>}
            </ContextMenuItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
};

const ContextMenuComponent = () => {
  const { label: rowLabel } = useRowConfig();
  const columnLabel = useColumnConfig((store) => store.label);

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
