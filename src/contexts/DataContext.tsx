import { memoize } from "proxy-memoize";
import { temporal } from "zundo";
import { createStore } from "zustand";
import { CellPopData } from "../cellpop-schema";
import { createStoreContext } from "../utils/zustand";

interface DataContextProps {
  initialData: CellPopData;
}

type RowKey = string;
type ColumnKey = string;
type DataMapKey = `${RowKey}-${ColumnKey}`;

interface SortOrder<T> {
  key: keyof T | "count" | "alphabetical";
  direction: "asc" | "desc";
}

interface DataContextState {
  data: CellPopData;
  removedRows: Set<string>;
  removedColumns: Set<string>;
  expandedRows: Set<string>;
  rowOrder: string[];
  columnOrder: string[];
  rowSortOrder: SortOrder<string>[];
  columnSortOrder: SortOrder<string>[];
}

interface DataContextActions {
  resetRemovedRows: () => void;
  resetRemovedColumns: () => void;
  removeRow: (row: string) => void;
  removeColumn: (column: string) => void;
  expandRow: (row: string) => void;
  collapseRow: (row: string) => void;
  resetExpandedRows: () => void;
  addRowSortOrder: (sortOrder: SortOrder<string>) => void;
  addColumnSortOrder: (sortOrder: SortOrder<string>) => void;
  editRowSortOrder: (index: number, sortOrder: SortOrder<string>) => void;
  editColumnSortOrder: (index: number, sortOrder: SortOrder<string>) => void;
  removeRowSortOrder: (index: number) => void;
  removeColumnSortOrder: (index: number) => void;
  clearRowSortOrder: () => void;
  clearColumnSortOrder: () => void;
  setRowOrder: (order: string[]) => void;
  setColumnOrder: (order: string[]) => void;
}

type DataContextStore = DataContextState & DataContextActions;

/**
 * Helper method for applying multiple sort orders to an array.
 * @param array The array to sort
 * @param sorts The sort orders to apply
 * @param metadata The metadata object to use for sorting
 * @returns The sorted array
 */
