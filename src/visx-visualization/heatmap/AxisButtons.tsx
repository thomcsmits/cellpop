import React, { CSSProperties } from "react";
import { SORT_DIRECTIONS, SortOrder } from "../../contexts/DataContext";

interface AxisButtonsProps {
  axis: "X" | "Y";
  setSortOrder: (order: [SortOrder<string>]) => void;
  sortOrders: string[];
}

const positionProps: Record<"X" | "Y", CSSProperties> = {
  X: {
    bottom: 0,
    flexDirection: "row",
  },
  Y: {
    right: 0,
    top: 0,
    flexDirection: "column",
  },
};

/**
 * Axis-specific controls for setting sorts in the ScaleContext.
 * @param props.setSortOrder Setter for the sort order.
 * @param props.axis The axis to sort.
 * @param props.sortOrders The available sort orders.
 * @returns The AxisButtons component.
 */
export function AxisButtons({
  setSortOrder,
  axis,
  sortOrders,
}: AxisButtonsProps) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        ...positionProps[axis],
      }}
    >
      {sortOrders.flatMap((key) =>
        SORT_DIRECTIONS.map((direction) => (
          <button
            key={`${key}-${direction}`}
            onClick={() => setSortOrder([{ key, direction }])}
          >
            {key} {direction}
          </button>
        )),
      )}
    </div>
  );
}
