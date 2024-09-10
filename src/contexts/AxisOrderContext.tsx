import React, { PropsWithChildren } from "react";
import { useOrderedArrayState } from "../hooks/useOrderedArray";
import { createContext, useContext } from "../utils/context";
import { useData } from "./DataContext";

type AxisOrderContext = ReturnType<typeof useOrderedArrayState<string>>;

const [RowContext, ColumnContext] = ["Row", "Column"].map((dimension: string) =>
  createContext<AxisOrderContext>(`${dimension}OrderContext`),
);

export const useRows = () => useContext(RowContext);
export const useColumns = () => useContext(ColumnContext);

interface AxisProviderProps extends PropsWithChildren {
  sortOrder?: (a: string, b: string) => number;
}

export const RowProvider = ({ children, sortOrder }: AxisProviderProps) => {
  const { data } = useData();

  const value = useOrderedArrayState(data.rowNames, sortOrder);

  return <RowContext.Provider value={value}>{children}</RowContext.Provider>;
};

export const ColumnProvider = ({ children, sortOrder }: AxisProviderProps) => {
  const { data } = useData();

  const value = useOrderedArrayState(data.colNames, sortOrder);

  return (
    <ColumnContext.Provider value={value}>{children}</ColumnContext.Provider>
  );
};
