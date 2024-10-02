import { defaultStyles, TooltipWithBounds } from "@visx/tooltip";
import React from "react";
import { useParentRef } from "../contexts/ContainerRefContext";
import { useTooltipData } from "../contexts/TooltipDataContext";

/**
 * Component which renders a basic tooltip with the data set in the tooltip data context.
 * @returns
 */
export default function Tooltip() {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltipData();

  const parentRef = useParentRef();
  const visualizationBounds = parentRef.current?.getBoundingClientRect();

  if (!tooltipOpen || !tooltipData) {
    return null;
  }

  return (
    <TooltipWithBounds
      top={tooltipTop - visualizationBounds?.top}
      left={tooltipLeft - visualizationBounds?.left}
      style={{ ...defaultStyles, pointerEvents: "none", zIndex: 1000 }}
    >
      <div>
        <strong>{tooltipData.title}</strong>
        <div>
          {Object.entries(tooltipData.data).map(([key, value]) => (
            <div key={key}>
              <span style={{ textTransform: "capitalize" }}>{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </TooltipWithBounds>
  );
}
