import { useCallback, useEffect, useState } from "react";

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
  filteredValues?: Set<T>,
) {
  const [orderedValues, setOrderedValues] = useState<T[]>(values);
  const [sortOrder, _setSortOrder] = useState<SortOrder>("Custom");

  useEffect(() => {
    if (filteredValues?.size > 0) {
      setOrderedValues((ordered) =>
        ordered.filter((value) => !filteredValues.has(value)),
      );
    } else {
      setOrderedValues(values);
    }
  }, [filteredValues, values]);

  const setSortOrder = useCallback((order: SortOrder) => {
    setOrderedValues((ordered) => {
      switch (order) {
        case "Alphabetical Ascending":
          return [...ordered].sort();
        case "Alphabetical Descending":
          return [...ordered].sort().reverse();
        case "Counts Ascending":
          return [...ordered].sort((a, b) => counts[a] - counts[b]);
        case "Counts Descending":
          return [...ordered].sort((a, b) => counts[b] - counts[a]);
        default:
          return ordered;
      }
    });
    _setSortOrder(order);
  }, []);

  const moveToStart = useCallback((value: T) => {
    setOrderedValues((ordered) => {
      const index = ordered.indexOf(value);
      if (index === -1) {
        return ordered;
      }
      return [value, ...ordered.slice(0, index), ...ordered.slice(index + 1)];
    });
  }, []);

  const moveToEnd = useCallback((value: T) => {
    setOrderedValues((ordered) => {
      const index = ordered.indexOf(value);
      if (index === -1) {
        return ordered;
      }
      return [...ordered.slice(0, index), ...ordered.slice(index + 1), value];
    });
  }, []);

  return [
    orderedValues,
    {
      setOrderedValues,
      sortOrder, // Still reporting this to indicate current sort in context menu
      setSortOrder,
      moveToStart,
      moveToEnd,
    },
  ] as const;
}
