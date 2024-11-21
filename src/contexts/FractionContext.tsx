import { createStore } from "zustand";
import { createStoreContext } from "../utils/zustand";

interface FractionProps {
  initialFraction?: boolean;
}
interface FractionStore {
  fraction: boolean;
  setFraction: (fraction: boolean) => void;
}

const createFractionStore = ({
  initialFraction = false,
}: {
  initialFraction: boolean;
}) => {
  return createStore<FractionStore>((set) => ({
    fraction: initialFraction,
    setFraction: (fraction: boolean) => set({ fraction }),
  }));
};

export const [FractionProvider, useFraction] = createStoreContext<
  FractionStore,
  FractionProps
>(createFractionStore, "FractionContext");
