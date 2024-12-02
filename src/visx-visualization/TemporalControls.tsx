import React, { useEffect, useRef } from "react";

import { RedoRounded, RestoreOutlined, UndoRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEventCallback } from "@mui/material/utils";

import Button from "@mui/material/Button";
import { TemporalState } from "zundo";
import { StoreApi } from "zustand";
import { useThemeHistory } from "../contexts/CellPopThemeContext";
import { useDataHistory } from "../contexts/DataContext";
import { useThemeControlIsDisabled } from "../contexts/DisabledControlProvider";
import { useExpandedValuesHistory } from "../contexts/ExpandedValuesContext";
import { useFractionHistory } from "../contexts/FractionContext";
import { useSelectedDimensionHistory } from "../contexts/SelectedDimensionContext";

// Function to hook into the various state histories and provide undo/redo functionality
function useTemporalActions() {
  const themeHistory = useThemeHistory();
  const selectedDimensionHistory = useSelectedDimensionHistory();
  const fractionHistory = useFractionHistory();
  const dataHistory = useDataHistory();
  const expandedHistory = useExpandedValuesHistory();

  const themeIsDisabled = useThemeControlIsDisabled();
  const selectedDimensionIsDisabled = useThemeControlIsDisabled();
  const fractionIsDisabled = useThemeControlIsDisabled();

  const undoQueue = useRef<TemporalState<StoreApi<unknown>>[]>([]);
  const redoQueue = useRef<TemporalState<StoreApi<unknown>>[]>([]);

  useEffect(() => {
    const onSave = (state: TemporalState<StoreApi<unknown>>) => () => {
      undoQueue.current.push(state);
      redoQueue.current = [];
    };
    if (!themeIsDisabled) {
      themeHistory.setOnSave(onSave(themeHistory));
    }
    if (!selectedDimensionIsDisabled) {
      selectedDimensionHistory.setOnSave(onSave(selectedDimensionHistory));
    }
    if (!fractionIsDisabled) {
      fractionHistory.setOnSave(onSave(fractionHistory));
    }
    dataHistory.setOnSave(onSave(dataHistory));
    expandedHistory.setOnSave(onSave(expandedHistory));
    return () => {
      themeHistory.setOnSave(undefined);
      selectedDimensionHistory.setOnSave(undefined);
      fractionHistory.setOnSave(undefined);
      dataHistory.setOnSave(undefined);
      expandedHistory.setOnSave(undefined);
    };
  }, [themeIsDisabled, selectedDimensionIsDisabled, fractionIsDisabled]);

  const undo = useEventCallback(() => {
    const last = undoQueue.current.pop();
    if (last) {
      last.undo();
    }
    redoQueue.current.push(last);
  });

  const redo = useEventCallback(() => {
    const last = redoQueue.current.pop();
    if (last) {
      last.redo();
    }
    undoQueue.current.push(last);
  });

  const restoreToDefault = useEventCallback(() => {
    themeHistory.undo(themeHistory.pastStates.length);
    selectedDimensionHistory.undo(selectedDimensionHistory.pastStates.length);
    fractionHistory.undo(fractionHistory.pastStates.length);
    dataHistory.undo(dataHistory.pastStates.length);
    expandedHistory.undo(expandedHistory.pastStates.length);
    undoQueue.current = [];
    redoQueue.current = [];
  });

  const canUndo = undoQueue.current.length > 0;
  const canRedo = redoQueue.current.length > 0;

  return { undo, redo, canUndo, canRedo, restoreToDefault };
}

export function TemporalControls() {
  const { undo, canUndo, redo, canRedo, restoreToDefault } =
    useTemporalActions();
  return (
    <>
      <Button
        variant="outlined"
        onClick={restoreToDefault}
        disabled={!canUndo}
        sx={{ whiteSpace: "nowrap" }}
        endIcon={<RestoreOutlined />}
      >
        Restore to Default
      </Button>
      <Button
        onClick={undo}
        aria-label="Undo"
        variant="outlined"
        component={IconButton}
        disabled={!canUndo}
        sx={{
          minWidth: 0,
          padding: 0.5,
          aspectRatio: "1/1",
        }}
      >
        <UndoRounded />
      </Button>
      <Button
        onClick={redo}
        aria-label="Redo"
        variant="outlined"
        component={IconButton}
        disabled={!canRedo}
        sx={{
          minWidth: 0,
          padding: 0.5,
          aspectRatio: "1/1",
        }}
      >
        <RedoRounded />
      </Button>
    </>
  );
}