const applySortOrders = (
  array: string[],
  sorts: SortOrder<string>[],
  metadata: Record<string, Record<string, string | number>>,
): string[] => {
  // Avoid mutating the original array
  const arrayCopy = [...array];
  return sorts.reduce((sortedArray, { key, direction }) => {
    if (key === "alphabetical") {
      if (direction === "desc") {
        return sortedArray.sort();
      } else {
        return sortedArray.sort().reverse();
      }
    }
    if (key === "count") {
      return sortedArray.sort((a, b) => {
        const aValue = metadata[a][key] as number;
        const bValue = metadata[b][key] as number;
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
    return sortedArray.sort((a, b) => {
      const aValue = metadata[a][
        key as keyof (typeof metadata)[typeof a]
      ] as string;
      const bValue = metadata[b][
        key as keyof (typeof metadata)[typeof b]
      ] as string;
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, arrayCopy);
};

const createDataContextStore = ({ initialData }: DataContextProps) =>
  createStore<DataContextStore>()(
    temporal((set) => ({
      data: initialData,
      removedRows: new Set<string>(),
      removedColumns: new Set<string>(),
      expandedRows: new Set<string>(),
      rowSortOrder: [],
      columnSortOrder: [],
      rowOrder: initialData.rowNames,
      columnOrder: initialData.colNames,
      resetRemovedRows: () => {
        set({ removedRows: new Set<string>() });
      },
      resetRemovedColumns: () => {
        set({ removedColumns: new Set<string>() });
      },
      removeRow: (row: string) => {
        set((state) => {
          const removedRows = new Set(state.removedRows);
          removedRows.add(row);
          return { removedRows };
        });
      },
      removeColumn: (column: string) => {
        set((state) => {
          const removedColumns = new Set(state.removedColumns);
          removedColumns.add(column);
          return { removedColumns };
        });
      },
      expandRow: (row: string) => {
        set((state) => {
          const expandedRows = new Set(state.expandedRows);
          expandedRows.add(row);
          return { expandedRows };
        });
      },
      collapseRow: (row: string) => {
        set((state) => {
          const expandedRows = new Set(state.expandedRows);
          expandedRows.delete(row);
          return { expandedRows };
        });
      },
      resetExpandedRows: () => {
        set({ expandedRows: new Set<string>() });
      },
      addRowSortOrder: (sortOrder: SortOrder<RowKey>) => {
        set((state) => {
          const rowSortOrder = [...state.rowSortOrder, sortOrder];
          const rowOrder = applySortOrders(
            state.rowOrder,
            rowSortOrder,
            state.data.metadata.rows,
          );
          return { rowSortOrder, rowOrder };
        });
      },
      addColumnSortOrder: (sortOrder: SortOrder<ColumnKey>) => {
        set((state) => {
          const columnSortOrder = [...state.columnSortOrder, sortOrder];
          const columnOrder = applySortOrders(
            state.columnOrder,
            columnSortOrder,
            state.data.metadata.cols,
          );
          return { columnSortOrder, columnOrder };
        });
      },
      editRowSortOrder: (index: number, sortOrder: SortOrder<RowKey>) => {
        set((state) => {
          const rowSortOrder = [...state.rowSortOrder];
          rowSortOrder[index] = sortOrder;
          const rowOrder = applySortOrders(
            state.rowOrder,
            rowSortOrder,
            state.data.metadata.rows,
          );
          return { rowSortOrder, rowOrder };
        });
      },
      editColumnSortOrder: (index: number, sortOrder: SortOrder<ColumnKey>) => {
        set((state) => {
          const columnSortOrder = [...state.columnSortOrder];
          columnSortOrder[index] = sortOrder;
          const columnOrder = applySortOrders(
            state.columnOrder,
            columnSortOrder,
            state.data.metadata.cols,
          );
          return { columnSortOrder, columnOrder };
        });
      },
      removeRowSortOrder: (index: number) => {
        set((state) => {
          const rowSortOrder = state.rowSortOrder.slice(index, index + 1);
          const rowOrder = applySortOrders(
            state.rowOrder,
            rowSortOrder,
            state.data.metadata.rows,
          );
          return { rowSortOrder, rowOrder };
        });
      },
      removeColumnSortOrder: (index: number) => {
        set((state) => {
          const columnSortOrder = state.columnSortOrder.slice(index, index + 1);
          const columnOrder = applySortOrders(
            state.columnOrder,
            columnSortOrder,
            state.data.metadata.cols,
          );
          return { columnSortOrder, columnOrder };
        });
      },
      clearRowSortOrder: () => {
        set({ rowSortOrder: [] });
      },
      clearColumnSortOrder: () => {
        set({ columnSortOrder: [] });
      },
      setRowOrder: (order: string[]) => {
        set({ rowOrder: order });
      },
      setColumnOrder: (order: string[]) => {
        set({ columnOrder: order });
      },
    })),
  );

const [DataProvider, useData, , useDataHistory] = createStoreContext<
  DataContextStore,
  DataContextProps,
  true
>(createDataContextStore, "DataContextStore", true);

const getDerivedStates = memoize((state: DataContextStore) => {
  const rowCounts: Record<string, number> = {};
  const columnCounts: Record<string, number> = {};
  const rowMaxes: Record<string, number> = {};
  const columnMaxes: Record<string, number> = {};
  const dataMap: Record<DataMapKey, number> = {};
  let maxCount = 0;
  const { removedRows, removedColumns } = state;
  state.data.countsMatrix.forEach(({ row, col, value }) => {
    if (removedRows.has(row) || removedColumns.has(col)) {
      return;
    }
    rowCounts[row] = (rowCounts[row] || 0) + value;
    columnCounts[col] = (columnCounts[col] || 0) + value;
    rowMaxes[row] = Math.max(rowMaxes[row] || 0, value);
    columnMaxes[col] = Math.max(columnMaxes[col] || 0, value);
    dataMap[`${row}-${col}`] = value;
    maxCount = Math.max(maxCount, value);
  });
  return {
    rowCounts,
    columnCounts,
    rowMaxes,
    columnMaxes,
    dataMap,
    maxCount,
  };
});

const getRowNames = memoize((state: DataContextStore) => {
  const { rowOrder, removedRows } = state;
  return rowOrder.filter((row) => !removedRows.has(row));
});

const getColumnNames = memoize((state: DataContextStore) => {
  const { columnOrder, removedColumns } = state;
  return columnOrder.filter((column) => !removedColumns.has(column));
});

const getMetadataKeys = (
  metadata: Record<string, Record<string, string | number>>,
) => {
  const metadataValues = Object.values(metadata);
  const set = metadataValues.reduce<Set<string>>(
    (acc: Set<string>, curr: object) => {
      Object.keys(curr).forEach((key) => {
        acc.add(key);
      });
      return acc;
    },
    new Set<string>(),
  );
  return [...set];
};

const getRowMetadataKeys = memoize((state: DataContextStore) => {
  return getMetadataKeys(state.data.metadata.rows);
});

const getColumnMetadataKeys = memoize((state: DataContextStore) => {
  return getMetadataKeys(state.data.metadata.cols);
});

export const useDataMap = () => {
  return useData(getDerivedStates).dataMap;
};

export const useRowCounts = () => {
  return useData(getDerivedStates).rowCounts;
};

export const useColumnCounts = () => {
  return useData(getDerivedStates).columnCounts;
};

export const useRowMaxes = () => {
  return useData(getDerivedStates).rowMaxes;
};

export const useColumnMaxes = () => {
  return useData(getDerivedStates).columnMaxes;
};

export const useMaxCount = () => {
  return useData(getDerivedStates).maxCount;
};

export const useRowNames = () => {
  return useData(getRowNames);
};

export const useColumnNames = () => {
  return useData(getColumnNames);
};

export const useHighestColumnCount = () => {
  const columnCounts = useColumnCounts();
  return Math.max(
    ...Object.values(columnCounts).filter((count) => !isNaN(count)),
  );
};

export const useHighestRowCount = () => {
  const rowCounts = useRowCounts();
  return Math.max(...Object.values(rowCounts).filter((count) => !isNaN(count)));
};

export { DataProvider, useData, useDataHistory };
