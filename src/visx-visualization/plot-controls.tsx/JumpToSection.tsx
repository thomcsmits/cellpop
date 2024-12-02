import { Sort, Visibility } from "@mui/icons-material";
import { Link, Typography } from "@mui/material";
import React from "react";
import { usePlotControlsContext } from "./PlotControlsContext";
export function JumpToSection() {
  const section = usePlotControlsContext();
  return (
    <Typography
      variant="subtitle1"
      display="inline-flex"
      alignItems="center"
      flexDirection="row"
      gap={1}
      padding={1}
    >
      Jump To Section:
      <Link
        href={`#sort-options-${section}`}
        display="flex"
        alignItems="center"
        underline="none"
      >
        <Sort /> Sorts
      </Link>
      {" | "}
      <Link
        href={`#display-options-${section}`}
        display="flex"
        alignItems="center"
        underline="none"
      >
        <Visibility /> Display Options
      </Link>
    </Typography>
  );
}
