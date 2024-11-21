import React, { useMemo } from "react";

import { useTheme } from "@mui/material/styles";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { area } from "@visx/shape";
import { bin, max, rollups } from "d3";
import { useData, useMaxCount } from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useXScale, useYScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import { TOP_MARGIN } from "./constants";

type Side = "top" | "left";

interface ViolinsProps {
  side?: Side;
}

// X scale is categorical for the top graph, Y scale is categorical for the left graph
function useCategoricalScale(side: Side) {
  const x = useXScale();
  const y = useYScale();
  if (side === "top") {
    return x;
  }
  return y;
}

/**
 * Component used to render the violin plots on the left or top of the heatmap.
 * @param props.side The side to render the violin plots on.
 * @returns
 */
export default function Violins({ side = "top" }: ViolinsProps) {
  const topViolins = side === "top";
  const {
    data: { countsMatrix },
  } = useData();
  const upperBound = useMaxCount();

  const dimensions = usePanelDimensions(
    side === "top" ? "center_top" : "left_middle",
  );
  const { width, height } = dimensions;
  const { scale: categoricalScale, tickLabelSize } = useCategoricalScale(side);

  /**
   * Scale used to generate the density of the violin plots.
   */
  const rangeStart = topViolins ? height : width;
  const rangeEnd = tickLabelSize + TOP_MARGIN;
  const violinScale = scaleLinear({
    range: [rangeStart, rangeEnd],
    domain: [0, upperBound],
  });

  // Creates a map of group name to violin data
  const violins = useMemo(() => {
    const bins = bin()
      .thresholds(50)
      .domain([0, upperBound])
      .value((d) => d);
    const violinData = rollups(
      countsMatrix,
      (v) => {
        const values = v.map((d) => d.value);
        const bin = bins(values);
        const binLengths = bin.map((b) => b.length);
        return binLengths;
      },
      (d) => (topViolins ? d.col : d.row),
    );
    return violinData;
  }, [side, countsMatrix, topViolins, violinScale, upperBound]);

  const maxBinCount = useMemo(() => {
    return violins.reduce((acc, [, violinData]) => {
      const maxBin = max(violinData);
      return maxBin > acc ? maxBin : acc;
    }, 0);
  }, [violins]);

  const categoricalScaleRescaled = categoricalScale.copy().paddingInner(0.1);

  const densityScale = scaleLinear({
    domain: [-maxBinCount, maxBinCount],
    range: [0, categoricalScaleRescaled.bandwidth()],
  });

  const violinAreaGenerator = useMemo(() => {
    if (topViolins) {
      return area<[number, number]>()
        .y((d) => violinScale(d[0]))
        .x0((d) => densityScale(-d[1]))
        .x1((d) => densityScale(d[1]));
    } else {
      return area<[number, number]>()
        .x((d) => violinScale(d[0]))
        .y0((d) => densityScale(-d[1]))
        .y1((d) => densityScale(d[1]));
    }
  }, [densityScale, violinScale, topViolins]);

  const theme = useTheme();

  const { openTooltip, closeTooltip } = useSetTooltipData();

  return (
    <>
      {violins.map(([group, violinData]) => {
        // Position of violin corresponds to its row/column;
        const transformCoordinate = categoricalScaleRescaled(group);
        const transform = topViolins
          ? `translate(${transformCoordinate}, 0)`
          : `translate(0, ${transformCoordinate})`;
        const binsWithThresholds: [number, number][] = violinData.map(
          (d, idx) => [idx * 200, d],
        );
        const tooltip = binsWithThresholds.reduce((acc, [threshold, count]) => {
          if (count == 0) {
            return acc;
          }
          return {
            ...acc,
            [`${threshold}-${threshold + 199}`]: `${count} ${count === 1 ? "entry" : "entries"}`,
          };
        }, {});

        const range = Math.abs(rangeStart);

        const backgroundWidth = topViolins
          ? categoricalScale.bandwidth()
          : range;

        const backgroundHeight = topViolins
          ? range
          : categoricalScale.bandwidth();
        return (
          <Group key={group} transform={transform}>
            <rect
              onMouseMove={(e) => {
                openTooltip(
                  {
                    title: group,
                    data: tooltip,
                  },
                  e.clientX,
                  e.clientY,
                );
              }}
              onMouseOut={closeTooltip}
              height={backgroundHeight}
              width={backgroundWidth}
              fill={"none"}
              style={{ pointerEvents: "all" }}
              data-testid={`violin-background-${group}`}
            />
            <path
              key={group}
              d={violinAreaGenerator(binsWithThresholds)}
              opacity={1}
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
