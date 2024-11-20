import { useTheme } from "@mui/material/styles";
import { ScaleBand, ScaleLinear } from "d3";
import React from "react";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useSetTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";

interface BarsProps {
  orientation: "horizontal" | "vertical";
  categoricalScale: ScaleBand<string>;
  numericalScale: ScaleLinear<number, number>;
  data: Record<string, number>;
  domainLimit: number;
  selectedValues?: Set<string>;
  nonExpandedSize: number;
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
  selectedValues,
  nonExpandedSize,
}: BarsProps) {
  const entries = Object.entries(data);
  const {
    data: { metadata },
  } = useData();

  const columnLabel = useColumnConfig((store) => store.label);
  const rowLabel = useRowConfig((store) => store.label);

  const { openTooltip } = useSetTooltipData();
  const onMouse = (key: string) => (e: React.MouseEvent<SVGRectElement>) => {
    const md = orientation === "vertical" ? metadata.cols : metadata.rows;
    const metadataValue = md?.[key];
    openTooltip(
      {
        title: key,
        data: {
          "Cell Count": data[key],
          [orientation === "vertical" ? columnLabel : rowLabel]: key,
          ...metadataValue,
        },
      },
      e.clientX,
      e.clientY,
    );
  };
  const [rows] = useRows();
  const [columns] = useColumns();
  return (
    <>
      {entries.map(([key, value]) => {
        if (selectedValues?.has(key)) {
          // Display an axis scaled for the selected value
          return null;
        }
        const barWidth = nonExpandedSize;
        const scaledKey = categoricalScale(key);
        const scaledValue = numericalScale(value);
        const x =
          orientation === "vertical" ? scaledKey : domainLimit - scaledValue;
        const y =
          orientation === "vertical" ? domainLimit - scaledValue : scaledKey;
        const barHeight = scaledValue;
        const height = orientation === "vertical" ? barHeight : barWidth;
        const width = orientation === "vertical" ? barWidth : barHeight;
        const index =
          orientation === "vertical" ? columns.indexOf(key) : rows.indexOf(key);
        return (
          <Bar
            key={key}
            onMouse={onMouse(key)}
            orientation={orientation}
            x={x}
            y={y}
            barWidth={barWidth}
            width={width}
            height={height}
            index={index}
          />
        );
      })}
    </>
  );
}

interface BarProps {
  onMouse: (e: React.MouseEvent<SVGRectElement>) => void;
  orientation: "horizontal" | "vertical";
  x: number;
  y: number;
  barWidth: number;
  width: number;
  height: number;
  index: number;
}

function Bar({
  onMouse,
  orientation,
  x,
  y,
  barWidth,
  width,
  height,
  index,
}: BarProps) {
  const { closeTooltip } = useSetTooltipData();
  const theme = useTheme();
  const currentTheme = useSetTheme((s) => s.currentTheme);
  const stripeColor =
    currentTheme === "dark" ? theme.palette.grey[800] : theme.palette.grey[50];
  return (
    <g
      onMouseOver={onMouse}
      onMouseMove={onMouse}
      onMouseOut={closeTooltip}
      pointerEvents={"all"}
    >
      <rect
        x={orientation === "vertical" ? x : 0}
        y={orientation === "vertical" ? 0 : y}
        height={orientation === "vertical" ? "100%" : barWidth}
        width={orientation === "vertical" ? barWidth : "100%"}
        fill={index % 2 == 0 ? theme.palette.background.default : stripeColor}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={theme.palette.text.primary}
        stroke={theme.palette.background.default}
      />
    </g>
  );
}
