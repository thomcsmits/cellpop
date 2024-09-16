import React, { PropsWithChildren } from "react";
import { useXScale, useYScale } from "../contexts/ScaleContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";

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
import { SortOrder } from "../hooks/useOrderedArray";
import { Setter } from "../utils/types";

interface DragOverlayContainerProps extends PropsWithChildren {
  items: string[];
  setItems: Setter<string[]>;
  setSort: Setter<SortOrder>;
}

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

  const gridSize = selectedDimension === "X" ? x.bandwidth() : y.bandwidth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDrag(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      setSort("Custom");
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragMove={handleDrag}
      modifiers={[createSnapModifier(gridSize), restrictToParentElement]}
    >
      <SortableContext items={items} strategy={strategy}>
        {children}
        <DragOverlay />
      </SortableContext>
    </DndContext>
  );
}

export default DragOverlayContainer;
