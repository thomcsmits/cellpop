import { Theme } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { CellPopData, CellPopTheme } from "../cellpop-schema";
import {
  AxisConfig,
  ColumnConfigProvider,
  RowConfigProvider,
} from "./AxisConfigContext";
import { CellPopThemeProvider } from "./CellPopThemeContext";
import { DataProvider } from "./DataContext";
import {
  Dimensions,
  DimensionsProvider,
  GridSizeTuple,
  INITIAL_PROPORTIONS,
} from "./DimensionsContext";
import {
  DisableableControls,
  DisabledControlProvider,
} from "./DisabledControlProvider";
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
  customTheme?: Theme;
  disabledControls?: DisableableControls[];
  initialProportions?: [GridSizeTuple, GridSizeTuple];
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
  customTheme,
  disabledControls = [],
  initialProportions = [INITIAL_PROPORTIONS, INITIAL_PROPORTIONS],
}: CellPopConfigProps) {
  return (
    <DisabledControlProvider disabledControls={disabledControls}>
      <DataProvider initialData={data}>
        <SelectedValuesProvider initialSelectedValues={selectedValues}>
          <RowConfigProvider {...yAxisConfig}>
            <ColumnConfigProvider {...xAxisConfig}>
              <TooltipDataProvider>
                <CellPopThemeProvider theme={theme} customTheme={customTheme}>
                  <DimensionsProvider
                    dimensions={dimensions}
                    initialProportions={initialProportions}
                  >
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
    </DisabledControlProvider>
  );
}
