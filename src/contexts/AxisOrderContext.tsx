import React, { PropsWithChildren } from "react";
import { useOrderedArrayState } from "../hooks/useOrderedArray";
import { createContext, useContext } from "../utils/context";
import { useData } from "./DataContext";

type AxisOrderContext = ReturnType<typeof useOrderedArrayState<string>>;

const [RowContext, ColumnContext] = ["Row", "Column"].map((dimension: string) =>
  createContext<AxisOrderContext>(`${dimension}OrderContext`),
);

/**
 * Hook for accessing the current row order and related actions.
 */
export const useRows = () => useContext(RowContext);

/**
 * Hook for accessing the current column order and related actions.
 */
export const useColumns = () => useContext(ColumnContext);

/**
 * Context for managing heatmap row order.
 */
export const RowProvider = ({ children }: PropsWithChildren) => {
  const { rowNames, rowCounts, removedRows, data } = useData();

  const rowMetadata = data.metadata.rows;

  const value = useOrderedArrayState(
    rowNames,
    rowCounts,
    removedRows,
    rowMetadata,
  );

  return <RowContext.Provider value={value}>{children}</RowContext.Provider>;
};

/**
 * Context for managing heatmap column order.
 */
export const ColumnProvider = ({ children }: PropsWithChildren) => {
  const { colNames, columnCounts, removedColumns, data } = useData();

  const columnMetadata = data.metadata.cols;

  const value = useOrderedArrayState(
    colNames,
    columnCounts,
    removedColumns,
    columnMetadata,
  );

  return (
    <ColumnContext.Provider value={value}>{children}</ColumnContext.Provider>
  );
};
