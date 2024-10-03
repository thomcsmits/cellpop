import { defaultStyles, TooltipWithBounds } from "@visx/tooltip";
import React, { useEffect } from "react";
import { useParentRef } from "../contexts/ContainerRefContext";
import {
  useSetTooltipData,
  useTooltipData,
} from "../contexts/TooltipDataContext";

/**
 * Component which renders a basic tooltip with the data set in the tooltip data context.
 * @returns
 */
export default function Tooltip() {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltipData();
  const { closeTooltip } = useSetTooltipData();

  const parentRef = useParentRef();
  const visualizationBounds = parentRef.current?.getBoundingClientRect();

  useEffect(() => {
    if (!tooltipData) {
      closeTooltip();
    }
  }, [tooltipData, closeTooltip]);

  if (!tooltipOpen) {
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
