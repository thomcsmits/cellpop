import React, { PropsWithChildren, useState } from "react";
import { createContext, useContext } from "../utils/context";
interface SelectedScaleContext {
  selectedDimension: "X" | "Y";
  setSelectedDimension: (dimension: "X" | "Y") => void;
}

const SelectedDimensionContext = createContext<SelectedScaleContext>(
  "SelectedDimensionContext",
);

export const useSelectedDimension = () => useContext(SelectedDimensionContext);

export const SelectedDimensionProvider = ({ children }: PropsWithChildren) => {
  const [selectedDimension, setSelectedDimension] = useState<"X" | "Y">("X");
  return (
    <SelectedDimensionContext.Provider
      value={{ selectedDimension, setSelectedDimension }}
    >
      {children}
    </SelectedDimensionContext.Provider>
  );
};
