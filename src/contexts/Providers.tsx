import React, { PropsWithChildren } from "react";
import { CellPopData, CellPopTheme } from "../cellpop-schema";
import { ColumnProvider, RowProvider } from "./AxisOrderContext";
import { CellPopThemeProvider } from "./CellPopThemeContext";
import { DataProvider } from "./DataContext";
import { Dimensions, DimensionsProvider } from "./DimensionsContext";
import { FractionProvider } from "./FractionContext";
import LabelLinkProvider from "./LabelLinkContext";
import { MetadataFieldProvider } from "./MetadataFieldContext";
import { ScaleProvider } from "./ScaleContext";
import { TooltipDataProvider } from "./TooltipDataContext";

interface CellPopConfigProps extends PropsWithChildren {
  data: CellPopData;
  dimensions: Dimensions;
  theme: CellPopTheme;
  createRowHref?: (row: string) => string;
  createColHref?: (col: string) => string;
}

export function Providers({
  children,
  data,
  dimensions,
  theme,
  createColHref,
  createRowHref,
}: CellPopConfigProps) {
  return (
    <DataProvider data={data}>
      <LabelLinkProvider
        createColHref={createColHref}
        createRowHref={createRowHref}
      >
        <RowProvider>
          <ColumnProvider>
            <TooltipDataProvider>
              <CellPopThemeProvider theme={theme}>
                <DimensionsProvider dimensions={dimensions}>
                  <FractionProvider>
                    <MetadataFieldProvider>
                      <ScaleProvider>{children}</ScaleProvider>
                    </MetadataFieldProvider>
                  </FractionProvider>
                </DimensionsProvider>
              </CellPopThemeProvider>
            </TooltipDataProvider>
          </ColumnProvider>
        </RowProvider>
      </LabelLinkProvider>
    </DataProvider>
  );
}
