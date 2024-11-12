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

import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useSetTheme } from "../contexts/CellPopThemeContext";
import { useFraction } from "../contexts/FractionContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";

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

  const { currentThemeName: currentTheme, setTheme } = useSetTheme();
  const { fraction, setFraction } = useFraction();
  const { selectedDimension, setSelectedDimension } = useSelectedDimension();

  const undo = useEventCallback(() => {
    console.warn("Not yet implemented");
  });
  const changeTheme = useEventCallback(
    (_: unknown, newTheme: "dark" | "light") => {
      if (newTheme) {
        setTheme(newTheme);
      }
    },
  );

  const changeFraction = useEventCallback(
    (_: unknown, newFraction: boolean) => {
      if (newFraction !== null) {
        setFraction(newFraction);
      }
    },
  );

  const changeSelectedDimension = useEventCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setSelectedDimension(
        (event.target as HTMLInputElement).value as "X" | "Y",
      );
    },
  );

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
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={undo}>
          Undo
        </Button>
        <ToggleButtonGroup
          color="primary"
          value={selectedDimension}
          exclusive
          onChange={changeSelectedDimension}
          aria-label="Axis"
        >
          <ToggleButton value="X">X</ToggleButton>
          <ToggleButton value="Y">Y</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={2}>
        <ToggleButtonGroup
          color="primary"
          value={fraction}
          exclusive
          onChange={changeFraction}
          aria-label="Fraction"
        >
          <ToggleButton value={false}>Count</ToggleButton>
          <ToggleButton value={true}>Fraction</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="primary"
          value={currentTheme}
          exclusive
          onChange={changeTheme}
          aria-label="Theme"
        >
          <ToggleButton value="light">Light</ToggleButton>
          <ToggleButton value="dark">Dark</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
