import { useTheme } from "@mui/material/styles";
import React, { useId } from "react";
import { useColorScale } from "../contexts/ScaleContext";

import { RestoreOutlined, UndoRounded } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { useEventCallback } from "@mui/material/utils";

import Button from "@mui/material/Button";

export default function Legend() {
  const { scale: colors, maxValue } = useColorScale();
  const id = useId() + "-legend";

  const minColor = colors(0);
  const maxColor = colors(maxValue);
  const undo = useEventCallback(() => {
    console.warn("Not yet implemented");
  });

  const restoreToDefault = useEventCallback(() => {
    console.warn("Not yet implemented");
  });

  return (
    <Stack height="100%" gap="1rem" paddingX={1}>
      <Stack width="100%">
        <InputLabel id="heatmap-legend-select-label">Counts</InputLabel>
        <Box
          id={id}
          sx={{
            w: "100%",
            display: "flex",
            flexGrow: 1,
            background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
            borderRadius: 4,
          }}
        >
          <Stack
            justifyContent="space-between"
            direction={"row"}
            width="100%"
            px={2}
            py={0.75}
          >
            <Typography variant="body2" style={{ color: maxColor }}>
              0
            </Typography>
            <Typography variant="body2" style={{ color: minColor }}>
              {maxValue}
            </Typography>
          </Stack>
        </Box>
      </Stack>

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
    </Stack>
  );
}
