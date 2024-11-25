import React, { PropsWithChildren } from "react";
import { CellPopData, CellPopTheme } from "../cellpop-schema";
import {
  AxisConfig,
  ColumnConfigProvider,
  RowConfigProvider,
} from "./AxisConfigContext";
import { CellPopThemeProvider } from "./CellPopThemeContext";
import { DataProvider } from "./DataContext";
import { Dimensions, DimensionsProvider } from "./DimensionsContext";
import { SelectedValuesProvider } from "./ExpandedValuesContext";
import { FractionProvider } from "./FractionContext";
import { ScaleProvider } from "./ScaleContext";
import { SelectedDimensionProvider } from "./SelectedDimensionContext";
import { TooltipDataProvider } from "./TooltipDataContext";

interface CellPopConfigProps extends PropsWithChildren {
  data: CellPopData;
  dimensions: Dimensions;
  theme: CellPopTheme;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  selectedDimension?: "X" | "Y";
  fraction?: boolean;
  selectedValues?: string[];
}

export function Providers({
  children,
  data,
  dimensions,
  theme,
  fraction = false,
  selectedValues = [],
  selectedDimension = "X",
  xAxis: xAxisConfig,
  yAxis: yAxisConfig,
}: CellPopConfigProps) {
  return (
    <DataProvider initialData={data}>
      <SelectedValuesProvider initialSelectedValues={selectedValues}>
        <RowConfigProvider {...yAxisConfig}>
          <ColumnConfigProvider {...xAxisConfig}>
            <TooltipDataProvider>
              <CellPopThemeProvider theme={theme}>
                <DimensionsProvider dimensions={dimensions}>
                  <FractionProvider initialFraction={fraction}>
                    <ScaleProvider>
                      <SelectedDimensionProvider
                        initialSelectedDimension={selectedDimension}
                      >
                        {children}
                      </SelectedDimensionProvider>
                    </ScaleProvider>
                  </FractionProvider>
                </DimensionsProvider>
              </CellPopThemeProvider>
            </TooltipDataProvider>
          </ColumnConfigProvider>
        </RowConfigProvider>
      </SelectedValuesProvider>
    </DataProvider>
  );
}
