import * as ContextMenu from "@radix-ui/react-context-menu";
import React from "react";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useData } from "../../contexts/DataContext";
import { useTooltipData } from "../../contexts/TooltipDataContext";
import { SORT_ORDERS } from "../../hooks/useOrderedArray";
import "./ContextMenu.css";

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
      <ContextMenu.Item
        className="ContextMenuItem"
        onClick={() => removeRow(rowValue)}
      >
        Hide {rowLabel} ({rowValue})
      </ContextMenu.Item>
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
      <ContextMenu.Item
        className="ContextMenuItem"
        onClick={() => removeColumn(columnValue)}
      >
        Hide {columnLabel} ({columnValue})
      </ContextMenu.Item>
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
    <ContextMenu.Item className="ContextMenuItem" onClick={resetRemovedRows}>
      Restore Hidden {rowLabel}s
    </ContextMenu.Item>
  );
};

const RestoreHiddenColumns = () => {
  const { removedColumns, resetRemovedColumns } = useData();
  const { label: columnLabel } = useColumnConfig();

  if (!removedColumns.size) {
    return null;
  }

  return (
    <ContextMenu.Item className="ContextMenuItem" onClick={resetRemovedColumns}>
      Restore Hidden {columnLabel}s
    </ContextMenu.Item>
  );
};

const MoveToStart = ({ dimension }: { dimension: "row" | "column" }) => {
  // The visual "start" of the rows and columns is at the top and left, respectively.
  const [, { moveToEnd: moveRowToStart }] = useRows();
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
    <ContextMenu.Item
      className="ContextMenuItem"
      onClick={() => move(data[label] as string)}
    >
      Move to {moveLabel}
    </ContextMenu.Item>
  );
};

const MoveToEnd = ({ dimension }: { dimension: "row" | "column" }) => {
  const [, { moveToStart: moveRowToEnd }] = useRows();
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
    <ContextMenu.Item
      className="ContextMenuItem"
      onClick={() => move(data[label] as string)}
    >
      Move to {moveLabel}
    </ContextMenu.Item>
  );
};

const SortDimension = ({ dimension }: { dimension: "row" | "column" }) => {
  const [, { setSortOrder: sortColumns, sortOrder: colSortOrder }] =
    useColumns();
  const [, { setSortOrder: sortRows, sortOrder: rowSortOrder }] = useRows();

  const sort = dimension === "row" ? sortRows : sortColumns;
  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();
  const label = dimension === "row" ? rowLabel : columnLabel;
  const currentSortOrder = dimension === "row" ? rowSortOrder : colSortOrder;

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger className="ContextMenuSubTrigger">
        Sort {label}s <div className="RightSlot">➤</div>
      </ContextMenu.SubTrigger>
      <ContextMenu.Portal>
        <ContextMenu.SubContent
          className="ContextMenuSubContent"
          sideOffset={2}
          alignOffset={-5}
        >
          {SORT_ORDERS.filter((order) => order !== "Custom").map((order) => (
            <ContextMenu.Item
              key={order}
              className="ContextMenuItem"
              onClick={() => sort(order)}
            >
              {order}
              {currentSortOrder === order ? (
                <div className="RightSlot">✓</div>
              ) : (
                ""
              )}
            </ContextMenu.Item>
          ))}
        </ContextMenu.SubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  );
};

const ContextMenuComponent = () => {
  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();

  const { tooltipData } = useTooltipData();
  if (!tooltipData) {
    return null;
  }

  return (
    <ContextMenu.Portal>
      <ContextMenu.Content className="ContextMenuContent">
        <ContextMenu.ContextMenuLabel className="ContextMenuLabel">
          Rows ({rowLabel}s)
        </ContextMenu.ContextMenuLabel>
        <HideRow />
        <RestoreHiddenRows />
        <SortDimension dimension="row" />
        <MoveToStart dimension="row" />
        <MoveToEnd dimension="row" />
        <ContextMenu.Separator className="ContextMenuSeparator" />
        <ContextMenu.ContextMenuLabel className="ContextMenuLabel">
          Columns ({columnLabel}s)
        </ContextMenu.ContextMenuLabel>
        <HideColumn />
        <RestoreHiddenColumns />
        <SortDimension dimension="column" />
        <MoveToStart dimension="column" />
        <MoveToEnd dimension="column" />
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
};

export default ContextMenuComponent;
