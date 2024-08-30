import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import {
  CellPopData,
  CellPopDimensions,
  CellPopTheme,
  CellPopThemeColors,
} from "../cellpop-schema";
import { createContext, useContext } from "../utils/context";
import { getTheme } from "../visualization/theme";
import { ScaleProvider } from "./ScaleContext";

type Setter<T> = Dispatch<SetStateAction<T>>;

interface CellPopConfigProps extends PropsWithChildren {
  data: CellPopData;
  dimensions: CellPopDimensions;
  theme: CellPopTheme;
}

const DataContext = createContext<CellPopData | null>("CellPopData");
export const useData = () => useContext(DataContext);

interface DimensionsContextType {
  dimensions: CellPopDimensions;
  setDimensions: Setter<CellPopDimensions>;
}

const DimensionsContext = createContext<DimensionsContextType | null>(
  "CellPopDimensions",
);
export const useDimensions = () => useContext(DimensionsContext);

interface ThemeContextType {
  theme: CellPopThemeColors;
  currentThemeName: CellPopTheme;
  setTheme: Setter<CellPopTheme>;
}

const ThemeContext = createContext<ThemeContextType | null>(
  "CellPopThemeColors",
);
export const useTheme = () => useContext(ThemeContext);

interface FractionContextType {
  fraction: boolean;
  setFraction: Setter<boolean>;
}
const FractionContext = createContext<FractionContextType | null>("Fraction");
export const useFraction = () => useContext(FractionContext);

interface MetadataFieldContextType {
  metadataField: string;
  setMetadataField: (metadataField: string) => void;
}
const MetadataFieldContext = createContext<MetadataFieldContextType | null>(
  "MetadataField",
);
export const useMetadataField = () => useContext(MetadataFieldContext);

interface BoundaryContextType {
  boundary: boolean;
  setBoundary: Setter<boolean>;
}

const BoundaryContext = createContext<BoundaryContextType | null>("Boundary");
export const useBoundary = () => useContext(BoundaryContext);

export function CellPopConfigProvider({
  children,
  data,
  dimensions: initialDimensions,
  theme: initialTheme,
}: CellPopConfigProps) {
  const [theme, setTheme] = useState<CellPopTheme>(initialTheme);
  const [dimensions, setDimensions] =
    useState<CellPopDimensions>(initialDimensions);
  const [fraction, setFraction] = useState<boolean>(false);
  const [metadataField, setMetadataField] = useState<string>("None");
  const [boundary, setBoundary] = useState<boolean>(false);

  return (
    <DataContext.Provider value={data}>
      <ThemeContext.Provider
        value={{ theme: getTheme(theme), currentThemeName: theme, setTheme }}
      >
        <DimensionsContext.Provider value={{ dimensions, setDimensions }}>
          <FractionContext.Provider value={{ fraction, setFraction }}>
            <MetadataFieldContext.Provider
              value={{ metadataField, setMetadataField }}
            >
              <BoundaryContext.Provider value={{ boundary, setBoundary }}>
                <ScaleProvider>{children}</ScaleProvider>
              </BoundaryContext.Provider>
            </MetadataFieldContext.Provider>
          </FractionContext.Provider>
        </DimensionsContext.Provider>
      </ThemeContext.Provider>
    </DataContext.Provider>
  );
}
