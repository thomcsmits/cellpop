import React, { PropsWithChildren, useState } from "react";
import { createContext, useContext } from "../utils/context";
import { Setter } from "../utils/types";

interface FractionContextType {
  fraction: boolean;
  setFraction: Setter<boolean>;
}
const FractionContext = createContext<FractionContextType | null>("Fraction");
export const useFraction = () => useContext(FractionContext);

export function FractionProvider({ children }: PropsWithChildren) {
  const [fraction, setFraction] = useState<boolean>(false);

  return (
    <FractionContext.Provider value={{ fraction, setFraction }}>
      {children}
    </FractionContext.Provider>
  );
}
