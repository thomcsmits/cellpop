import React, { useMemo } from "react";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { area } from "@visx/shape";
import { count, curveBumpY, extent, max, rollup } from "d3";
import { CountsMatrixValue } from "../cellpop-schema";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useXScale, useYScale } from "../contexts/ScaleContext";
import { epanechnikov, kde, useDensityFunction } from "../utils/violin";
import { getUpperBound } from "../visualization/util";

type Side = "top" | "left";

interface ViolinsProps {
  side?: Side;
}

function useCategoricalScale(side: Side) {
  const { scale: heatmapXScale } = useXScale();
  const { scale: heatmapYScale } = useYScale();
  if (side === "top") {
    return heatmapXScale;
  }
  return heatmapYScale;
}

export default function Violins({ side = "top" }: ViolinsProps) {
  const horizontal = side === "top";
  const {
    data: { rowNames, colNames, countsMatrixFractions },
  } = useData();

  const countsMatrix = horizontal
    ? countsMatrixFractions.col
    : countsMatrixFractions.row;

  const upperBound = getUpperBound(countsMatrix.map((d) => d.value));

  const {
    dimensions: { barTop, barLeft },
  } = useDimensions();
  const dimensions = horizontal ? barTop : barLeft;
  const width =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const height =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  // X scale is used for the top graph, Y scale is used for the left graph
  const categoricalScale = useCategoricalScale(side);
  const groups = horizontal ? colNames : rowNames;

  const violinScale = scaleLinear({
    range: [horizontal ? height : width, 0],
    domain: [0, upperBound],
  });

  console.log(upperBound);

  // A map of group name to violin data
  const violins = useMemo(() => {
    const bandwidth = 0.1;
    const thresholds = violinScale.ticks(100);
    const density = kde(epanechnikov(bandwidth), thresholds);
    return rollup<CountsMatrixValue, [number, number][], string[]>(
      countsMatrix,
      (v) => {
        const d = density(v.map((g) => g.value));
        console.log("rollup", { v, density: d });
        return density(v.map((g) => g.value));
      },
      (d) => (horizontal ? d.col : d.row),
    );
  }, [countsMatrix, horizontal, violinScale]);

  const allNums = useMemo(() => {
    const violinValues = [...violins.values()];
    const allNum = violinValues.reduce((allNum, d) => {
      allNum.push(...d.map((d) => d[1]));
      return allNum;
    }, [] as number[]);
    return allNum;
  }, [violins]);

  const categoricalScaleRescaled = categoricalScale.copy().paddingInner(0.25);

  const maxNum = max(allNums) || 0;
  const densityScale = scaleLinear({
    domain: [-maxNum, maxNum],
    range: [0, categoricalScaleRescaled.bandwidth()],
  });

  const violinAreaGenerator = useMemo(() => {
    return area<[number, number]>({
      ...(horizontal
        ? ({
            // top
            x0: (d) => densityScale(-d[1]),
            x1: (d) => densityScale(d[1]),
            y: (d) => violinScale(d[0]),
          } as const)
        : ({
            // left
            y0: (d) => densityScale(-d[1]),
            y1: (d) => densityScale(d[1]),
            x: (d) => violinScale(d[0]),
          } as const)),
      curve: curveBumpY,
    });
  }, [densityScale, violinScale, horizontal]);

  const { theme } = useCellPopTheme();

  return (
    <>
      {groups.map((group) => {
        const violinData = violins.get(group);
        console.log({ violinData });
        if (!violinData) {
          return null;
        }
        // Position of violin corresponds to its row/column;
        // bandwidth is used to center its position
        const transformCoordinate =
          categoricalScaleRescaled(group) - categoricalScale.bandwidth() / 2;
        const transform = horizontal
          ? `translate(${transformCoordinate}, 0)`
          : `translate(0, ${transformCoordinate})`;
        return (
          <Group key={group} transform={transform}>
            <path
              key={group}
              d={violinAreaGenerator(violinData)}
              opacity={1}
              stroke={theme.sideCharts}
              fill={theme.sideCharts}
              fillOpacity={0.6}
              strokeWidth={1}
            />
          </Group>
        );
      })}
    </>
  );
}
