import { ScaleBand, ScaleLinear } from "d3";
import React from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";

interface BarsProps {
  orientation: "horizontal" | "vertical";
  categoricalScale: ScaleBand<string>;
  numericalScale: ScaleLinear<number, number>;
  data: Record<string, number>;
  domainLimit: number;
}

export function Bars({
  orientation,
  categoricalScale,
  numericalScale,
  data,
  domainLimit,
}: BarsProps) {
  const entries = Object.entries(data);
  const barWidth = categoricalScale.bandwidth();
  const { theme } = useCellPopTheme();
  return (
    <>
      {entries.map(([key, value]) => (
        <rect
          key={key}
          x={
            orientation === "vertical"
              ? categoricalScale(key)
              : numericalScale(value)
          }
          y={
            orientation === "vertical"
              ? numericalScale(value)
              : categoricalScale(key)
          }
          width={
            orientation === "vertical"
              ? barWidth
              : domainLimit - numericalScale(value)
          }
          height={
            orientation === "vertical"
              ? domainLimit - numericalScale(value)
              : barWidth
          }
          fill={theme.sideCharts}
        />
      ))}
    </>
  );
}
