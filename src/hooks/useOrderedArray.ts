import { useCallback, useEffect, useMemo, useState } from "react";

export function useOrderedArrayState<T>(
  values: T[] = [],
  sortOrder?: (a: T, b: T) => number,
) {
  const [orderedValues, setOrderedValues] = useState<T[]>(values);

  // TODO: Implement sorting
  // const sorting = Boolean(sortOrder);

  const move = useCallback((from: number, to: number) => {
    setOrderedValues((prev) => {
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

  return [orderedValues, { moveUp, moveDown, move, setOrderedValues }] as const;
}
