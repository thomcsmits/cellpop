import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
  useEventCallback,
} from "@mui/material";
import React from "react";
import {
  useAvailableColumnSorts,
  useAvailableRowSorts,
  useData,
} from "../../contexts/DataContext";
import {
  PlotControlsSection,
  usePlotControlsContext,
} from "./PlotControlsContext";

function useAvailableSorts(section: PlotControlsSection) {
  const columns = useAvailableColumnSorts();
  const rows = useAvailableRowSorts();
  return section === "Column" ? columns : rows;
}

function useAddSort(section: PlotControlsSection) {
  const availableSorts = useAvailableSorts(section);
  const addSort = useData((s) =>
    section === "Column" ? s.addColumnSortOrder : s.addRowSortOrder,
  );
  const disabled = availableSorts.length === 0;
  const onClick = useEventCallback(() => {
    if (availableSorts.length > 0) {
      addSort({ key: availableSorts[0], direction: "asc" });
    }
  });
  return { disabled, onClick };
}

function useResetSorts(section: PlotControlsSection) {
  const resetSorts = useData((s) =>
    section === "Column" ? s.clearColumnSortOrder : s.clearRowSortOrder,
  );
  const currentSorts = useData((s) =>
    section === "Column" ? s.columnSortOrder : s.rowSortOrder,
  );
  const disabled = currentSorts.length === 0;
  const onClick = useEventCallback(() => {
    resetSorts();
  });
  return { disabled, onClick };
}

export function SortControls() {
  const section = usePlotControlsContext();
  const { sorts, editSort, removeSort, addSort, resetSorts } = useData((s) => ({
    sorts: section === "Column" ? s.columnSortOrder : s.rowSortOrder,
    editSort: section === "Column" ? s.editColumnSortOrder : s.editRowSortOrder,
    removeSort:
      section === "Column" ? s.removeColumnSortOrder : s.removeRowSortOrder,
    addSort: section === "Column" ? s.addColumnSortOrder : s.addRowSortOrder,
    resetSorts:
      section === "Column" ? s.clearColumnSortOrder : s.clearRowSortOrder,
  }));

  return (
    <Accordion>
      <AccordionSummary>Sorts</AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">
          Customize how columns are sorted by selecting the primary sorting
          field. Drag and reorder sorting fields to adjust their priority.
        </Typography>
        <Stack>
          {sorts.map((sort, i) => (
            <Stack key={sort.key}>
              <Typography variant="subtitle1">
                {i === 0 ? "Sort By" : "Then By"}
                {sort.key}
                {sort.direction === "asc" ? "Ascending" : "Descending"}
              </Typography>
              <Button onClick={() => editSort(i)}>Edit</Button>
              <Button onClick={() => removeSort(i)}>Remove</Button>
            </Stack>
          ))}
        </Stack>
        <Button {...useAddSort(section)}>Add Sort</Button>
        <Button {...useResetSorts(section)}>Reset Sort</Button>
      </AccordionDetails>
    </Accordion>
  );
}
