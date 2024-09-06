import { defaultStyles, TooltipWithBounds } from "@visx/tooltip";
import React from "react";
import { useTooltipData } from "../contexts/TooltipDataContext";

export default function Tooltip() {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltipData();

  if (!tooltipOpen || !tooltipData) {
    return null;
  }

  return (
    <TooltipWithBounds
      key={Math.random()}
      top={tooltipTop}
      left={tooltipLeft}
      style={defaultStyles}
    >
      <div>
        <div>{tooltipData.title}</div>
        <div>
          {Object.entries(tooltipData.data).map(([key, value]) => (
            <div key={key}>
              <span>{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </TooltipWithBounds>
  );
}
