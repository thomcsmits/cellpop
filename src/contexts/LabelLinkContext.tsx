import React, { PropsWithChildren, useContext } from "react";
import { createContext } from "../utils/context";

interface LabelLinkContextType {
  createRowHref?: (row: string) => string;
  createColHref?: (col: string) => string;
}

const LabelLinkContext = createContext<LabelLinkContextType>(
  "LabelLinkCreatorContext",
);

export const useRowLinkCreator = () =>
  useContext(LabelLinkContext).createRowHref;
export const useColLinkCreator = () =>
  useContext(LabelLinkContext).createColHref;

export default function LabelLinkProvider({
  children,
  ...props
}: PropsWithChildren<LabelLinkContextType>) {
  return (
    <LabelLinkContext.Provider value={props}>
      {children}
    </LabelLinkContext.Provider>
  );
}
