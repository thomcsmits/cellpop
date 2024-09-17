import React, { CSSProperties } from "react";
import { SORT_ORDERS, SortOrder } from "../hooks/useOrderedArray";
import { Setter } from "../utils/types";

interface AxisButtonsProps {
  axis: "X" | "Y";
  setSortOrder: Setter<SortOrder>;
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
 * @returns The AxisButtons component.
 */
export function AxisButtons({ setSortOrder, axis }: AxisButtonsProps) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        ...positionProps[axis],
      }}
    >
      {SORT_ORDERS.map((order) => (
        <button
          key={order}
          onClick={() => {
            setSortOrder(order);
          }}
        >
          {order}
        </button>
      ))}
    </div>
  );
}
