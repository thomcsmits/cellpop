import { createContext, useContext } from "../utils/context";

const ParentRefContext = createContext<React.RefObject<HTMLDivElement> | null>(
  "Visualization Container Context",
);

export function useParentRef() {
  return useContext(ParentRefContext);
}

export const ParentRefProvider = ParentRefContext.Provider;
