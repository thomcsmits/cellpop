import React, { PropsWithChildren, Ref } from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useXScale, useYScale } from "../contexts/ScaleContext";
import { useSelectedDimension } from "../contexts/SelectedDimensionContext";
import { useTooltipData } from "../contexts/TooltipDataContext";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createSnapModifier } from "@dnd-kit/modifiers";
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
  const {
    dimensions: {
      heatmap: { offsetHeight, offsetWidth },
    },
  } = useDimensions();

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

    console.log(event, active, over);

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
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[createSnapModifier(gridSize)]}
    >
      <SortableContext items={items} strategy={strategy}>
        {children}
      </SortableContext>
      <DragOverlay />
    </DndContext>
  );
}

function Draggable() {
  const { selectedDimension } = useSelectedDimension();
  const { tooltipData } = useTooltipData();

  const {
    dimensions: {
      heatmap: { height, width },
    },
  } = useDimensions();
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
    });

  if (!positionKey) {
    return null;
  }

  if (selectedDimension === "X") {
    return (
      <rect
        ref={setNodeRef as unknown as Ref<SVGRectElement>}
        x={x(positionKey)}
        y={0}
        width={x.bandwidth()}
        height={height}
        fill={"transparent"}
        stroke={"black"}
        {...attributes}
        {...listeners}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      />
    );
  } else {
    return (
      <rect
        ref={setNodeRef as unknown as Ref<SVGRectElement>}
        x={0}
        y={y(positionKey)}
        width={width}
        height={y.bandwidth()}
        fill={"transparent"}
        stroke={"black"}
        {...attributes}
        {...listeners}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      />
    );
  }
}

export default function DragOverlayDisplay() {
  return (
    <DragOverlayContainer>
      <Draggable />
    </DragOverlayContainer>
  );
}
