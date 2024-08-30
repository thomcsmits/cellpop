import React, { PropsWithChildren, useMemo } from "react";
import { CellPopData } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";

interface DataContextProps extends PropsWithChildren {
  data: CellPopData;
}

interface DataContextType {
  data: CellPopData;
  columnCounts: Record<string, number>;
  rowCounts: Record<string, number>;
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
  return { columnCounts, rowCounts };
}

export function calculateRowAndColumnFractions(/*data: CellPopData*/) {
  // TODO: Implement function for calculating violin plot data
}

export function DataProvider({ children, data }: DataContextProps) {
  const { columnCounts, rowCounts } = useMemo(() => {
    return calculateRowAndColumnCounts(data);
  }, [data]);

  return (
    <DataContext.Provider value={{ data, columnCounts, rowCounts }}>
      {children}
    </DataContext.Provider>
  );
}
