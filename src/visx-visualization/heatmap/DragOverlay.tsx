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
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  pointerWithin,
  rectIntersection,
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

function customCollisionDetectionAlgorithm(args) {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args);
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

  const { snapModifier, strategy } = useMemo(() => {
    const scale = selectedDimension === "X" ? x : y;
    const gridSize = scale.bandwidth();
    const snapModifier = createSnapModifier(gridSize);
    const strategy =
      selectedDimension === "X"
        ? verticalListSortingStrategy
        : horizontalListSortingStrategy;
    return {
      snapModifier,
      strategy,
    };
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
      collisionDetection={customCollisionDetectionAlgorithm}
      onDragStart={startDrag}
      onDragCancel={cancelDrag}
      onDragMove={handleDrag}
      onDragEnd={handleDrag}
      modifiers={[snapModifier, restrictToParentElement]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.BeforeDragging,
        },
      }}
    >
      <SortableContext items={items} strategy={strategy}>
        {items.map((item) => (
          <DragIndicator key={item} item={item} />
        ))}
        {children}
      </SortableContext>
    </DndContext>
  );
}

function DragIndicator({ item }: { item: string }) {
  const { selectedDimension } = useSelectedDimension();
  const { width, height } = useHeatmapDimensions();
  const { scale: x } = useXScale();
  const { scale: y } = useYScale();

  const { columnSizes, rowSizes } = useDimensions();
  const { dataMap } = useData();

  const xOffset = columnSizes[0];
  const yOffset = rowSizes[0];

  const { itemHeight, itemWidth, left, top } = useMemo(() => {
    const itemHeight = selectedDimension === "X" ? height : x.bandwidth();
    const itemWidth = selectedDimension === "X" ? y.bandwidth() : width;
    const left = selectedDimension === "X" ? x(item) : 0;
    const top = selectedDimension === "X" ? 0 : y(item);
    return { itemHeight, itemWidth, left, top };
  }, [selectedDimension, x, y, width, height]);

  const { theme } = useCellPopTheme();
  const { label: rowLabel } = useRowConfig();
  const { label: columnLabel } = useColumnConfig();

  const strategy =
    selectedDimension === "X"
      ? verticalListSortingStrategy
      : horizontalListSortingStrategy;
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
  } = useSortable({
    id: item,
    strategy,
  });
  const parentRef = useParentRef();
  const { openTooltip } = useSetTooltipData();

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const visualizationBounds = parentRef.current?.getBoundingClientRect();
      if (!visualizationBounds) {
        return;
      }
      const xValue = e.clientX - xOffset - visualizationBounds.left;
      const yValue = e.clientY - yOffset - visualizationBounds.top;
      const xStep = x.bandwidth();
      const yStep = y.bandwidth();
      const yIndex = Math.floor(xValue / xStep);
      const xIndex = Math.floor(yValue / yStep);

      const rowKey = y.domain()[xIndex];
      const columnKey = x.domain()[yIndex];
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
    [x, y, xOffset, yOffset, dataMap, rowLabel, columnLabel],
  );
  return (
    <div
      key={item}
      style={{
        width: itemWidth,
        height: itemHeight,
        position: "absolute",
        zIndex: 1,
        left,
        top,
        outline: isDragging ? `1px solid ${theme.text}` : "none",
        // transform: CSS.Transform.toString(transform),
        // transition,
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseMove={onMouseMove}
    ></div>
  );
}

export default DragOverlayContainer;
