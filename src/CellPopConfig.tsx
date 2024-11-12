import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useEventCallback } from "@mui/material/utils";
import React from "react";

import { useSetTheme } from "./contexts/CellPopThemeContext";
import { useFraction } from "./contexts/FractionContext";
import { useSelectedDimension } from "./contexts/SelectedDimensionContext";

export default function CellPopConfig() {
  const { currentThemeName: theme, setTheme } = useSetTheme();
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
    <Stack spacing={6} direction="row">
      <Button variant="outlined" onClick={undo}>
        Undo
      </Button>
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
        value={theme}
        exclusive
        onChange={changeTheme}
        aria-label="Theme"
      >
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
      </ToggleButtonGroup>
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
  );
}
