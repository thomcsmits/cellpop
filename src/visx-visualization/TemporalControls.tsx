import React from "react";

import { RestoreOutlined, UndoRounded } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { useEventCallback } from "@mui/material/utils";

import Button from "@mui/material/Button";

export function TemporalControls() {
  const undo = useEventCallback(() => {
    console.warn("Not yet implemented");
  });

  const restoreToDefault = useEventCallback(() => {
    console.warn("Not yet implemented");
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
