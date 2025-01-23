import React, { ChangeEvent } from "react";
import { useColorScale } from "../contexts/ColorScaleContext";
import { HEATMAP_THEMES_LIST, HeatmapTheme } from "../utils/heatmap-themes";

import { AppBar, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEventCallback } from "@mui/material/utils";

import { useSetTheme } from "../contexts/CellPopThemeContext";
import {
  useFractionControlIsDisabled,
  useNormalizationControlIsDisabled,
  useThemeControlIsDisabled,
} from "../contexts/DisabledControlProvider";
import { useFraction } from "../contexts/FractionContext";
import {
  NORMALIZATIONS,
  useNormalization,
} from "../contexts/NormalizationContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";
import LabelledSwitch from "./LabelledSwitch";

function HeatmapThemeControl() {
  const { setHeatmapTheme, heatmapTheme } = useColorScale();

  const handleThemeChange = useEventCallback((e: SelectChangeEvent) => {
    setHeatmapTheme(e.target.value as HeatmapTheme);
  });
  return (
    <FormControl sx={{ maxWidth: 300 }}>
      <InputLabel id="heatmap-theme-select-label">Heatmap Themes</InputLabel>
      <Select
        labelId="heatmap-theme-select-label"
        id="heatmap-theme-select"
        value={heatmapTheme}
        onChange={handleThemeChange}
        variant="outlined"
        label="Heatmap Themes"
        sx={{ textTransform: "capitalize", minWidth: 200 }}
      >
        {HEATMAP_THEMES_LIST.map((theme) => (
          <MenuItem
            key={theme}
            value={theme}
            sx={{ textTransform: "capitalize" }}
          >
            {theme}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function ThemeControl() {
  const themeIsDisabled = useThemeControlIsDisabled();

  const { currentTheme, setTheme } = useSetTheme();

  const changeVisTheme = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newTheme = e.target.checked ? "dark" : "light";
      setTheme(newTheme);
    },
  );
  if (themeIsDisabled) {
    return null;
  }

  return (
    <LabelledSwitch
      label="Theme"
      leftLabel="Light"
      rightLabel="Dark"
      onChange={changeVisTheme}
      checked={currentTheme === "dark"}
    />
  );
}

function FractionControl() {
  const { fraction, setFraction } = useFraction();
  const changeFraction = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newFraction = Boolean(event.target.checked);
      setFraction(newFraction);
    },
  );
  const fractionIsDisabled = useFractionControlIsDisabled();
  if (fractionIsDisabled) {
    return null;
  }

  return (
    <LabelledSwitch
      label="Graph Type"
      leftLabel="Count"
      rightLabel="Fraction"
      onChange={changeFraction}
      checked={fraction}
    />
  );
}

function SelectedDimensionControl() {
  const selectedDimensionIsDisabled = useFractionControlIsDisabled();
  const { selectedDimension, setSelectedDimension } = useSelectedDimension();

  const changeSelectedDimension = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newSelectedDimension = event.target.checked ? "X" : "Y";
      setSelectedDimension(newSelectedDimension);
    },
  );

  if (selectedDimensionIsDisabled) {
    return null;
  }

  return (
    <LabelledSwitch
      label="Selection Tool"
      leftLabel="Row"
      rightLabel="Column"
      onChange={changeSelectedDimension}
      checked={selectedDimension === "X"}
    />
  );
}

function NormalizationControl() {
  const normalizationIsDisabled = useNormalizationControlIsDisabled();
  const { normalization, setNormalization } = useNormalization();
  const changeNormalization = useEventCallback((event: SelectChangeEvent) => {
    setNormalization(event.target.value as (typeof NORMALIZATIONS)[number]);
  });
  if (normalizationIsDisabled) {
    return null;
  }

  return (
    <FormControl sx={{ maxWidth: 300 }}>
      <InputLabel id="heatmap-normalization-select-label">
        Heatmap Normalization
      </InputLabel>
      <Select
        labelId="heatmap-normalization-select-label"
        id="heatmap-normalization-select"
        value={normalization}
        onChange={changeNormalization}
        variant="outlined"
        label="Heatmap Themes"
        sx={{ textTransform: "capitalize", minWidth: 200 }}
      >
        {NORMALIZATIONS.map((normalization) => (
          <MenuItem
            key={normalization}
            value={normalization}
            sx={{ textTransform: "capitalize" }}
          >
            {normalization}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function Controls() {
  const currentTheme = useSetTheme((state) => state.currentTheme);
  return (
    <AppBar
      position="static"
      elevation={0}
      color={currentTheme === "dark" ? "default" : "default"}
    >
      <Stack direction="row" spacing={5} p={1}>
        <HeatmapThemeControl />
        <NormalizationControl />
        <FractionControl />
        <SelectedDimensionControl />
        <ThemeControl />
      </Stack>
    </AppBar>
  );
}
