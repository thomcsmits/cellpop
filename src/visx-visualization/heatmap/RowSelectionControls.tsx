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
  return (
    <>
      {rows.map((row) => (
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
              width: Math.floor(scale.bandwidth()),
              height: Math.floor(scale.bandwidth()),
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
