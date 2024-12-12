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
  useThemeControlIsDisabled,
} from "../contexts/DisabledControlProvider";
import { useFraction } from "../contexts/FractionContext";
import {
  NORMALIZATIONS,
  useNormalization,
} from "../contexts/NormalizationContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";
import LabelledSwitch from "./LabelledSwitch";

export default function Controls() {
  const { setHeatmapTheme, heatmapTheme } = useColorScale();

  const handleThemeChange = useEventCallback((e: SelectChangeEvent) => {
    setHeatmapTheme(e.target.value as HeatmapTheme);
  });

  const { currentTheme, setTheme } = useSetTheme();
  const { fraction, setFraction } = useFraction();
  const { selectedDimension, setSelectedDimension } = useSelectedDimension();
  const { normalization, setNormalization } = useNormalization();

  const changeVisTheme = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newTheme = e.target.checked ? "dark" : "light";
      setTheme(newTheme);
    },
  );

  const changeFraction = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newFraction = Boolean(event.target.checked);
      setFraction(newFraction);
    },
  );

  const changeSelectedDimension = useEventCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newSelectedDimension = event.target.checked ? "X" : "Y";
      setSelectedDimension(newSelectedDimension);
    },
  );

  const changeNormalization = useEventCallback((event: SelectChangeEvent) => {
    setNormalization(event.target.value as (typeof NORMALIZATIONS)[number]);
  });

  const themeIsDisabled = useThemeControlIsDisabled();
  const fractionIsDisabled = useFractionControlIsDisabled();
  const selectedDimensionIsDisabled = useFractionControlIsDisabled();

  return (
    <AppBar
      color={currentTheme === "dark" ? "default" : "transparent"}
      position="static"
      elevation={0}
    >
      <Stack direction="row" spacing={5} p={1}>
        <FormControl sx={{ maxWidth: 300 }}>
          <InputLabel id="heatmap-theme-select-label">
            Heatmap Themes
          </InputLabel>
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
        {!fractionIsDisabled && (
          <LabelledSwitch
            label="Graph Type"
            leftLabel="Count"
            rightLabel="Fraction"
            onChange={changeFraction}
            checked={fraction}
          />
        )}
        {!selectedDimensionIsDisabled && (
          <LabelledSwitch
            label="Selection Tool"
            leftLabel="Row"
            rightLabel="Column"
            onChange={changeSelectedDimension}
            checked={selectedDimension === "X"}
          />
        )}
        {!themeIsDisabled && (
          <LabelledSwitch
            label="Theme"
            leftLabel="Light"
            rightLabel="Dark"
            onChange={changeVisTheme}
            checked={currentTheme === "dark"}
          />
        )}
      </Stack>
    </AppBar>
  );
}
