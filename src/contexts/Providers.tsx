import React, { PropsWithChildren } from "react";
import { CellPopData, CellPopTheme } from "../cellpop-schema";
import { ColumnProvider, RowProvider } from "./AxisOrderContext";
import { BoundaryProvider } from "./BoundaryContext";
import { CellPopThemeProvider } from "./CellPopThemeContext";
import { DataProvider } from "./DataContext";
import { Dimensions, DimensionsProvider } from "./DimensionsContext";
import { FractionProvider } from "./FractionContext";
import { MetadataFieldProvider } from "./MetadataFieldContext";
import { ScaleProvider } from "./ScaleContext";
import { TooltipDataProvider } from "./TooltipDataContext";

interface CellPopConfigProps extends PropsWithChildren {
  data: CellPopData;
  dimensions: Dimensions;
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
      <RowProvider>
        <ColumnProvider>
          <TooltipDataProvider>
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
          </TooltipDataProvider>
        </ColumnProvider>
      </RowProvider>
    </DataProvider>
  );
}
