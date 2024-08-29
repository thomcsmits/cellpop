import React, { useEffect, useState, useRef } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getPossibleMetadataSelections } from "./visualization/metadata";
import { getTheme } from "./visualization/theme";
import {
  CellPopProps,
  CellPopDimensions,
  CellPopTheme,
} from "./cellpop-schema";
import VizContainer from "./visx-visualization/VizContainer";
import Background from "./visx-visualization/Background";
import { CellPopConfigProvider } from "./visx-visualization/CellPopConfigContext";
import Heatmap from "./visx-visualization/Heatmap";

const useCellPopConfig = ({
  data,
  dimensions: initialDimensions,
  theme: initialTheme,
}: CellPopProps) => {
  const [theme, setTheme] = useState<CellPopTheme>(initialTheme);
  const [dimensions, setDimensions] =
    useState<CellPopDimensions>(initialDimensions);
  const [fraction, setFraction] = useState<boolean>(false);
  const [metadataField, setMetadataField] = useState<string>("None");

  const [animationAnchor, setAnimationAnchor] = useState<HTMLElement>(null);
  const [boundary, setBoundary] = useState<boolean>(false);

  function undo() {
    console.warn("Not yet implemented");
  }

  // create MUI buttons with callback functions to e.g. change theme
  function changeTheme(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    newTheme: CellPopTheme | null
  ) {
    if (newTheme !== null) {
      setTheme(newTheme);
    }
    removeBoundary();
  }

  function changeFraction(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    newFraction: boolean | null
  ) {
    if (newFraction !== null) {
      setFraction(newFraction);
    }
    removeBoundary();
  }

  function changeMetadataField(event: React.ChangeEvent<HTMLInputElement>) {
    setMetadataField(event.target.value);
    removeBoundary();
  }

  function resetData() {
    resetLayeredBar();

    // renderCellPopVisualization(data, dimensions, fraction, themeColors, metadataField, true);
    removeBoundary();
  }

  function resetLayeredBar() {
    // resetExtensionChart(data);
    removeBoundary();
  }

  // animation pop-up
  const handleAnimationPopup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnimationAnchor(animationAnchor ? null : event.currentTarget);
    removeBoundary();
  };

  function showBoundary() {
    setBoundary(true);
  }

  function removeBoundary() {
    setBoundary(false);
  }

  return {
    theme,
    dimensions,
    fraction,
    metadataField,
    animationAnchor,
    boundary,
    undo,
    changeTheme,
    changeFraction,
    changeMetadataField,
    resetData,
    resetLayeredBar,
    handleAnimationPopup,
    showBoundary,
    removeBoundary,
  };
};

export const CellPop = (props: CellPopProps) => {
  const cellPopRef = useRef<HTMLDivElement>(null);

  const {
    theme,
    dimensions,
    fraction,
    metadataField,
    animationAnchor,
    boundary,
    undo,
    changeTheme,
    changeFraction,
    changeMetadataField,
    resetData,
    resetLayeredBar,
    handleAnimationPopup,
    showBoundary,
    removeBoundary,
  } = useCellPopConfig(props);

  const { data } = props;

  // get metadata options
  const metadataFields = getPossibleMetadataSelections(data);

  if (!data) {
    return <></>;
  }

  return (
    <div>
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
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="sort-by-metadata">Sort by metadata</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={metadataField}
            label="select-metadata"
            onChange={changeMetadataField}
          >
            <MenuItem value="None" key="None">
              None
            </MenuItem>
            {metadataFields.map((d) => {
              return (
                <MenuItem value={d[0]} key={d[0]}>
                  {d[0]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
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
        <Button
          variant="outlined"
          onClick={boundary ? removeBoundary : showBoundary}
        >
          {boundary ? "Remove" : "Show"} boundary boxes
        </Button>
        <Button variant="outlined" onClick={resetData}>
          Reset data
        </Button>
        <Button variant="outlined" onClick={resetLayeredBar}>
          Reset layered bar chart
        </Button>
        <Button variant="outlined" onClick={handleAnimationPopup}>
          Show animation
        </Button>
      </Stack>
      <CellPopConfigProvider
        value={{ data, dimensions, theme: getTheme(theme), fraction }}
      >
        <VizContainer ref={cellPopRef}>
          <Background />
          <Heatmap />
        </VizContainer>
      </CellPopConfigProvider>
    </div>
  );
};
