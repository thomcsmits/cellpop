import {
  AxisLeft,
  AxisRight,
  Orientation,
  TickRendererProps,
} from "@visx/axis";
import { scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import React, { useId } from "react";
import { useRowConfig } from "../../contexts/AxisConfigContext";
import { useRows } from "../../contexts/AxisOrderContext";
import { useCellPopTheme } from "../../contexts/CellPopThemeContext";
import { useData } from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { useYScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";
import SVGBackgroundColorFilter from "../SVGBackgroundColorFilter";
import { TICK_TEXT_SIZE } from "./constants";
import { useHeatmapAxis, useSetTickLabelSize } from "./hooks";

/**
 * Component which renders the y-axis of the heatmap.
 */
export default function HeatmapYAxis() {
  const { theme } = useCellPopTheme();
  const {
    scale: y,
    tickLabelSize,
    setTickLabelSize,
    selectedValues,
  } = useYScale();
  const axisConfig = useRowConfig();
  const { label, flipAxisPosition } = axisConfig;
  const { openTooltip, closeTooltip } = useSetTooltipData();

  const [rows] = useRows();
  const { rowCounts } = useData();

  const filterId = useId();
  const { openInNewTab, tickTitle, tickLabelStyle } = useHeatmapAxis(
    axisConfig,
    filterId,
  );

  const fontSize =
    y.bandwidth() > TICK_TEXT_SIZE ? TICK_TEXT_SIZE : y.bandwidth();

  useSetTickLabelSize(flipAxisPosition, setTickLabelSize, "y", fontSize);

  return (
    <>
      <SVGBackgroundColorFilter color={theme.background} id={filterId} />
      <AxisRight
        scale={y}
        label={label}
        stroke={theme.text}
        tickStroke={theme.text}
        tickComponent={TickComponent}
        tickLabelProps={(t) =>
          ({
            fontSize,
            fill: theme.text,
            className: "y-axis-tick-label",
            style: tickLabelStyle,
            transform: `translate(0, ${fontSize / 4})`,
            onMouseOver: (e) => {
              openTooltip(
                {
                  title: tickTitle(t),
                  data: {
                    "Cell Count": rowCounts[t],
                    [label]: t,
                  },
                },
                e.clientX,
                e.clientY,
              );
            },
            onMouseOut: closeTooltip,
            onClick: () => openInNewTab(t),
          }) as const
        }
        tickValues={rows}
        orientation={Orientation.right}
        labelOffset={
          tickLabelSize || Math.max(...y.domain().map((s) => s.length)) * 8
        }
        labelProps={{
          fontSize: TICK_TEXT_SIZE * 1.5,
          fill: theme.text,
          pointerEvents: "none",
        }}
        hideTicks={selectedValues.size > 0}
      />
    </>
  );
}

function TickComponent({
  x,
  y,
  formattedValue,
  ...tickLabelProps
}: TickRendererProps) {
  const { selectedValues, expandedSize } = useYScale();
  const rowConfig = useRowConfig();
  const { flipAxisPosition } = rowConfig;
  const { openInNewTab, tickTitle, tickLabelStyle } = useHeatmapAxis(rowConfig);
  const { data } = useData();

  const panelSize = usePanelDimensions(
    flipAxisPosition ? "left_middle" : "right_middle",
  );
  const { openTooltip, closeTooltip } = useSetTooltipData();

  if (selectedValues.has(formattedValue)) {
    // Display an axis scaled for the selected value instead of the tick if the value is expanded
    // Use the tick label as the axis label
    const Axis = flipAxisPosition ? AxisLeft : AxisRight;
    const max = Math.max(
      ...data.countsMatrix
        .filter((d) => d.row === formattedValue)
        .map((d) => d.value),
    );
    const yScale = scaleLinear({
      domain: [max, 0],
      range: [0, expandedSize],
      nice: true,
    });
    return (
      <Axis
        top={y}
        left={panelSize.width}
        scale={yScale}
        label={formattedValue}
        labelOffset={expandedSize / 2}
        labelProps={{
          style: tickLabelStyle,
          onMouseMove: (e) => {
            openTooltip(
              {
                title: tickTitle(formattedValue),
                data: {
                  "Cell Count": max,
                },
              },
              e.clientX,
              e.clientY,
            );
          },
          onMouseOut: closeTooltip,
          onClick: () => openInNewTab(formattedValue),
        }}
      />
    );
  }
  return (
    <Text x={x} y={y} {...tickLabelProps}>
      {formattedValue}
    </Text>
  );
}
