import { temporal } from "zundo";
import { createStore } from "zustand";
import { createTemporalStoreContext } from "../utils/zustand";

interface FractionProps {
  initialFraction?: boolean;
}
interface FractionStore {
  fraction: boolean;
  setFraction: (fraction: boolean) => void;
}

const createFractionStore = ({ initialFraction = false }: FractionProps) => {
  return createStore<FractionStore>()(
    temporal((set) => ({
      fraction: initialFraction,
      setFraction: (fraction: boolean) => set({ fraction }),
    })),
  );
};

export const [FractionProvider, useFraction, , useFractionHistory] =
  createTemporalStoreContext<FractionStore, FractionProps>(
    createFractionStore,
    "FractionContext",
  );
