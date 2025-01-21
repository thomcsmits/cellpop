import { Tooltip } from "@mui/material";
import React from "react";
import { useRows } from "../../contexts/DataContext";
import { useSelectedValues } from "../../contexts/ExpandedValuesContext";
import { useYScale } from "../../contexts/ScaleContext";

export default function RowSelectionControls() {
  const rows = useRows();
  const { scale } = useYScale();
  const selectedValues = useSelectedValues((s) => s.selectedValues);
  const toggleSelection = useSelectedValues((s) => s.toggleValue);
  const smallScale = scale.bandwidth() < 10;
  const rowsToRender = smallScale ? [...selectedValues] : rows;
  return (
    <>
      {rowsToRender.map((row) => (
        <Tooltip
          title={`Toggle ${row}`}
          key={row}
          // to keep the tooltip from blocking the checkbox
          slotProps={{
            popper: { style: { pointerEvents: "none" } },
            tooltip: { style: { pointerEvents: "none" } },
          }}
        >
          <input
            type="checkbox"
            checked={selectedValues.has(row)}
            onChange={() => toggleSelection(row)}
            style={{
              width: Math.max(Math.floor(scale.bandwidth()), 16),
              height: Math.max(Math.floor(scale.bandwidth()), 16),
              left: 0,
              top: scale(row),
              position: "absolute",
            }}
          />
        </Tooltip>
      ))}
    </>
  );
}
