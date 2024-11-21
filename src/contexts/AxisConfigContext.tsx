import { temporal } from "zundo";
import { createStore } from "zustand";
import { createStoreContext } from "../utils/zustand";

export interface AxisConfig {
  label: string;
  createHref?: (tick: string) => string;
  flipAxisPosition?: boolean;
}

interface AxisConfigActions {
  setLabel: (label: string) => void;
  setCreateHref: (createHref: (tick: string) => string) => void;
  setFlipAxisPosition: (flipAxisPosition: boolean) => void;
}

type AxisConfigStore = AxisConfig & AxisConfigActions;

const createAxisConfigStore = (initialArgs: AxisConfig) => {
  return createStore<AxisConfigStore>()(
    temporal((set) => ({
      ...initialArgs,
      setLabel: (label: string) => set({ label }),
      setCreateHref: (createHref: (tick: string) => string) =>
        set({ createHref }),
      setFlipAxisPosition: (flipAxisPosition: boolean) =>
        set({ flipAxisPosition }),
    })),
  );
};

const [
  [RowConfigProvider, useRowConfig, , useRowConfigHistory],
  [ColumnConfigProvider, useColumnConfig, , useColumnConfigHistory],
] = ["Row", "Column"].map((direction) =>
  createStoreContext<AxisConfigStore, AxisConfig, true>(
    createAxisConfigStore,
    `${direction}ConfigContext`,
    true,
  ),
);

export {
  ColumnConfigProvider,
  RowConfigProvider,
  useColumnConfig,
  useColumnConfigHistory,
  useRowConfig,
  useRowConfigHistory
};

