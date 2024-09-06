import { ScaleBand, ScaleLinear } from "d3";
import React from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useSetTooltipData } from "../contexts/TooltipDataContext";

interface BarsProps {
  orientation: "horizontal" | "vertical";
  categoricalScale: ScaleBand<string>;
  numericalScale: ScaleLinear<number, number>;
  data: Record<string, number>;
  domainLimit: number;
  xOffset: number;
  yOffset: number;
}

export function Bars({
  orientation,
  categoricalScale,
  numericalScale,
  data,
  domainLimit,
  xOffset,
  yOffset,
}: BarsProps) {
  const entries = Object.entries(data);
  const barWidth = categoricalScale.bandwidth();
  const { theme } = useCellPopTheme();

  const { openTooltip, closeTooltip } = useSetTooltipData();
  return (
    <>
      {entries.map(([key, value]) => {
        const scaledKey = categoricalScale(key);
        const scaledValue = numericalScale(value);
        const x =
          orientation === "vertical" ? scaledKey : domainLimit - scaledValue;
        const y =
          orientation === "vertical" ? domainLimit - scaledValue : scaledKey;
        const barHeight = scaledValue;
        const height = orientation === "vertical" ? barHeight : barWidth;
        const width = orientation === "vertical" ? barWidth : barHeight;
        return (
          <rect
            key={key}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={theme.sideCharts}
            onMouseOver={() => {
              openTooltip(
                {
                  title: key,
                  data: { "Cell count": value },
                },
                x + xOffset,
                y + yOffset,
              );
            }}
            onMouseOut={closeTooltip}
          />
        );
      })}
    </>
  );
}
