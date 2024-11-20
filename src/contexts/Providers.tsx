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
import { ScaleProvider } from "./ScaleContext";
import { TooltipDataProvider } from "./TooltipDataContext";

interface CellPopConfigProps extends PropsWithChildren {
  data: CellPopData;
  dimensions: Dimensions;
  theme: CellPopTheme;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
}

export function Providers({
  children,
  data,
  dimensions,
  theme,
  xAxis: xAxisConfig,
  yAxis: yAxisConfig,
}: CellPopConfigProps) {
  return (
    <DataProvider data={data}>
      <RowConfigProvider {...yAxisConfig}>
        <ColumnConfigProvider {...xAxisConfig}>
          <RowProvider>
            <ColumnProvider>
              <TooltipDataProvider>
                <CellPopThemeProvider theme={theme}>
                  <DimensionsProvider dimensions={dimensions}>
                    <FractionProvider>
                      <ScaleProvider>{children}</ScaleProvider>
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
