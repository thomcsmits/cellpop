import React, { CSSProperties } from "react";
import { SortOrder } from "../../hooks/useOrderedArray";
import { Setter } from "../../utils/types";

interface AxisButtonsProps {
  axis: "X" | "Y";
  setSortOrder: Setter<SortOrder>;
  sortOrders: SortOrder[];
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
      {sortOrders.map((order) => (
        <button
          key={order}
          onClick={() => {
            setSortOrder(order);
          }}
        >
          {order
            .split("_")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ")}
        </button>
      ))}
    </div>
  );
}
