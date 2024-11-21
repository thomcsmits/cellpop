import { memoize } from "proxy-memoize";
import { createStore } from "zustand";
import { CellPopData } from "../cellpop-schema";
import { createStoreContext } from "../utils/zustand";

interface DataContextProps {
  initialData: CellPopData;
}

type RowKey = string;
type ColumnKey = string;
// TODO: Maybe there's a more performant way to do this?
// Since JS Maps that use objects as keys require a stable reference to the object, we can't use a tuple as a key.
// This stringified tuple is a workaround, but it's not ideal since it requires appending strings to create the key at render time.
type DataMapKey = `${RowKey}-${ColumnKey}`;

interface DataContextState {
  data: CellPopData;
  removedRows: Set<string>;
  removedColumns: Set<string>;
  expandedRows: Set<string>;
}

interface DataContextActions {
  resetRemovedRows: () => void;
  resetRemovedColumns: () => void;
  removeRow: (row: string) => void;
  removeColumn: (column: string) => void;
  expandRow: (row: string) => void;
  collapseRow: (row: string) => void;
  resetExpandedRows: () => void;
}

type DataContextStore = DataContextState & DataContextActions;

const createDataContextStore = ({
  initialData,
}: {
  initialData: CellPopData;
}) =>
  createStore<DataContextStore>()((set) => ({
    data: initialData,
    removedRows: new Set<string>(),
    removedColumns: new Set<string>(),
    expandedRows: new Set<string>(),
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
  }));

const [DataProvider, useData] = createStoreContext<
  DataContextStore,
  DataContextProps
>(createDataContextStore, "DataContextStore");

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
  const { removedRows } = state;
  return state.data.rowNames.filter((row) => !removedRows.has(row));
});

const getColumnNames = memoize((state: DataContextStore) => {
  const { removedColumns } = state;
  return state.data.colNames.filter((column) => !removedColumns.has(column));
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

export { DataProvider, useData };
