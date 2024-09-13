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

import { useColumns, useRows } from "../contexts/AxisOrderContext";

function DragOverlayContainer({ children }: PropsWithChildren) {
  const [columns, { setOrderedValues: setColumns }] = useColumns();
  const [rows, { setOrderedValues: setRows }] = useRows();
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

  const [items, setItems] =
    selectedDimension === "X" ? [columns, setColumns] : [rows, setRows];

  function handleDrag(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
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
