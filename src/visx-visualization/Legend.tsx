import { useTheme } from "@mui/material/styles";
import React, { useId } from "react";
import {
  HEATMAP_THEMES,
  HeatmapTheme,
  useColorScale,
} from "../contexts/ScaleContext";

import { Box, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEventCallback } from "@mui/material/utils";

export default function Legend() {
  const {
    scale: colors,
    maxValue,
    setHeatmapTheme,
    heatmapTheme,
  } = useColorScale();
  const theme = useTheme();
  const id = useId() + "-legend";

  const minColor = colors(0);
  const maxColor = colors(maxValue);

  const handleThemeChange = useEventCallback((e: SelectChangeEvent) => {
    setHeatmapTheme(e.target.value as HeatmapTheme);
  });

  return (
    <Stack
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height="100%"
      gap="1rem"
      paddingX="1.5rem"
    >
      <Stack width="100%">
        <InputLabel id="heatmap-legend-select-label">Counts</InputLabel>
        <Box
          id={id}
          sx={{
            w: "100%",
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
            borderRadius: 0.5,
            p: 0.5,
            outline: `1px solid ${theme.palette.text.primary}`,
          }}
        >
          <div style={{ color: maxColor }}>0</div>
          <div style={{ color: minColor }}>{maxValue} </div>
        </Box>
      </Stack>
      <FormControl variant="standard" fullWidth>
        <InputLabel id="heatmap-theme-select-label">Heatmap Theme</InputLabel>
        <Select
          labelId="heatmap-theme-select-label"
          id="heatmap-theme-select"
          value={heatmapTheme}
          onChange={handleThemeChange}
        >
          {HEATMAP_THEMES.map((theme) => (
            <MenuItem key={theme} value={theme}>
              {theme}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
