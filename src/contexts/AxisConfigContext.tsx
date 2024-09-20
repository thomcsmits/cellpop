import { createContext, useContext } from "../utils/context";

export interface AxisConfig {
  label: string;
  createHref?: (tick: string) => string;
  invertPosition?: boolean;
}

const [RowConfigContext, ColumnConfigContext] = ["Row", "Column"].map(
  (dimension: string) => createContext<AxisConfig>(`${dimension}ConfigContext`),
);

export const useRowConfig = () => useContext(RowConfigContext);
export const useColumnConfig = () => useContext(ColumnConfigContext);

export const RowConfigProvider = RowConfigContext.Provider;
export const ColumnConfigProvider = ColumnConfigContext.Provider;
