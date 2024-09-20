import React, { PropsWithChildren } from "react";
import { CellPopData, CellPopTheme } from "../cellpop-schema";
import {
  AxisConfig,
  ColumnConfigProvider,
  RowConfigProvider,
} from "./AxisConfigContext";
import { ColumnProvider, RowProvider } from "./AxisOrderContext";
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
  xAxisConfig: AxisConfig;
  yAxisConfig: AxisConfig;
}

export function Providers({
  children,
  data,
  dimensions,
  theme,
  xAxisConfig,
  yAxisConfig,
}: CellPopConfigProps) {
  return (
    <DataProvider data={data}>
      <RowConfigProvider value={yAxisConfig}>
        <ColumnConfigProvider value={xAxisConfig}>
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
        </ColumnConfigProvider>
      </RowConfigProvider>
    </DataProvider>
  );
}
