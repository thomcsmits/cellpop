import React, { PropsWithChildren, useMemo } from "react";
import { CellPopData } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";
import { getUpperBound } from "../visualization/util";

interface DataContextProps extends PropsWithChildren {
  data: CellPopData;
}

type RowKey = string;
type ColumnKey = string;
type DataMapKey = `${RowKey}-${ColumnKey}`;

interface DataContextType {
  data: CellPopData;
  dataMap: Map<DataMapKey, number>;
  columnCounts: Record<string, number>;
  rowCounts: Record<string, number>;
  maxRow: number;
  maxCol: number;
  upperBound: number;
  maxCount: number;
}

const DataContext = createContext<DataContextType | null>("CellPopData");
export const useData = () => useContext(DataContext);

export function calculateRowAndColumnCounts(data: CellPopData) {
  const columnCounts: Record<string, number> = {};
  const rowCounts: Record<string, number> = {};
  let maxCount: number = 0;
  const dataMap = new Map<DataMapKey, number>();
  data.countsMatrix.forEach(({ col, row, value }) => {
    columnCounts[col] = (columnCounts[col] || 0) + value;
    rowCounts[row] = (rowCounts[row] || 0) + value;
    maxCount = Math.max(maxCount, value);
    dataMap.set(`${row}-${col}`, value);
  });
  console.log(dataMap);

  const upperBound = getUpperBound(data.countsMatrix.map((r) => r.value));
  const maxRow = Math.max(...Object.values(rowCounts));
  const maxCol = Math.max(...Object.values(columnCounts));
  return {
    columnCounts,
    rowCounts,
    maxRow,
    maxCol,
    upperBound,
    maxCount,
    dataMap,
  };
}

export function DataProvider({ children, data }: DataContextProps) {
  const {
    columnCounts,
    rowCounts,
    maxRow,
    maxCol,
    upperBound,
    maxCount,
    dataMap,
  } = useMemo(() => {
    return calculateRowAndColumnCounts(data);
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        columnCounts,
        rowCounts,
        maxRow,
        maxCol,
        upperBound,
        maxCount,
        dataMap,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
