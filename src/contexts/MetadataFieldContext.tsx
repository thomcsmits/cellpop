import React, { PropsWithChildren, useState } from "react";
import { createContext, useContext } from "../utils/context";
import { Setter } from "../utils/types";

interface MetadataFieldContextType {
  metadataField: string;
  setMetadataField: Setter<string>;
}
const MetadataFieldContext = createContext<MetadataFieldContextType | null>(
  "MetadataField",
);
export const useMetadataField = () => useContext(MetadataFieldContext);

export function MetadataFieldProvider({ children }: PropsWithChildren) {
  const [metadataField, setMetadataField] = useState<string>("None");

  return (
    <MetadataFieldContext.Provider value={{ metadataField, setMetadataField }}>
      {children}
    </MetadataFieldContext.Provider>
  );
}
