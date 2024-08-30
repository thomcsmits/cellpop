import React, { useCallback, useMemo } from "react";

import { scaleLinear } from "@visx/scale";
import { max, rollup, ScaleBand, ScaleLinear } from "d3";
import { CountsMatrixValue } from "../cellpop-schema";
import { useData } from "../contexts/DataContext";
import { epanechnikov, kde } from "../utils/violin";

function useDensityFunction(
  scale: ScaleLinear<number, number>,
  bandwidth: number,
) {
  return useMemo(
    () => kde(epanechnikov(bandwidth), scale.ticks(100)),
    [bandwidth, scale],
  );
}

interface ViolinProps {
  categoricalScale: ScaleBand<string>;
  bandwidth: number;
  orientation: "horizontal" | "vertical";
  rangeLimit: number;
}

function useViolins({
  categoricalScale,
  bandwidth = 0.1,
  orientation,
  rangeLimit,
}: ViolinProps) {
  const {
    data: { countsMatrix },
    upperBound,
  } = useData();
  const densityScale = scaleLinear<number>({
    range: [rangeLimit, 0],
    domain: [0, upperBound],
  });
  const paddedScale = categoricalScale.copy().paddingInner(0.25);
  const density = useDensityFunction(densityScale, bandwidth);
  const key = orientation === "horizontal" ? "row" : "col";
  const violins = useMemo(
    () =>
      rollup(
        countsMatrix,
        (v) => density(v.map((g: CountsMatrixValue) => g.value)),
        (d: CountsMatrixValue) => d[key],
      ),
    [countsMatrix, density, key],
  );

  const violinScale = useMemo(() => {
    const allNumbers = [...violins.values()].reduce(
      (acc: number[], d) => acc.concat(d.map((d) => d[1])),
      [],
    );
    const xMax = max(allNumbers) || 0;
    return scaleLinear<number>({
      domain: [-xMax, xMax],
      range: [0, paddedScale.bandwidth()],
    });
  }, [paddedScale, violins]);

  return { violins, violinScale };
}

function Violin({ orientation, categoricalScale }: ViolinProps) {
  return (
    <g>
      <area />
      <path />
    </g>
  );
}