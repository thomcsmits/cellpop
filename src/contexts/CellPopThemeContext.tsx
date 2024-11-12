import React, { PropsWithChildren, useMemo, useState } from "react";
import { CellPopTheme } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";

import { Setter } from "../utils/types";

import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "../visualization/theme";

interface ThemeSetterContextType {
  currentThemeName: CellPopTheme;
  setTheme: Setter<CellPopTheme>;
}

const ThemeSetterContext = createContext<ThemeSetterContextType | null>(
  "ThemeSetterContext",
);
export const useSetTheme = () => useContext(ThemeSetterContext);

/**
 * Provider which manages the theme to use for the visualization.
 * @param props.theme - The initial theme to use.
 */
export function CellPopThemeProvider({
  children,
  theme: initialTheme,
}: PropsWithChildren<{ theme: CellPopTheme }>) {
  const [currentThemeName, setTheme] = useState(initialTheme);

  const theme = useMemo(() => {
    return getTheme(currentThemeName);
  }, [currentThemeName]);

  return (
    <ThemeProvider theme={theme}>
      <ThemeSetterContext.Provider value={{ currentThemeName, setTheme }}>
        {children}
      </ThemeSetterContext.Provider>
    </ThemeProvider>
  );
}
