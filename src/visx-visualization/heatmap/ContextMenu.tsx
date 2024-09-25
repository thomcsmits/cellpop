import * as ContextMenu from "@radix-ui/react-context-menu";
import React from "react";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useTooltipData } from "../../contexts/TooltipDataContext";
import "./ContextMenu.css";

const HideRow = () => {
  const { tooltipData } = useTooltipData();
  const { label: rowLabel } = useRowConfig();
  const [, { removeValue }] = useRows();

  if (!tooltipData?.data) {
    return null;
  }

  if (tooltipData.data[rowLabel]) {
    const rowValue = tooltipData.data[rowLabel] as string;
    return (
      <ContextMenu.Item
        className="ContextMenuItem"
        onClick={() => removeValue(rowValue)}
      >
        Hide {rowLabel} ({rowValue})
      </ContextMenu.Item>
    );
  }
};

const HideColumn = () => {
  const { tooltipData } = useTooltipData();
  const { label: columnLabel } = useColumnConfig();
  const [, { removeValue }] = useColumns();

  if (!tooltipData?.data) {
    return null;
  }

  if (tooltipData.data[columnLabel]) {
    const columnValue = tooltipData.data[columnLabel] as string;
    return (
      <ContextMenu.Item
        className="ContextMenuItem"
        onClick={() => removeValue(columnValue)}
      >
        Hide {columnLabel} ({columnValue})
      </ContextMenu.Item>
    );
  }
};

const RestoreHiddenRows = () => {
  const [, { removedValues, resetRemovedValues }] = useRows();
  const { label: rowLabel } = useRowConfig();

  if (!removedValues.size) {
    return null;
  }

  return (
    <ContextMenu.Item className="ContextMenuItem" onClick={resetRemovedValues}>
      Restore Hidden {rowLabel}s
    </ContextMenu.Item>
  );
};

const RestoreHiddenColumns = () => {
  const [, { removedValues, resetRemovedValues }] = useColumns();
  const { label: columnLabel } = useColumnConfig();

  if (!removedValues.size) {
    return null;
  }

  return (
    <ContextMenu.Item className="ContextMenuItem" onClick={resetRemovedValues}>
      Restore Hidden {columnLabel}s
    </ContextMenu.Item>
  );
};

const ContextMenuComponent = () => {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content className="ContextMenuContent">
        <HideRow />
        <HideColumn />
        <RestoreHiddenRows />
        <RestoreHiddenColumns />
        <ContextMenu.Item className="ContextMenuItem">
          Reload <div className="RightSlot">⌘+R</div>
        </ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger className="ContextMenuSubTrigger">
            Sort Row
            <div className="RightSlot">{/* <ChevronRightIcon /> */}</div>
          </ContextMenu.SubTrigger>
          <ContextMenu.Portal>
            <ContextMenu.SubContent
              className="ContextMenuSubContent"
              sideOffset={2}
              alignOffset={-5}
            >
              <ContextMenu.Item className="ContextMenuItem">
                Save Page As… <div className="RightSlot">⌘+S</div>
              </ContextMenu.Item>
              <ContextMenu.Item className="ContextMenuItem">
                Create Shortcut…
              </ContextMenu.Item>
              <ContextMenu.Item className="ContextMenuItem">
                Name Window…
              </ContextMenu.Item>
              <ContextMenu.Separator className="ContextMenuSeparator" />
              <ContextMenu.Item className="ContextMenuItem">
                Developer Tools
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Portal>
        </ContextMenu.Sub>
        <ContextMenu.Separator className="ContextMenuSeparator" />
        <ContextMenu.Label className="ContextMenuLabel">
          People
        </ContextMenu.Label>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
};

export default ContextMenuComponent;
