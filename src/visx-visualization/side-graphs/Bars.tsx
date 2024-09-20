import { ScaleBand, ScaleLinear } from "d3";
import React from "react";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";

interface BarsProps {
  orientation: "horizontal" | "vertical";
  categoricalScale: ScaleBand<string>;
  numericalScale: ScaleLinear<number, number>;
  data: Record<string, number>;
  domainLimit: number;
}

/**
 * Helper component for rendering the bars of a bar chart
 * @param props.orientation The orientation of the bars.
 * @param props.categoricalScale The scale for the categorical axis (i.e. the x-axis if looking at a vertically oriented bar chart).
 * @param props.numericalScale The scale for the numerical axis (i.e. the y-axis if looking at a vertically oriented bar chart).
 * @param props.data The data to render (either row or column counts).
 * @param props.domainLimit The limit of the domain (i.e. the maximum height of a bar on the chart).
 * @returns
 */
export default function Bars({
  orientation,
  categoricalScale,
  numericalScale,
  data,
  domainLimit,
}: BarsProps) {
  const entries = Object.entries(data);
  const barWidth = categoricalScale.bandwidth();
  const { theme } = useCellPopTheme();

  const { openTooltip, closeTooltip } = useSetTooltipData();
  const onMouse = (key: string) => (e: React.MouseEvent<SVGRectElement>) => {
    openTooltip(
      {
        title: key,
        data: {
          "Cell Count": data[key],
          [orientation === "vertical" ? "column" : "row"]: key,
        },
      },
      e.clientX,
      e.clientY,
    );
  };
  // Outer `g` wrapper is used to show the tooltip on hover for accessibility
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
          <g
            key={key}
            onMouseOver={onMouse(key)}
            onMouseMove={onMouse(key)}
            onMouseOut={closeTooltip}
            pointerEvents={"all"}
          >
            <rect
              x={orientation === "vertical" ? x : 0}
              y={orientation === "vertical" ? 0 : y}
              height={orientation === "vertical" ? "100%" : barWidth}
              width={orientation === "vertical" ? barWidth : "100%"}
              fill={theme.background}
            />
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill={theme.sideCharts}
              stroke={theme.background}
            />
          </g>
        );
      })}
    </>
  );
}
