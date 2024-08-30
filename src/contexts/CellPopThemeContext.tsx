import React, { PropsWithChildren, useState } from "react";
import { CellPopTheme, CellPopThemeColors } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";

import { Setter } from "../utils/types";

import { getTheme } from "../visualization/theme";

interface ThemeContextType {
  theme: CellPopThemeColors;
  currentThemeName: CellPopTheme;
  setTheme: Setter<CellPopTheme>;
}

const ThemeContext = createContext<ThemeContextType | null>(
  "CellPopThemeColors",
);
export const useCellPopTheme = () => useContext(ThemeContext);

export function CellPopThemeProvider({
  children,
  theme: initialTheme,
}: PropsWithChildren<{ theme: CellPopTheme }>) {
  const [currentThemeName, setTheme] = useState(initialTheme);
  const theme = getTheme(currentThemeName);

  return (
    <ThemeContext.Provider value={{ theme, currentThemeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
