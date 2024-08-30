import React, { PropsWithChildren, useState } from "react";

import { createContext, useContext } from "../utils/context";

import { Setter } from "../utils/types";

interface BoundaryContextType {
  boundary: boolean;
  setBoundary: Setter<boolean>;
}

const BoundaryContext = createContext<BoundaryContextType | null>("Boundary");
export const useBoundary = () => useContext(BoundaryContext);

export function BoundaryProvider({ children }: PropsWithChildren) {
  const [boundary, setBoundary] = useState<boolean>(false);

  return (
    <BoundaryContext.Provider value={{ boundary, setBoundary }}>
      {children}
    </BoundaryContext.Provider>
  );
}
