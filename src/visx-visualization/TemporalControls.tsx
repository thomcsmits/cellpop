import React from "react";

import { RestoreOutlined, UndoRounded } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { useEventCallback } from "@mui/material/utils";

import Button from "@mui/material/Button";
import { useThemeHistory } from "../contexts/CellPopThemeContext";
import { useFractionHistory } from "../contexts/FractionContext";
import { useSelectedDimensionHistory } from "../contexts/SelectedDimensionContext";

export function TemporalControls() {
  const themeHistory = useThemeHistory();
  const selectedDimensionHistory = useSelectedDimensionHistory();
  const fractionHistory = useFractionHistory();

  const undo = useEventCallback(() => {
    themeHistory.undo();
    selectedDimensionHistory.undo();
    fractionHistory.undo();
  });

  const restoreToDefault = useEventCallback(() => {
    themeHistory.undo(themeHistory.pastStates.length);
    selectedDimensionHistory.undo(selectedDimensionHistory.pastStates.length);
    fractionHistory.undo(fractionHistory.pastStates.length);
  });
  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="outlined"
        onClick={restoreToDefault}
        endIcon={<RestoreOutlined />}
      >
        Restore to Default
      </Button>
      <Button
        onClick={undo}
        aria-label="Undo"
        variant="outlined"
        component={IconButton}
        sx={{
          minWidth: 0,
          padding: 0.5,
          aspectRatio: "1/1",
        }}
      >
        <UndoRounded />
      </Button>
    </Stack>
  );
}
