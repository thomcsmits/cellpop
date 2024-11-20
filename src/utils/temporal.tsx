import type { TemporalState } from "zundo";
import { useStoreWithEqualityFn } from "zustand/traditional";

function useTemporalStore<T>(): TemporalState<T>;
function useTemporalStore<T>(selector: (state: TemporalState<T>) => T): T;
function useTemporalStore<T>(
  selector: (state: TemporalState<T>) => T,
  equality: (a: T, b: T) => boolean,
): T;
function useTemporalStore<T>(
  selector?: (state: TemporalState<T>) => T,
  equality?: (a: T, b: T) => boolean,
) {
  return useStoreWithEqualityFn(useStoreWithUndo.temporal, selector!, equality);
}

export { useTemporalStore };
