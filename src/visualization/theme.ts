import { createTheme } from "@mui/material/styles";
import { CellPopTheme } from "../cellpop-schema";

export const light = createTheme({
  palette: {
    mode: "light",
  },
});

export const dark = createTheme({
  palette: {
    mode: "dark",
  },
});

export function getTheme(theme: CellPopTheme) {
  switch (theme) {
    case "light":
      return light;
    case "dark":
      return dark;
    default:
      return light;
  }
}
