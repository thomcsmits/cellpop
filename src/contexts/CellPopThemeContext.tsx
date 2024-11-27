import React, { PropsWithChildren, useMemo } from "react";
import { createStore } from "zustand";
import { CellPopTheme } from "../cellpop-schema";

import { Theme, ThemeProvider } from "@mui/material/styles";
import { temporal } from "zundo";
import { createStoreContext } from "../utils/zustand";
import { getTheme } from "../visualization/theme";

interface InitialThemeSetterState {
  initialTheme?: CellPopTheme;
}

interface ThemeSetterState {
  currentTheme: CellPopTheme;
}
interface ThemeSetterActions {
  setTheme: (newTheme: CellPopTheme) => void;
  reset: () => void;
}

interface ThemeSetterStoreType extends ThemeSetterState, ThemeSetterActions {}

const themeSetterStore = ({
  initialTheme = "light",
}: InitialThemeSetterState) => {
  return createStore<ThemeSetterStoreType>()(
    temporal((set) => ({
      currentTheme: initialTheme,
      setTheme: (newTheme: CellPopTheme) => {
        set({ currentTheme: newTheme });
      },
      reset: () => {
        set({ currentTheme: initialTheme });
      },
    })),
  );
};

const [ThemeSetterContextProvider, useSetTheme, , useThemeHistory] =
  createStoreContext<ThemeSetterStoreType, InitialThemeSetterState, true>(
    themeSetterStore,
    "Theme Setter Store",
    true,
  );

export { useSetTheme, useThemeHistory };

/**
 * Provider which manages the theme to use for the visualization.
 * @param props.theme - The initial theme to use.
 */
export function CellPopThemeProvider({
  children,
  theme: initialTheme,
  customTheme,
}: PropsWithChildren<{ theme: CellPopTheme; customTheme?: Theme }>) {
  return (
    <ThemeSetterContextProvider initialTheme={initialTheme}>
      <MuiThemeProvider customTheme={customTheme}>{children}</MuiThemeProvider>
    </ThemeSetterContextProvider>
  );
}

function MuiThemeProvider({
  children,
  customTheme,
}: PropsWithChildren<{ customTheme?: Theme }>) {
  const { currentTheme } = useSetTheme();
  const theme = useMemo(() => {
    if (customTheme) {
      return { ...getTheme(currentTheme), ...customTheme };
    }
    return getTheme(currentTheme);
  }, [currentTheme, customTheme]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
