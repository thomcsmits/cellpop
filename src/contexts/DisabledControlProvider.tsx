import React, { PropsWithChildren } from "react";
import { createContext, useContext } from "../utils/context";

export type DisableableControls =
  | "fraction"
  | "selection"
  | "theme"
  | "normalization";

interface DisabledControlContextType {
  disabledControls: DisableableControls[];
}

const DisabledControlContext = createContext<DisableableControls[]>(
  "DisabledControlContext",
);

export const useDisabledControls = () => useContext(DisabledControlContext);

export const useThemeControlIsDisabled = () =>
  useDisabledControls().includes("theme");

export const useFractionControlIsDisabled = () =>
  useDisabledControls().includes("fraction");

export const useSelectionControlIsDisabled = () =>
  useDisabledControls().includes("selection");

export const useNormalizationControlIsDisabled = () =>
  useDisabledControls().includes("normalization");

export function DisabledControlProvider({
  children,
  disabledControls,
}: PropsWithChildren<DisabledControlContextType>) {
  return (
    <DisabledControlContext.Provider value={disabledControls}>
      {children}
    </DisabledControlContext.Provider>
  );
}
