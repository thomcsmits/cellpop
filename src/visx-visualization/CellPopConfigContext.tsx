import React, { createContext } from "react";
import { CellPopData, CellPopDimensions, CellPopThemeColors } from "../cellpop-schema";

interface CellPopConfig {
  data: CellPopData;
  dimensions: CellPopDimensions;
  theme: CellPopThemeColors;
  fraction: boolean;
}

const CellPopConfigContext = createContext<CellPopConfig | null>(null);
CellPopConfigContext.displayName = "CellPopConfigContext";

export function CellPopConfigProvider({ children, value }: { children: React.ReactNode; value: CellPopConfig }) {
  return <CellPopConfigContext.Provider value={value}>{children}</CellPopConfigContext.Provider>;
}

export default function useCellPopConfig() {
  const context = React.useContext(CellPopConfigContext);
  if (context === undefined) {
    throw new Error("useCellPopConfig must be used within a CellPopConfigProvider");
  }
  return context;
}