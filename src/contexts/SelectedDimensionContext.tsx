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
  return createStore<SelectedDimensionContext>((set) => ({
    selectedDimension: initialSelectedDimension,
    setSelectedDimension: (dimension: "X" | "Y") =>
      set({ selectedDimension: dimension }),
  }));
};

const [SelectedDimensionProvider, useSelectedDimension] = createStoreContext<
  SelectedDimensionContext,
  SelectedDimensionContextProps
>(createSelectedDimensionContext, "SelectedDimensionContext");

export { SelectedDimensionProvider, useSelectedDimension };
