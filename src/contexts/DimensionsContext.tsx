import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { createContext, useContext } from "../utils/context";
import { Setter } from "../utils/types";

export interface Dimensions {
  width: number;
  height: number;
}

type VerticalPanelSection = "top" | "middle" | "bottom";
type HorizontalPanelSection = "left" | "center" | "right";
type MappedPanelSection = `${HorizontalPanelSection}_${VerticalPanelSection}`;

/**
 * Type holding the global width/height and width/height for each panel section.
 * @example {
 *  width: 1000,
 *  height: 800,
 *  left_top: { width: 300, height: 200 },
 *  left_middle: { width: 300, height: 400 },
 *  left_bottom: { width: 300, height: 200 },
 *  center_top: { width: 400, height: 200 },
 *  center_middle: { width: 400, height: 400 },
 *  center_bottom: { width: 400, height: 200 },
 *  right_top: { width: 300, height: 200 },
 *  right_middle: { width: 300, height: 400 },
 *  right_bottom: { width: 300, height: 200 },
 * }
 */
interface GlobalDimensions
  extends Dimensions,
    Record<MappedPanelSection, Dimensions> {}

interface DimensionsContextType {
  dimensions: GlobalDimensions;
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
        console.log({ previousSizes: prev, newSizes });
        return newSizes as [number, number, number];
      });
    },
    [],
  );

  const resizeColumn = useCallback(resize(setColumnSizes), [resize]);
  const resizeRow = useCallback(resize(setRowSizes), [resize]);

  const dimensions = useMemo(() => {
    return {
      width,
      height,
      left_top: { width: columnSizes[0], height: rowSizes[0] },
      left_middle: { width: columnSizes[0], height: rowSizes[1] },
      left_bottom: { width: columnSizes[0], height: rowSizes[2] },
      center_top: { width: columnSizes[1], height: rowSizes[0] },
      center_middle: { width: columnSizes[1], height: rowSizes[1] },
      center_bottom: { width: columnSizes[1], height: rowSizes[2] },
      right_top: { width: columnSizes[2], height: rowSizes[0] },
      right_middle: { width: columnSizes[2], height: rowSizes[1] },
      right_bottom: { width: columnSizes[2], height: rowSizes[2] },
    };
  }, [width, height, columnSizes, rowSizes]);

  return (
    <DimensionsContext.Provider
      value={{
        dimensions,
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

export const useHeatmapDimensions = () =>
  useDimensions().dimensions.center_middle;

export const usePanelDimensions = (section: MappedPanelSection) => {
  return useDimensions().dimensions[section];
};
