import React, { PropsWithChildren, useMemo } from "react";
import { CellPopData } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";
import { getUpperBound } from "../visualization/util";

interface DataContextProps extends PropsWithChildren {
  data: CellPopData;
}

type RowKey = string;
type ColumnKey = string;
// TODO: Maybe there's a more performant way to do this?
// Since JS Maps that use objects as keys require a stable reference to the object, we can't use a tuple as a key.
// This stringified tuple is a workaround, but it's not ideal since it requires appending strings to create the key at render time.
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

/**
 * Function for calculating various static counts for the data.
 * @param data The data to calculate counts for.
 * @todo It would be nice if we could generalize this further so it handles everything that the `dataLoading` helpers do.
 *       This would enable greater flexibility for downstream users, e.g. providing an array of [row, column, value] tuples instead of a `CellPopData` object.
 */
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

/**
 * Context provider for the data passed to the rest of the visualization.
 * Handles calculating various static counts for the data and provides them to the rest of the visualization.
 * @param param0 props.data The data to be visualized
 */
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
