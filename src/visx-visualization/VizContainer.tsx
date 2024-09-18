import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useRef,
} from "react";

import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { createContext, useContext } from "../utils/context";
import Heatmap from "./Heatmap";
import HeatmapXAxis from "./HeatmapXAxis";
import HeatmapYAxis from "./HeatmapYAxis";
import LeftGraph, { LeftGraphScale } from "./LeftGraph";
import Legend from "./Legend";
import Tooltip from "./Tooltip";
import TopGraph, { TopGraphScale } from "./TopGraph";

interface VisualizationPanelResizerProps {
  index: number;
  resize: (newSize: number, index: number) => void;
  orientation: "X" | "Y";
}

function VisualizationPanelResizer({
  index,
  resize,
  orientation,
}: VisualizationPanelResizerProps) {
  const parentRef = useParentRef();
  const { rowSizes, columnSizes } = useDimensions();
  const ref = useRef<HTMLDivElement>(null);
  const positionKey = orientation === "X" ? "left" : "top";
  const positionValues = orientation === "X" ? columnSizes : rowSizes;
  const position = positionValues
    .slice(0, index + 1)
    .reduce((acc, size) => acc + size, 0);

  const onMouseDown: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      const onMouseMove = (e: MouseEvent) => {
        const visualizationBounds = parentRef.current?.getBoundingClientRect();
        if (!visualizationBounds) {
          return;
        }
        const newSize =
          orientation === "X"
            ? e.clientX - visualizationBounds.left
            : e.clientY - visualizationBounds.top;
        resize(newSize, index);
      };
      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        ref.current?.classList.remove("active");
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      ref.current?.classList.add("active");
    },
    [orientation],
  );

  return (
    <div
      ref={ref}
      className={`resize-handle resize-${orientation.toLowerCase()}`}
      data-orientation={orientation}
      onMouseDown={onMouseDown}
      style={{
        // Offset by 5px to align the handle with the edge of the panel
        [positionKey]: `calc(${position - 5}px)`,
      }}
    />
  );
}

interface VisualizationPanelProps extends PropsWithChildren {
  id: string;
}
function VisualizationPanel({ children, id }: VisualizationPanelProps) {
  return (
    <div
      id={id}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {children}
    </div>
  );
}

const ParentRefContext = createContext<React.RefObject<HTMLDivElement> | null>(
  "Visualization Container Context",
);

export function useParentRef() {
  return useContext(ParentRefContext);
}

export default function VizContainerGrid() {
  const { width, height, rowSizes, columnSizes, resizeColumn, resizeRow } =
    useDimensions();

  const {
    theme: { background },
  } = useCellPopTheme();

  const parentRef = useRef<HTMLDivElement>(null);

  const gridTemplateColumns = columnSizes.map((size) => `${size}px`).join(" ");
  const gridTemplateRows = rowSizes.map((size) => `${size}px`).join(" ");

  return (
    <ParentRefContext.Provider value={parentRef}>
      <div style={{ position: "relative" }} ref={parentRef}>
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
          <VisualizationPanel id="top-left">
            <Legend />
          </VisualizationPanel>
          <VisualizationPanel id="top-center">
            <TopGraph />
          </VisualizationPanel>
          <VisualizationPanel id="top-right">
            <TopGraphScale />
          </VisualizationPanel>
          <VisualizationPanel id="middle-left">
            <LeftGraph />
          </VisualizationPanel>
          <VisualizationPanel id="middle-center">
            <Heatmap />
          </VisualizationPanel>
          <VisualizationPanel id="middle-right">
            <HeatmapYAxis />
          </VisualizationPanel>
          <VisualizationPanel id="bottom-left">
            <LeftGraphScale />
          </VisualizationPanel>
          <VisualizationPanel id="bottom-center">
            <HeatmapXAxis />
          </VisualizationPanel>
          <VisualizationPanel id="bottom-right"></VisualizationPanel>
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
    </ParentRefContext.Provider>
  );
}
