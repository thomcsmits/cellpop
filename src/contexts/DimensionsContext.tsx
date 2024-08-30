import React, { PropsWithChildren, useState } from "react";
import { CellPopDimensions } from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";
import { Setter } from "../utils/types";

interface DimensionsContextType {
  dimensions: CellPopDimensions;
  setDimensions: Setter<CellPopDimensions>;
}

const DimensionsContext = createContext<DimensionsContextType | null>(
  "CellPopDimensions",
);
export const useDimensions = () => useContext(DimensionsContext);

export function DimensionsProvider({
  children,
  dimensions: initialDimensions,
}: PropsWithChildren<{ dimensions: CellPopDimensions }>) {
  const [dimensions, setDimensions] = useState(initialDimensions);
  return (
    <DimensionsContext.Provider value={{ dimensions, setDimensions }}>
      {children}
    </DimensionsContext.Provider>
  );
}
