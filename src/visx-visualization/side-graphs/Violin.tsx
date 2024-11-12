import React, { useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { area } from "@visx/shape";
import { curveBumpY, max, rollup } from "d3";
import { CountsMatrixValue } from "../../cellpop-schema";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useData } from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useXScale, useYScale } from "../../contexts/ScaleContext";
import { epanechnikov, kde } from "../../utils/violin";

type Side = "top" | "left";

interface ViolinsProps {
  side?: Side;
}

// X scale is categorical for the top graph, Y scale is categorical for the left graph
function useCategoricalScale(side: Side) {
  const { scale: heatmapXScale } = useXScale();
  const { scale: heatmapYScale } = useYScale();
  if (side === "top") {
    return heatmapXScale;
  }
  return heatmapYScale;
}

/**
 * Component used to render the violin plots on the left or top of the heatmap.
 * @param props.side The side to render the violin plots on.
 * @returns
 */
export default function Violins({ side = "top" }: ViolinsProps) {
  const horizontal = side === "top";
  const {
    data: { countsMatrixFractions },
    upperBound,
  } = useData();

  const [rows] = useRows();
  const [columns] = useColumns();

  const countsMatrix = horizontal
    ? countsMatrixFractions.col
    : countsMatrixFractions.row;

  const dimensions = usePanelDimensions(
    side === "top" ? "center_top" : "left_middle",
  );
  const { width, height } = dimensions;
  const categoricalScale = useCategoricalScale(side);
  const groups = horizontal ? columns : rows;

  /**
   * Scale used to generate the density of the violin plots.
   */
  const violinScale = scaleLinear({
    range: [horizontal ? height : width, 0],
    domain: [0, upperBound],
  });

  // Creates a map of group name to violin data
  const violins = useMemo(() => {
    const bandwidth = 0.1;
    const thresholds = violinScale.ticks(100);
    const density = kde(epanechnikov(bandwidth), thresholds);
    return rollup<CountsMatrixValue, [number, number][], string[]>(
      countsMatrix,
      (v) => {
        return density(v.map((g) => g.value));
      },
      (d) => (horizontal ? d.col : d.row),
    );
  }, [countsMatrix, horizontal, violinScale]);

  const allNums = useMemo(() => {
    const violinValues = [...violins.values()];
    const allNum = violinValues.reduce((allNum, d) => {
      /* @ts-expect-error The d3 type annotations for `rollup` don't seem to be correct */
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

  const theme = useTheme();

  return (
    <>
      {groups.map((group) => {
        // @ts-expect-error The d3 type annotations for `rollup` don't seem to be correct
        const violinData = violins.get(group);
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
              stroke={theme.palette.text.secondary}
              fill={theme.palette.text.primary}
              fillOpacity={0.6}
              strokeWidth={1}
            />
          </Group>
        );
      })}
    </>
  );
}
