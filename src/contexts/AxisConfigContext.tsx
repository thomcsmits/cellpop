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
  return createStore<AxisConfigStore>((set) => ({
    ...initialArgs,
    setLabel: (label: string) => set({ label }),
    setCreateHref: (createHref: (tick: string) => string) =>
      set({ createHref }),
    setFlipAxisPosition: (flipAxisPosition: boolean) =>
      set({ flipAxisPosition }),
  }));
};

const [
  [RowConfigProvider, useRowConfig],
  [ColumnConfigProvider, useColumnConfig],
] = ["Row", "Column"].map((direction) =>
  createStoreContext<AxisConfigStore, AxisConfig>(
    createAxisConfigStore,
    `${direction}ConfigContext`,
  ),
);

export {
  ColumnConfigProvider,
  RowConfigProvider,
  useColumnConfig,
  useRowConfig
};

