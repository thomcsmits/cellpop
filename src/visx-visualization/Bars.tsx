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
        const x =
          orientation === "vertical"
            ? categoricalScale(key)
            : numericalScale(value);
        const y =
          orientation === "vertical"
            ? numericalScale(value)
            : categoricalScale(key);
        return (
          <rect
            key={key}
            x={x}
            y={y}
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
