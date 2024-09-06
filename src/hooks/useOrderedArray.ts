import { useCallback, useEffect, useMemo, useState } from "react";

export function useOrderedArrayState<T>(
  values: T[] = [],
  sortOrder?: (a: T, b: T) => number,
) {
  const [order, setOrder] = useState<number[]>(values.map((_, i) => i));

  // TODO: Implement sorting
  // const sorting = Boolean(sortOrder);

  // Reset order if input values array changes length
  useEffect(() => {
    setOrder(values.map((_, i) => i));
  }, [values.length]);

  const move = useCallback((from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  const moveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      move(index, index - 1);
    },
    [move],
  );

  const moveDown = useCallback(
    (index: number) => {
      if (index === values.length - 1) return;
      move(index, index + 1);
    },
    [move],
  );

  const orderedValues = useMemo(() => {
    return order.map((i) => values[i]);
  }, [order, values]);

  return [orderedValues, { moveUp, moveDown, move }] as const;
}
