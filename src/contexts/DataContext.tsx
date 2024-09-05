import React, { PropsWithChildren, useMemo } from "react";
import { CellPopData } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";
import { getUpperBound } from "../visualization/util";

interface DataContextProps extends PropsWithChildren {
  data: CellPopData;
}

interface DataContextType {
  data: CellPopData;
  columnCounts: Record<string, number>;
  rowCounts: Record<string, number>;
  maxRow: number;
  maxCol: number;
  upperBound: number;
}

const DataContext = createContext<DataContextType | null>("CellPopData");
export const useData = () => useContext(DataContext);

export function calculateRowAndColumnCounts(data: CellPopData) {
  const columnCounts: Record<string, number> = {};
  const rowCounts: Record<string, number> = {};
  data.countsMatrix.forEach(({ col, row, value }) => {
    columnCounts[col] = (columnCounts[col] || 0) + value;
    rowCounts[row] = (rowCounts[row] || 0) + value;
  });
  const upperBound = getUpperBound(data.countsMatrix.map((r) => r.value));
  const maxRow = Math.max(...Object.values(rowCounts));
  const maxCol = Math.max(...Object.values(columnCounts));
  return { columnCounts, rowCounts, maxRow, maxCol, upperBound };
}

export function DataProvider({ children, data }: DataContextProps) {
  const { columnCounts, rowCounts, maxRow, maxCol, upperBound } =
    useMemo(() => {
      return calculateRowAndColumnCounts(data);
    }, [data]);

  return (
    <DataContext.Provider
      value={{ data, columnCounts, rowCounts, maxRow, maxCol, upperBound }}
    >
      {children}
    </DataContext.Provider>
  );
}
