import React, { useId } from "react";
import { useColorScale } from "../contexts/ScaleContext";

import { Box, Stack, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

import { TemporalControls } from "./TemporalControls";

export default function Legend() {
  const { scale: colors, maxValue } = useColorScale();
  const id = useId() + "-legend";

  const minColor = colors(0);
  const maxColor = colors(maxValue);

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
      <TemporalControls />
    </Stack>
  );
}
