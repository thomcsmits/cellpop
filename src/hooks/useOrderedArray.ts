import { useEffect, useRef, useState } from "react";
import { useSet } from "./useSet";

export type SortOrder =
  | "Alphabetical Ascending"
  | "Alphabetical Descending"
  | "Counts Ascending"
  | "Counts Descending"
  | "Custom";

export const SORT_ORDERS: SortOrder[] = [
  "Custom",
  "Alphabetical Ascending",
  "Alphabetical Descending",
  "Counts Ascending",
  "Counts Descending",
];

export function useOrderedArrayState<T extends string | number>(
  values: T[] = [],
  counts?: Record<T, number>,
) {
  const [orderedValues, setOrderedValues] = useState<T[]>(values);
  const [sortOrder, setSortOrder] = useState<SortOrder>("Custom");

  const {
    set: removedValues,
    add: removeValue,
    reset: resetRemovedValues,
  } = useSet<T>();

  const previousSortOrder = useRef<SortOrder>("Custom");

  useEffect(() => {
    if (sortOrder !== previousSortOrder.current) {
      previousSortOrder.current = sortOrder;
      switch (sortOrder) {
        case "Alphabetical Ascending":
          setOrderedValues([...values].sort());
          break;
        case "Alphabetical Descending":
          setOrderedValues([...values].sort().reverse());
          break;
        case "Counts Ascending":
          setOrderedValues([...values].sort((a, b) => counts[a] - counts[b]));
          break;
        case "Counts Descending":
          setOrderedValues([...values].sort((a, b) => counts[b] - counts[a]));
          break;
      }
    }
  }, [values, counts, sortOrder]);

  return [
    orderedValues,
    { setOrderedValues, sortOrder, setSortOrder },
  ] as const;
}
