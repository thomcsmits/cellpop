import React, { PropsWithChildren } from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useHeatmapDimensions } from "../contexts/DimensionsContext";
import { useXScale, useYScale } from "../contexts/ScaleContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";
import { useTooltipData } from "../contexts/TooltipDataContext";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useColumns, useRows } from "../contexts/AxisOrderContext";

function DragOverlayContainer({ children }: PropsWithChildren) {
  const { width, height } = useHeatmapDimensions();

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

  function handleDragEnd(event: DragEndEvent) {
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
      onDragMove={handleDragEnd}
      onDragEnd={handleDragEnd}
      modifiers={[createSnapModifier(gridSize), restrictToParentElement]}
    >
      <SortableContext items={items} strategy={strategy}>
        <div
          className="drag-overlay"
          style={{
            height,
            width,
            top: 0,
            left: 0,
            position: "absolute",
            pointerEvents: "none",
          }}
        >
          {children}
          <DragOverlay />
        </div>
      </SortableContext>
    </DndContext>
  );
}

function Draggable() {
  const { selectedDimension } = useSelectedDimension();
  const { tooltipData } = useTooltipData();

  const { width, height } = useHeatmapDimensions();
  const { theme } = useCellPopTheme();

  const { scale: x } = useXScale();
  const { scale: y } = useYScale();

  if (!tooltipData) {
    return null;
  }

  const positionKey = (
    selectedDimension === "X" ? tooltipData.data.column : tooltipData.data.row
  ) as string;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: positionKey,
      strategy:
        selectedDimension === "X"
          ? horizontalListSortingStrategy
          : verticalListSortingStrategy,
    });

  if (!positionKey) {
    return null;
  }

  const outline = `1px solid ${theme.text}`;

  const left = selectedDimension === "X" ? x(positionKey) : 0;
  const top = selectedDimension === "X" ? 0 : y(positionKey);
  const widthValue = selectedDimension === "X" ? x.bandwidth() : width;
  const heightValue = selectedDimension === "X" ? height : y.bandwidth();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      tabIndex={0}
      style={{
        cursor: "pointer",
        position: "absolute",
        top,
        left,
        width: widthValue,
        height: heightValue,
        outline,
        pointerEvents: "all",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    />
  );
}

export default function DragOverlayDisplay() {
  return (
    <DragOverlayContainer>
      <Draggable />
    </DragOverlayContainer>
  );
}
