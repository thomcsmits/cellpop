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
    <ContextMenu.Item
      className="ContextMenuItem"
      onClick={() => {
        toggleSelection(data[label] as string);
        closeContextMenu();
      }}
    >
      Expand {label}
    </ContextMenu.Item>
  );
};

const CollapseRows = () => {
  const { selectedValues, reset } = useYScale();
  if (selectedValues.size === 0) {
    return null;
  }
  return (
    <ContextMenu.Item className="ContextMenuItem" onClick={reset}>
      Clear Selection
    </ContextMenu.Item>
  );
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
    <ContextMenu.Item
      className="ContextMenuItem"
      onClick={() => move(data[label] as string)}
    >
      Move to {moveLabel}
    </ContextMenu.Item>
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
    <ContextMenu.Item
      className="ContextMenuItem"
      onClick={() => move(data[label] as string)}
    >
      Move to {moveLabel}
    </ContextMenu.Item>
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
      <ContextMenu.SubTrigger className="ContextMenuSubTrigger">
        Sort {label}s <div className="RightSlot">&rsaquo;</div>
      </ContextMenu.SubTrigger>
      <ContextMenu.Portal>
        <ContextMenu.SubContent
          className="ContextMenuSubContent"
          sideOffset={2}
          alignOffset={-5}
        >
          {sortOrders
            .filter((order) => order !== "Custom")
            .map((order) => (
              <ContextMenu.Item
                key={order}
                className="ContextMenuItem"
                onClick={() => sort(order)}
              >
                {order
                  .split("_")
                  .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
                  .join(" ")}
                {currentSortOrder === order && (
                  <div className="RightSlot">✓</div>
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
      <ContextMenu.Content className="ContextMenuContent">
        <ContextMenu.ContextMenuLabel className="ContextMenuLabel">
          Global Actions
        </ContextMenu.ContextMenuLabel>
        <RestoreHiddenRows />
        <SortDimension dimension="row" />
        <RestoreHiddenColumns />
        <SortDimension dimension="column" />
        {hasRow && (
          <>
            <ContextMenu.Separator className="ContextMenuSeparator" />
            <ContextMenu.ContextMenuLabel className="ContextMenuLabel">
              Rows ({rowLabel}s)
            </ContextMenu.ContextMenuLabel>
            <HideRow />
            <MoveToStart dimension="row" />
            <MoveToEnd dimension="row" />
            <ExpandRow />
            <CollapseRows />
            {hasColumn && (
              <ContextMenu.Separator className="ContextMenuSeparator" />
            )}
          </>
        )}
        {hasColumn && (
          <>
            <ContextMenu.ContextMenuLabel className="ContextMenuLabel">
              Columns ({columnLabel}s)
            </ContextMenu.ContextMenuLabel>
            <HideColumn />
            <MoveToStart dimension="column" />
            <MoveToEnd dimension="column" />
          </>
        )}
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
};

export default ContextMenuComponent;
