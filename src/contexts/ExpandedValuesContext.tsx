import { temporal } from "zundo";
import { createStore } from "zustand";
import { createStoreContext } from "../utils/zustand";

interface SelectedValuesContextProps {
  initialSelectedValues: string[];
}
interface SelectedValuesStore {
  selectedValues: Set<string>;
  toggleValue: (value: string) => void;
}

const createSelectedValuesContext = ({
  initialSelectedValues,
}: SelectedValuesContextProps) => {
  return createStore<SelectedValuesStore>()(
    temporal((set) => ({
      selectedValues: new Set(initialSelectedValues),
      toggleValue: (value: string) => {
        set((state) => {
          const selectedValues = new Set(state.selectedValues);
          if (selectedValues.has(value)) {
            selectedValues.delete(value);
          } else {
            selectedValues.add(value);
          }
          return { selectedValues };
        });
      },
    })),
  );
};

export const [SelectedValuesProvider, useSelectedValues] = createStoreContext<
  SelectedValuesStore,
  SelectedValuesContextProps,
  true
>(createSelectedValuesContext, "SelectedValuesContext", true);
