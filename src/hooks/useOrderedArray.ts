import { useCallback, useEffect, useMemo, useState } from "react";

export type SortOrder =
  | "Alphabetical Ascending"
  | "Alphabetical Descending"
  | "Counts Ascending"
  | "Counts Descending"
  | "Custom"
  | `${string} Ascending`
  | `${string} Descending`;

export const SORT_ORDERS: SortOrder[] = [
  "Custom",
  "Alphabetical Ascending",
  "Alphabetical Descending",
  "Counts Ascending",
  "Counts Descending",
];

export function useOrderedArrayState<
  T extends string | number,
  MData extends object = object,
>(
  values: T[] = [],
  counts?: Record<T, number>,
  filteredValues?: Set<T>,
  metadata: Record<T, MData> = {} as Record<T, MData>,
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

  const metadataKeys: string[] = useMemo(() => {
    const metadataValues = Object.values(metadata);
    const set = metadataValues.reduce<Set<string>>(
      (acc: Set<string>, curr: object) => {
        Object.keys(curr).forEach((key) => {
          acc.add(key);
        });
        return acc;
      },
      new Set<string>(),
    );
    return [...set];
  }, [metadata]);

  const sortOrders: SortOrder[] = useMemo(
    () => [
      ...SORT_ORDERS,
      ...metadataKeys.flatMap((key) => [
        `${key} Ascending` as SortOrder,
        `${key} Descending` as SortOrder,
      ]),
    ],
    [metadata],
  );

  const setSortOrder = useCallback(
    (order: SortOrder) => {
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
          case `${order.split(" Ascending")[0]} Ascending`:
            return [...ordered].sort((a, b) => {
              const metadataKey = order.split(" Ascending")[0] as keyof MData;
              const aValue = metadata[a][metadataKey];
              const bValue = metadata[b][metadataKey];
              if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue);
              }
              if (aValue > bValue) {
                return 1;
              }
              if (aValue < bValue) {
                return -1;
              }
              return 0;
            });
          case `${order.split(" Descending")[0]} Descending`:
            return [...ordered].sort((a: T, b: T) => {
              const metadataKey = order.split(" Descending")[0] as keyof MData;
              const aValue = metadata[a][metadataKey] as string | number;
              const bValue = metadata[b][metadataKey] as string | number;
              if (typeof aValue === "string" && typeof bValue === "string") {
                return bValue.localeCompare(aValue);
              }
              if (aValue < bValue) {
                return 1;
              }
              if (aValue > bValue) {
                return -1;
              }
              return 0;
            });
          default:
            return ordered;
        }
      });
      _setSortOrder(order);
    },
    [metadata],
  );

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

  const selectedMetadata: string | undefined = useMemo(() => {
    if (!SORT_ORDERS.includes(sortOrder)) {
      if (sortOrder.includes("Ascending")) {
        return sortOrder.split(" Ascending")[0];
      } else if (sortOrder.includes("Descending")) {
        return sortOrder.split(" Descending")[0];
      }
    }
    return undefined;
  }, [sortOrder]);

  return [
    orderedValues,
    {
      setOrderedValues,
      sortOrder, // Still reporting this to indicate current sort in context menu
      setSortOrder,
      moveToStart,
      moveToEnd,
      sortOrders,
      metadataKeys,
      selectedMetadata,
    },
  ] as const;
}
