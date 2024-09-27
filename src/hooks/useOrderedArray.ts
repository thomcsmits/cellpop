import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [sortOrder, setSortOrder] = useState<SortOrder>("Custom");

  useEffect(() => {
    if (filteredValues) {
      setOrderedValues((ordered) =>
        ordered.filter((value) => !filteredValues.has(value)),
      );
    } else {
      setOrderedValues(values);
    }
  }, [filteredValues, values]);
  const previousSortOrder = useRef<SortOrder>("Custom");

  useEffect(() => {
    if (sortOrder !== previousSortOrder.current) {
      startTransition(() => {
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
      });
    }
  }, [values, counts, sortOrder]);

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
      sortOrder,
      setSortOrder,
      moveToStart,
      moveToEnd,
    },
  ] as const;
}
