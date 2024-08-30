import React, { PropsWithChildren } from "react";
import {
  CellPopData,
  CellPopDimensions,
  CellPopTheme,
} from "../cellpop-schema";
import { BoundaryProvider } from "./BoundaryContext";
import { CellPopThemeProvider } from "./CellPopThemeContext";
import { DataProvider } from "./DataContext";
import { DimensionsProvider } from "./DimensionsContext";
import { FractionProvider } from "./FractionContext";
import { MetadataFieldProvider } from "./MetadataFieldContext";
import { ScaleProvider } from "./ScaleContext";

interface CellPopConfigProps extends PropsWithChildren {
  data: CellPopData;
  dimensions: CellPopDimensions;
  theme: CellPopTheme;
}

export function Providers({
  children,
  data,
  dimensions,
  theme,
}: CellPopConfigProps) {
  return (
    <DataProvider data={data}>
      <CellPopThemeProvider theme={theme}>
        <DimensionsProvider dimensions={dimensions}>
          <FractionProvider>
            <MetadataFieldProvider>
              <BoundaryProvider>
                <ScaleProvider>{children}</ScaleProvider>
              </BoundaryProvider>
            </MetadataFieldProvider>
          </FractionProvider>
        </DimensionsProvider>
      </CellPopThemeProvider>
    </DataProvider>
  );
}
