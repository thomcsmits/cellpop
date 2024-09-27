import React, { PropsWithChildren, useMemo } from "react";
import { CellPopData } from "../cellpop-schema";
import { useSet } from "../hooks/useSet";
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
  dataMap: Record<DataMapKey, number>;
  columnCounts: Record<string, number>;
  rowCounts: Record<string, number>;
  removedRows: Set<string>;
  removedColumns: Set<string>;
  resetRemovedRows: () => void;
  resetRemovedColumns: () => void;
  removeRow: (row: string) => void;
  removeColumn: (column: string) => void;
  upperBound: number;
  maxCount: number;
  rowNames: string[];
  colNames: string[];
}

const DataContext = createContext<DataContextType | null>("CellPopData");
export const useData = () => useContext(DataContext);

/**
 * Context provider for the data passed to the rest of the visualization.
 * Handles calculating various static counts for the data and provides them to the rest of the visualization.
 * @param param0 props.data The data to be visualized
 */
export function DataProvider({ children, data }: DataContextProps) {
  const dataMap = useMemo(() => {
    return data.countsMatrix.reduce(
      (acc, { col, row, value }) => {
        acc[`${row}-${col}`] = value;
        return acc;
      },
      {} as Record<DataMapKey, number>,
    );
  }, [data]);

  const {
    set: removedRows,
    add: removeRow,
    reset: resetRemovedRows,
  } = useSet<string>();

  const {
    set: removedColumns,
    add: removeColumn,
    reset: resetRemovedColumns,
  } = useSet<string>();

  const columnCounts = useMemo(() => {
    const columnCounts: Record<string, number> = {};
    data.countsMatrix.forEach(({ col, value }) => {
      if (removedColumns.has(col)) {
        return;
      }
      columnCounts[col] = (columnCounts[col] || 0) + value;
    });
    return columnCounts;
  }, [data, removedColumns]);

  const rowCounts = useMemo(() => {
    const rowCounts: Record<string, number> = {};
    data.countsMatrix.forEach(({ row, value }) => {
      if (removedRows.has(row)) {
        return;
      }
      rowCounts[row] = (rowCounts[row] || 0) + value;
    });
    return rowCounts;
  }, [data, removedRows]);

  const upperBound = useMemo(
    () => getUpperBound(data.countsMatrix.map((r) => r.value)),
    [data],
  );

  const maxCount = useMemo(() => {
    return Math.max(
      ...data.countsMatrix
        .filter(
          ({ col, row }) => !(removedRows.has(row) || removedColumns.has(col)),
        )
        .map((r) => r.value),
    );
  }, [data, removedRows, removedColumns]);

  const rowNames = useMemo(
    () => data.rowNames.filter((r) => !removedRows.has(r)),
    [data, removedRows],
  );

  const colNames = useMemo(
    () => data.colNames.filter((c) => !removedColumns.has(c)),
    [data, removedColumns],
  );

  return (
    <DataContext.Provider
      value={{
        data,
        columnCounts,
        rowCounts,
        upperBound,
        maxCount,
        dataMap,
        removedRows,
        removedColumns,
        resetRemovedRows,
        resetRemovedColumns,
        removeRow,
        removeColumn,
        rowNames,
        colNames,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
