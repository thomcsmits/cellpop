import React, { useId, useRef } from "react";

import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useDimensions } from "../../contexts/DimensionsContext";
import Tooltip from "../Tooltip";

import { ParentRefProvider } from "../../contexts/ContainerRefContext";

import { Root as ContextMenuRoot, Trigger } from "@radix-ui/react-context-menu";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import "../../visualization/style.css";
import ContextMenuComponent from "../heatmap/ContextMenu";
import BottomCenterPanel from "./BottomCenter";
import BottomLeftPanel from "./BottomLeft";
import BottomRightPanel from "./BottomRight";
import MiddleCenterPanel from "./MiddleCenter";
import MiddleLeftPanel from "./MiddleLeft";
import MiddleRightPanel from "./MiddleRight";
import VisualizationPanelResizer from "./PanelResizer";
import TopCenterPanel from "./TopCenter";
import TopLeftPanel from "./TopLeft";
import TopRightPanel from "./TopRight";

export default function VizContainerGrid() {
  const { width, height, rowSizes, columnSizes, resizeColumn, resizeRow } =
    useDimensions();

  const {
    theme: { background },
  } = useCellPopTheme();

  const parentRef = useRef<HTMLDivElement>(null);

  const gridTemplateColumns = columnSizes.map((size) => `${size}px`).join(" ");
  const gridTemplateRows = rowSizes.map((size) => `${size}px`).join(" ");

  const id = useId();

  const { openContextMenu, closeContextMenu } = useSetTooltipData();

  return (
    <ParentRefProvider value={parentRef}>
      <ContextMenuRoot
        onOpenChange={(open) => (open ? openContextMenu() : closeContextMenu())}
      >
        <Trigger asChild>
          <div
            style={{ position: "relative" }}
            ref={parentRef}
            id={`${id}-main-container`}
          >
            <div
              style={{
                width,
                height,
                display: "grid",
                gridTemplateColumns,
                gridTemplateRows,
                background,
              }}
            >
              <TopLeftPanel id={`${id}-top-left`} />
              <TopCenterPanel id={`${id}-top-center`} />
              <TopRightPanel id={`${id}-top-right`} />
              <MiddleLeftPanel id={`${id}-middle-left`} />
              <MiddleCenterPanel id={`${id}-middle-center`} />
              <MiddleRightPanel id={`${id}-middle-right`} />
              <BottomLeftPanel id={`${id}-bottom-left`} />
              <BottomCenterPanel id={`${id}-bottom-center`} />
              <BottomRightPanel id={`${id}-bottom-right`} />
            </div>
            <VisualizationPanelResizer
              index={0}
              resize={resizeColumn}
              orientation="X"
            />
            <VisualizationPanelResizer
              index={1}
              resize={resizeColumn}
              orientation="X"
            />
            <VisualizationPanelResizer
              index={0}
              resize={resizeRow}
              orientation="Y"
            />
            <VisualizationPanelResizer
              index={1}
              resize={resizeRow}
              orientation="Y"
            />
            <Tooltip />
          </div>
        </Trigger>
        <ContextMenuComponent />
      </ContextMenuRoot>
    </ParentRefProvider>
  );
}
