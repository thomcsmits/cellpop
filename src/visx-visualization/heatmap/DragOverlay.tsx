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
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  createSnapModifier,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortOrder } from "../../hooks/useOrderedArray";
import { Setter } from "../../utils/types";

interface DragOverlayContainerProps extends PropsWithChildren {
  items: string[];
  setItems: Setter<string[]>;
  setSort: Setter<SortOrder>;
}

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

  const strategy =
    selectedDimension === "X"
      ? verticalListSortingStrategy
      : horizontalListSortingStrategy;

  const snapModifier = useMemo(() => {
    const gridSize = selectedDimension === "X" ? x.bandwidth() : y.bandwidth();
    return createSnapModifier(gridSize);
  }, [selectedDimension, x, y]);

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

      startTransition(() => {
        setSort("Custom");
        setItems((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);

          return arrayMove(items, oldIndex, newIndex);
        });
      });
    },
    [setItems, setSort],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={startDrag}
      onDragCancel={cancelDrag}
      onDragMove={handleDrag}
      onDragEnd={startDrag}
      modifiers={[snapModifier, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={strategy}>
        {children}
        <DragOverlay />
      </SortableContext>
    </DndContext>
  );
}

export default DragOverlayContainer;
