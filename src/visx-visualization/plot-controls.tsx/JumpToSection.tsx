import { Sort, Visibility } from "@mui/icons-material";
import { Link, Typography } from "@mui/material";
import React from "react";
export function JumpToSection({ section }: { section: string }) {
  return (
    <Typography
      variant="subtitle1"
      display="inline-flex"
      alignItems="center"
      flexDirection="row"
      gap={1}
      py={1}
      px={2}
    >
      Jump to Section:
      <Link
        href={`#sort-options-${section}`}
        display="flex"
        alignItems="center"
        underline="none"
        gap={1}
      >
        <Sort /> Sorts
      </Link>
      {" | "}
      <Link
        href={`#display-options-${section}`}
        display="flex"
        alignItems="center"
        underline="none"
        gap={1}
      >
        <Visibility /> Display Options
      </Link>
    </Typography>
  );
}
