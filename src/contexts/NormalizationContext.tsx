import { temporal } from "zundo";
import { createStore } from "zustand";
import { createTemporalStoreContext } from "../utils/zustand";

interface NormalizationProps {
  initialNormalization?: Normalization;
}

export type Normalization = "None" | "Row" | "Column";

export const NORMALIZATIONS = ["None", "Row", "Column"] as const;

interface NormalizationStore {
  normalization: Normalization;
  normalizeByRow: () => void;
  normalizeByColumn: () => void;
  removeNormalization: () => void;
  setNormalization: (normalization: Normalization) => void;
}

const createNormalizationStore = ({
  initialNormalization = "None",
}: NormalizationProps) => {
  return createStore<NormalizationStore>()(
    temporal((set) => ({
      normalization: initialNormalization,
      normalizeByRow: () => set({ normalization: "Row" }),
      normalizeByColumn: () => set({ normalization: "Column" }),
      removeNormalization: () => set({ normalization: "None" }),
      setNormalization: (normalization: Normalization) =>
        set({ normalization }),
    })),
  );
};

export const [
  NormalizationProvider,
  useNormalization,
  ,
  useNormalizationHistory,
] = createTemporalStoreContext<NormalizationStore, NormalizationProps>(
  createNormalizationStore,
  "NormalizationStore",
);

export const useIsNormalized = () => {
  const normalization = useNormalization((state) => state.normalization);
  return normalization !== "None";
};
