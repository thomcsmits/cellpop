import { temporal } from "zundo";
import { createStore } from "zustand";
import { createStoreContext } from "../utils/zustand";

interface SelectedDimensionContextProps {
  initialSelectedDimension: "X" | "Y";
}

interface SelectedDimensionContext {
  selectedDimension: "X" | "Y";
  setSelectedDimension: (dimension: "X" | "Y") => void;
}

const createSelectedDimensionContext = ({
  initialSelectedDimension,
}: SelectedDimensionContextProps) => {
  return createStore<SelectedDimensionContext>()(
    temporal((set) => ({
      selectedDimension: initialSelectedDimension,
      setSelectedDimension: (dimension: "X" | "Y") =>
        set({ selectedDimension: dimension }),
    })),
  );
};

export const [
  SelectedDimensionProvider,
  useSelectedDimension,
  ,
  useSelectedDimensionHistory,
] = createStoreContext<
  SelectedDimensionContext,
  SelectedDimensionContextProps,
  true
>(createSelectedDimensionContext, "SelectedDimensionContext", true);
