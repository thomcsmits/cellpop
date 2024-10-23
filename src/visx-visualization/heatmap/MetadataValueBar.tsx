import { rgbToHex } from "@mui/material/styles";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";
import {
  interpolatePlasma,
  schemePaired,
  schemePastel1,
  schemePastel2,
} from "d3";
import React, { useCallback, useMemo } from "react";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useData } from "../../contexts/DataContext";
import { useXScale, useYScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";

interface MetadataValueBarProps {
  axis: "X" | "Y";
  width: number;
  height: number;
}

const combinedColorScheme = [
  ...schemePaired,
  ...schemePastel1,
  ...schemePastel2,
];

interface BarHelper {
  value: string | number;
  height: number;
  color: string;
  x: number;
  y: number;
  key: string;
}

export default function MetadataValueBar({
  axis,
  width,
  height,
}: MetadataValueBarProps) {
  const {
    data: { metadata: md },
  } = useData();
  const rows = useRows();
  const columns = useColumns();
  const data = axis === "X" ? columns : rows;
  const metadata = axis === "X" ? md.cols : md.rows;
  const { scale: y } = useYScale();
  const { scale: x } = useXScale();

  const keys = data[0];

  const { selectedMetadata, metadataKeys } = data[1];

  const { openTooltip, closeTooltip } = useSetTooltipData();

  if (!selectedMetadata || !metadata || !metadataKeys) {
    return null;
  }

  const metadataIsNumeric = keys.every((key) => {
    // @ts-expect-error we're handling typechecking at runtime
    const value = metadata[key][selectedMetadata] as string;
    return !isNaN(parseInt(value, 10)) && !isNaN(parseFloat(value));
  });
  const values: string[] = keys.map(
    // @ts-expect-error we're handling typechecking at runtime
    (key) => metadata[key][selectedMetadata] as string,
  );

  const metadataValueColorScale = useMemo(() => {
    if (metadataIsNumeric) {
      const numericValues = values.map((v) => parseInt(v, 10));
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      return scaleLinear<string>({
        domain: [min, max],
        range: [interpolatePlasma(0), interpolatePlasma(1)],
      });
    } else {
      return scaleOrdinal<string, string>({
        range: combinedColorScheme.map(rgbToHex),
        domain: values,
      });
    }
  }, [keys, values, selectedMetadata, metadataIsNumeric]);

  const cellWidth = x.bandwidth();

  const axisLabelX = axis === "X" ? width / 2 : width / 3;
  const axisLabelY = axis === "X" ? height / 3 : height / 2;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const target = e.target as SVGRectElement;
      const key = target.getAttribute("data-key");
      const value = target.getAttribute("data-value");
      openTooltip(
        {
          title: key,
          data: {
            [selectedMetadata]: value,
          },
        },
        e.clientX,
        e.clientY,
      );
    },
    [selectedMetadata],
  );

  const bars = keys.reduce((acc, key) => {
    // @ts-expect-error we're handling typechecking at runtime
    const value = metadata[key][selectedMetadata] as string;
    const processedValue = metadataIsNumeric ? parseInt(value, 10) : value;
    // @ts-expect-error this is supported by the y axis
    const height = y.bandwidth(key);
    // @ts-expect-error we're handling typechecking at runtime
    const color = metadataValueColorScale(processedValue);

    const xVal = axis === "X" ? x(key) : 0;
    const yVal = axis === "X" ? 0 : Math.ceil(y(key));
    if (acc.length === 0) {
      return [
        {
          value: processedValue,
          height,
          color,
          x: xVal,
          y: yVal,
          key,
        },
      ];
    }
    const lastBar = acc[acc.length - 1];
    if (lastBar.value === processedValue) {
      const newBar = {
        ...lastBar,
        y: Math.min(lastBar.y, yVal),
        height: lastBar.height + height,
      };
      return [...acc.slice(0, -1), newBar];
    }
    return [
      ...acc,
      {
        value: processedValue,
        height,
        color,
        x: xVal,
        y: yVal,
        key,
      },
    ];
  }, [] as BarHelper[]);

  const textY = (bar: BarHelper) => {
    if (bars.length === 1) {
      // Handle single-bar case by purposely un-centering the text
      // otherwise the label can overlap the metadata name
      return bar.y + bar.height / 1.5;
    } else {
      return bar.y + bar.height / 2;
    }
  };

  return (
    <svg width={width} height={height}>
      {bars.map((bar) => {
        const { value, height, color, x: xVal, y: yVal, key } = bar;
        const shortenedValue =
          value.toString().length > 20
            ? value.toString().slice(0, 10) + "..."
            : value;
        return (
          <g key={key} x={xVal} y={yVal}>
            <rect
              x={xVal}
              y={yVal}
              width={cellWidth}
              height={Math.ceil(height)}
              fill={color}
              data-value={value}
              data-key={key}
              onMouseMove={onMouseMove}
              onMouseOut={closeTooltip}
              onMouseDown={(e) => {
                const target = e.target as SVGRectElement;
                target.style.filter = "brightness(1.5)";
                const onMouseUp = () => {
                  target.style.filter = "none";
                  document.removeEventListener("mouseup", onMouseUp);
                };
                document.addEventListener("mouseup", onMouseUp);
              }}
            />
            <Text
              x={xVal}
              y={textY(bar)}
              className="text"
              dx="1em"
              orientation={axis === "X" ? "horizontal" : "vertical"}
              onMouseMove={(e) => {
                openTooltip(
                  {
                    title: key,
                    data: { [selectedMetadata]: value },
                  },
                  e.clientX,
                  e.clientY,
                );
              }}
              onMouseOut={closeTooltip}
            >
              {shortenedValue}
            </Text>
          </g>
        );
      })}
      <Text
        x={axisLabelX}
        y={axisLabelY}
        verticalAnchor="middle"
        textAnchor="middle"
        orientation={axis === "X" ? "horizontal" : "vertical"}
        className="text"
        style={{
          textTransform: "capitalize",
        }}
      >
        {selectedMetadata.split("_").join(" ")}
      </Text>
    </svg>
  );
}
