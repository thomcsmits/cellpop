import { rgbToHex, useTheme } from "@mui/material/styles";
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
import {
  EXPANDED_ROW_PADDING,
  useXScale,
  useYScale,
} from "../../contexts/ScaleContext";
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
  width: number;
  color: string;
  x: number;
  y: number;
  keys: string[];
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
  const theme = useTheme();

  const keys = data[0];

  const { selectedMetadata, metadataKeys } = data[1];

  const { openTooltip, closeTooltip } = useSetTooltipData();

  const metadataIsNumeric = metadata
    ? keys.every((key) => {
        const value = metadata[key][selectedMetadata] as string;
        return !isNaN(parseInt(value, 10)) && !isNaN(parseFloat(value));
      })
    : false;
  const values: string[] = metadata
    ? keys.map((key) => metadata[key][selectedMetadata] as string)
    : [];

  const metadataValueColorScale = useMemo(() => {
    if (!selectedMetadata) {
      return null;
    }
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
      const keys = target.getAttribute("data-keys")?.split(",") || [];
      const value = target.getAttribute("data-value");
      if (keys.length === 0 || !value) {
        return;
      }
      const targetBounds = target.getBoundingClientRect();
      const x = e.clientX - targetBounds.left;
      const y = e.clientY - targetBounds.top;
      if (x < 0 || y < 0 || x > targetBounds.width || y > targetBounds.height) {
        return;
      }
      const titleCreator = () => {
        if (keys.length === 1) {
          return keys[0];
        }
        const keysLength = keys.length;
        const keysReverse = keys.slice().reverse();
        if (axis === "Y") {
          const keyHeight = targetBounds.height / keysLength;
          const keyIndex = Math.floor(y / keyHeight);
          return keysReverse[keyIndex];
        } else if (axis === "X") {
          const keyWidth = targetBounds.width / keysLength;
          const keyIndex = Math.floor(x / keyWidth);
          return keysReverse[keyIndex];
        }
      };
      const title = titleCreator();
      openTooltip(
        {
          title,
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

  if (!selectedMetadata || !metadata || !metadataKeys) {
    return null;
  }

  const bars: BarHelper[] = keys.reduce((acc, key) => {
    const value = metadata[key][selectedMetadata] as string;
    if (!value) {
      console.warn("No value for key", metadata[key], selectedMetadata);
      return acc;
    }
    const processedValue = metadataIsNumeric ? parseInt(value, 10) : value;
    // @ts-expect-error we're handling typechecking at runtime
    const color = metadataValueColorScale(processedValue);
    if (axis === "Y") {
      // @ts-expect-error this is supported by the y axis
      let height = y.bandwidth(key);
      // Add padding around expanded bars
      if (height > y.bandwidth()) {
        height += EXPANDED_ROW_PADDING * 2;
      }
      height = Math.ceil(height);
      const width = x.bandwidth();

      const xVal = x.bandwidth() * 2;
      const yVal = Math.ceil(y(key));

      const newBar: BarHelper = {
        value: processedValue,
        height,
        width,
        color,
        x: xVal,
        y: yVal,
        keys: [key],
      };

      // if first bar
      if (acc.length === 0) {
        return [newBar] as BarHelper[];
      }
      // otherwise, check if the last bar has the same value
      // if so, combine them
      const lastBar: BarHelper = acc[acc.length - 1];
      if (lastBar.value === processedValue) {
        const editedBar: BarHelper = {
          ...lastBar,
          y: Math.min(lastBar.y, yVal),
          height: lastBar.height + height,
          keys: [...lastBar.keys, key],
        };
        return [...acc.slice(0, -1), editedBar];
      }
      return [...acc, newBar];
    } else if (axis === "X") {
      const width = x.bandwidth();
      const height = y.bandwidth();
      const xVal = x(key);
      const yVal = y.bandwidth();
      const newBar: BarHelper = {
        value: processedValue,
        width,
        height,
        color,
        x: xVal,
        y: yVal,
        keys: [key],
      };
      // if first bar
      if (acc.length === 0) {
        return [newBar] as BarHelper[];
      }
      // otherwise, check if the last bar has the same value and combine them if so
      const lastBar: BarHelper = acc[acc.length - 1];
      if (lastBar.value === processedValue) {
        const editedBar = {
          ...lastBar,
          x: Math.min(lastBar.x, xVal),
          width: lastBar.width + width,
          keys: [...lastBar.keys, key],
        };
        return [...acc.slice(0, -1), editedBar];
      }
      // otherwise, add a new bar
      return [...acc, newBar];
    }
  }, [] as BarHelper[]);

  const textY = (bar: BarHelper) => {
    if (axis === "X") {
      return bar.y + bar.height / 2;
    }
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
        const {
          value,
          height,
          width: barWidth,
          color,
          x: xVal,
          y: yVal,
          keys,
        } = bar;
        const shortenedValue =
          value.toString().length > 20
            ? value.toString().slice(0, 10) + "..."
            : value;
        return (
          <g key={keys.join(",")} x={xVal} y={yVal}>
            <rect
              x={xVal}
              y={yVal}
              width={barWidth}
              height={Math.ceil(height)}
              fill={color}
              data-value={value}
              data-keys={keys.join(",")}
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
              dx={axis == "X" ? 0 : cellWidth + 8}
              dy={axis == "X" ? cellWidth + 8 : 0}
              fill={theme.palette.text.primary}
              angle={axis === "X" ? 90 : 0}
              onMouseMove={(e) => {
                openTooltip(
                  {
                    title: String(value),
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
        fill={theme.palette.text.primary}
        style={{
          textTransform: "capitalize",
        }}
      >
        {selectedMetadata.split("_").join(" ")}
      </Text>
    </svg>
  );
}
