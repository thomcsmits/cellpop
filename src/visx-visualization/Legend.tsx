import React, { useId } from "react";
import { useColorScale } from "../contexts/ColorScaleContext";

import { Box, Stack, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

import {
  useIsNormalized,
  useNormalization,
} from "../contexts/NormalizationContext";
import { PlotControlsButton } from "./plot-controls.tsx/PlotControls";
import { TemporalControls } from "./TemporalControls";

export default function Legend() {
  const { scale: colors, maxValue } = useColorScale();
  const id = useId() + "-legend";

  const minColor = colors(0);
  const legendColors = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(
    (value) => [colors(value * maxValue), `${value * 100}%`],
  );
  const maxColor = colors(maxValue);
  const isNormalized = useIsNormalized();
  const normalization = useNormalization((state) => state.normalization);

  const legendLabel = isNormalized
    ? `Percent of all cells in ${normalization}`
    : "Counts";
  const minValueLabel = isNormalized ? "0%" : "0";
  const maxValueLabel = isNormalized ? "100%" : maxValue;

  return (
    <Stack height="100%" gap="1rem" paddingX={1}>
      <Stack width="100%">
        <InputLabel id="heatmap-legend-label">{legendLabel}</InputLabel>
        <Box
          id={id}
          data-testId="heatmap-legend"
          sx={{
            width: "100%",
            display: "flex",
            flexGrow: 1,
            background: `linear-gradient(to right, ${legendColors.map(([c, position]) => `${c} ${position}`).join(", ")})`,
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
              {minValueLabel}
            </Typography>
            <Typography variant="body2" style={{ color: minColor }}>
              {maxValueLabel}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Stack direction="row" gap={2} flexWrap="wrap">
        <PlotControlsButton />
        <TemporalControls />
      </Stack>
    </Stack>
  );
}
