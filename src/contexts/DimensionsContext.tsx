import React, { PropsWithChildren, useCallback, useState } from "react";
import { createContext, useContext } from "../utils/context";
import { Setter } from "../utils/types";

export interface Dimensions {
  width: number;
  height: number;
}

type VerticalPanelSection = "top" | "middle" | "bottom";
type HorizontalPanelSection = "left" | "center" | "right";
type MappedPanelSection = `${HorizontalPanelSection}_${VerticalPanelSection}`;

interface DimensionsContextType extends Dimensions {
  columnSizes: GridSizeTuple;
  rowSizes: GridSizeTuple;
  resizeColumn: (newSize: number, index: number) => void;
  resizeRow: (newSize: number, index: number) => void;
}

const DimensionsContext = createContext<DimensionsContextType | null>(
  "CellPopDimensions",
);

type GridSizeTuple = [number, number, number];

// Helper function to get the initial size of the panels
function getInitialSize(total: number) {
  return [0.3 * total, 0.4 * total, 0.3 * total] as GridSizeTuple;
}

/**
 * Main provider for visualization dimensions
 * @param props.dimensions Initial dimensions for the visualization
 */
export function DimensionsProvider({
  children,
  dimensions: { width, height },
}: PropsWithChildren<{ dimensions: Dimensions & Partial<GlobalDimensions> }>) {
  const [columnSizes, setColumnSizes] = useState<GridSizeTuple>(
    getInitialSize(width),
  );
  const [rowSizes, setRowSizes] = useState<GridSizeTuple>(
    getInitialSize(height),
  );

  const resize = useCallback(
    (setter: Setter<GridSizeTuple>) => (newSize: number, index: number) => {
      setter((prev) => {
        const newSizes = [...prev];
        const oldSize = newSizes[index];
        const totalSize = newSizes.reduce((acc, size) => acc + size, 0);
        switch (index) {
          case 0:
            newSizes[0] = newSize;
            newSizes[1] = newSizes[1] + oldSize - newSize;
            break;
          case 1:
            newSizes[1] = newSize - newSizes[0];
            newSizes[2] = totalSize - newSize;
            break;
        }
        return newSizes as [number, number, number];
      });
    },
    [],
  );

  const resizeColumn = useCallback(resize(setColumnSizes), [resize]);
  const resizeRow = useCallback(resize(setRowSizes), [resize]);

  return (
    <DimensionsContext.Provider
      value={{
        width,
        height,
        columnSizes,
        rowSizes,
        resizeColumn,
        resizeRow,
      }}
    >
      {children}
    </DimensionsContext.Provider>
  );
}

export const useDimensions = () => useContext(DimensionsContext);

export const usePanelDimensions = (section: MappedPanelSection) => {
  const { columnSizes, rowSizes } = useDimensions();
  const [horizontal, vertical] = section.split("_") as [
    HorizontalPanelSection,
    VerticalPanelSection,
  ];
  const column = columnSizes[["left", "center", "right"].indexOf(horizontal)];
  const row = rowSizes[["top", "middle", "bottom"].indexOf(vertical)];
  return { width: column, height: row };
};

export const useHeatmapDimensions = () => usePanelDimensions("center_middle");
