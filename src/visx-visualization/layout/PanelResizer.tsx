import React, { MouseEventHandler, useCallback, useRef } from "react";

import { useParentRef } from "../../contexts/ContainerRefContext";
import { useDimensions } from "../../contexts/DimensionsContext";

interface VisualizationPanelResizerProps {
  index: number;
  resize: (newSize: number, index: number) => void;
  orientation: "X" | "Y";
}

export default function VisualizationPanelResizer({
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
        [positionKey]: `${position - 5}px`,
      }}
    />
  );
}
