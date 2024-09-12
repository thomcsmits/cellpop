import React, { PropsWithChildren, useCallback, useState } from "react";
import { createContext, useContext } from "../utils/context";
import { Setter } from "../utils/types";

export interface Dimensions {
  width: number;
  height: number;
}

type VerticalPanelSection = "top" | "middle" | "bottom";
const verticalPanelSections: VerticalPanelSection[] = [
  "top",
  "middle",
  "bottom",
];
type HorizontalPanelSection = "left" | "center" | "right";
const horizontalPanelSections: HorizontalPanelSection[] = [
  "left",
  "center",
  "right",
];
type MappedPanelSection = `${HorizontalPanelSection}_${VerticalPanelSection}`;
const mappedPanelSections: MappedPanelSection[] =
  horizontalPanelSections.flatMap((h) => {
    return verticalPanelSections.map((v) => `${h}_${v}` as MappedPanelSection);
  });

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
  setDimensions: Setter<GlobalDimensions>;
  setDimension: (section: MappedPanelSection, value: Dimensions) => void;
  setSideWidth: (side: HorizontalPanelSection, width: number) => void;
}

const DimensionsContext = createContext<DimensionsContextType | null>(
  "CellPopDimensions",
);

const initialWidthHeight = { width: 0, height: 0 };

const initialPanelDimensions = Object.fromEntries(
  mappedPanelSections.map((section) => {
    return [section, initialWidthHeight] as const;
  }),
) as Record<MappedPanelSection, Dimensions>;

export function DimensionsProvider({
  children,
  dimensions: initialDimensions,
}: PropsWithChildren<{ dimensions: Dimensions }>) {
  const [dimensions, setDimensions] = useState<GlobalDimensions>({
    ...initialDimensions,
    ...initialPanelDimensions,
  });

  const setDimension = useCallback(
    (section: MappedPanelSection, value: Dimensions) => {
      setDimensions((prev) => {
        return { ...prev, [section]: value };
      });
    },
    [setDimensions],
  );

  const setSideWidth = useCallback(
    (side: HorizontalPanelSection, value: number) => {
      const sections = verticalPanelSections.map(
        (v) => `${side}_${v}` as MappedPanelSection,
      );
      setDimensions((prev) => {
        const next = { ...prev };
        sections.forEach((section) => {
          next[section].width = value;
        });
        return next;
      });
    },
    [setDimensions],
  );

  return (
    <DimensionsContext.Provider
      value={{
        dimensions,
        setDimensions,
        setDimension,
        setSideWidth,
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
