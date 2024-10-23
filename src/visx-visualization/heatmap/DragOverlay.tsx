import React, {
  PropsWithChildren,
  startTransition,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useXScale, useYScale } from "../../contexts/ScaleContext";
import { useSelectedDimension } from "../../contexts/SelectedDimensionContext";

import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ScaleBand } from "d3";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useParentRef } from "../../contexts/ContainerRefContext";
import { useData } from "../../contexts/DataContext";
import {
  useDimensions,
  useHeatmapDimensions,
} from "../../contexts/DimensionsContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import { SortOrder } from "../../hooks/useOrderedArray";
import { Setter } from "../../utils/types";

interface DragOverlayContainerProps extends PropsWithChildren {
  items: string[];
  setItems: Setter<string[]>;
  setSort: Setter<SortOrder>;
}
const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args);
};

const indicatorProps = (
  x: ScaleBand<string>,
  y: ScaleBand<string>,
  width: number,
  height: number,
) => ({
  X: {
    width: x.bandwidth(),
    height,
    left: (item: string) => x(item),
    top: () => 0,
  },
  Y: {
    width,
    // @ts-expect-error - y.bandwidth(string) is a custom method on the scale
    height: (item: string) => y.bandwidth(item),
    left: () => 0,
    top: (item: string) => y(item),
  },
});

/**
 * Wrapper for the heatmap which allows for dragging and dropping of rows or columns.
 * @param props.items The items to be sorted.
 * @param props.setItems Setter for the items.
 * @param props.setSort Setter for the sort order. Used to reset the sort order when custom sorting is applied.
 * @returns
 */
function DragOverlayContainer({
  children,
  items,
  setItems,
  setSort,
}: DragOverlayContainerProps) {
  const { selectedDimension } = useSelectedDimension();

  const { scale: x } = useXScale();
  const { scale: y } = useYScale();
  const { width, height } = useHeatmapDimensions();

  const strategy = useMemo(() => {
    return selectedDimension === "X"
      ? verticalListSortingStrategy
      : horizontalListSortingStrategy;
  }, [selectedDimension]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const initialItemOrder = useRef<string[]>(items);
  const lastOver = useRef<string | number | null>(null);

  const startDrag = useCallback(() => {
    initialItemOrder.current = items;
    lastOver.current = null;
  }, [items]);

  const cancelDrag = useCallback(() => {
    startTransition(() => {
      setItems(initialItemOrder.current);
    });
  }, [setItems]);

  const handleDrag = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id || lastOver.current === over.id) {
        return;
      }

      lastOver.current = over.id;

      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    },
    [setItems, setSort],
  );

  if (items.length === 0) {
    return children;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetectionAlgorithm}
      onDragStart={startDrag}
      onDragCancel={cancelDrag}
      onDragMove={handleDrag}
      onDragEnd={handleDrag}
      modifiers={[restrictToParentElement]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.BeforeDragging,
        },
      }}
    >
      <SortableContext items={items} strategy={strategy}>
        {items.map((item) => (
          <DragIndicator
            key={item}
            item={item}
            {...indicatorProps(x, y, width, height)[selectedDimension]}
          />
        ))}
        {children}
      </SortableContext>
    </DndContext>
  );
}

function DragIndicator({
  item,
  width: itemWidth,
  height: itemHeight,
  left,
  top,
}: {
  item: string;
  width: number;
  height: number | ((item: string) => number);
  left: (item: string) => number;
  top: (item: string) => number;
}) {
  const { selectedDimension } = useSelectedDimension();
  const { scale: x } = useXScale();
  const { scale: y } = useYScale();

  const { columnSizes, rowSizes } = useDimensions();
  const { dataMap } = useData();

  const xOffset = columnSizes[0];
  const yOffset = rowSizes[0];

  const { theme } = useCellPopTheme();
  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();
  const { width, height } = useHeatmapDimensions();

  const strategy =
    selectedDimension === "X"
      ? verticalListSortingStrategy
      : horizontalListSortingStrategy;
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: item,
    strategy,
  });
  const parentRef = useParentRef();
  const { openTooltip, closeTooltip } = useSetTooltipData();

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const visualizationBounds = parentRef.current?.getBoundingClientRect();
      if (!visualizationBounds) {
        return;
      }
      const xValue = e.clientX - xOffset - visualizationBounds.left;

      const visualizationTotalHeight =
        yOffset + height + visualizationBounds.top;
      const yMousePosition = e.clientY;
      const yValue = height - (visualizationTotalHeight - yMousePosition);

      const columnCount = x.domain().length;
      const xStep = x.bandwidth();

      // Clamp indices to prevent out of bounds errors
      const columnIndex = Math.min(
        Math.max(Math.floor(xValue / xStep), 0),
        columnCount - 1,
      );

      // @ts-expect-error - y lookup is a custom method on the scale, added in
      // ScaleContext. We should consider extending the d3 scale type to include
      // this method.
      const rowKey = y.lookup(yValue);
      const columnKey = x.domain()[columnIndex];

      if (!rowKey || !columnKey) {
        return;
      }

      openTooltip(
        {
          title: `${rowKey} - ${columnKey}`,
          data: {
            "Cell Count": dataMap[`${rowKey}-${columnKey}`],
            [rowLabel]: rowKey,
            [columnLabel]: columnKey,
          },
        },
        e.clientX,
        e.clientY,
      );
    },
    [x, y, xOffset, yOffset, dataMap, rowLabel, columnLabel, width, height],
  );

  return (
    <div
      key={item}
      style={{
        width: itemWidth,
        height: itemHeight instanceof Function ? itemHeight(item) : itemHeight,
        position: "absolute",
        zIndex: 1,
        left: left(item),
        top: top(item),
        outline: isDragging ? `1px solid ${theme.text}` : "none",
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseMove={onMouseMove}
      onMouseOut={closeTooltip}
    ></div>
  );
}

export default DragOverlayContainer;
