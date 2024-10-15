import { rgbToHex } from "@mui/material/styles";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";
import { interpolatePlasma, schemePaired } from "d3";
import React, { useMemo } from "react";
import { useColumns, useRows } from "../../contexts/AxisOrderContext";
import { useData } from "../../contexts/DataContext";
import { useXScale, useYScale } from "../../contexts/ScaleContext";
import { useSetTooltipData } from "../../contexts/TooltipDataContext";

interface MetadataValueBarProps {
  axis: "X" | "Y";
  width: number;
  height: number;
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
    // @ts-expect-error we're including checks for types already
    const value = metadata[key][selectedMetadata] as string;
    return !isNaN(parseInt(value, 10)) && !isNaN(parseFloat(value));
  });
  const values: string[] = keys.map(
    // @ts-expect-error we're including checks for types already
    (key) => metadata[key][selectedMetadata],
  ) as string[];

  const metadataValueColorScale = useMemo(() => {
    if (metadataIsNumeric) {
      const numericValues = values.map((v) => parseInt(v, 10));
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      console.log({ min, max });
      return scaleLinear<string>({
        domain: [min, max],
        range: [interpolatePlasma(0), interpolatePlasma(1)],
      });
    } else {
      return scaleOrdinal<string>({
        range: [...schemePaired],
        domain: values,
      });
    }
  }, [keys, values, selectedMetadata, metadataIsNumeric]);

  const cellWidth = x.bandwidth();

  const axisLabelX = axis === "X" ? width / 2 : width / 4;
  const axisLabelY = axis === "X" ? height / 4 : height / 2;

  return (
    <svg width={width} height={height}>
      {keys.map((key) => {
        // @ts-expect-error we're including checks for types already
        const value = metadata[key][selectedMetadata] as string;
        const processedValue = metadataIsNumeric ? parseInt(value, 10) : value;

        // @ts-expect-error we added support for scaleOrdinal
        const height = y.bandwidth(key);

        // @ts-expect-error we're including checks for types already
        const color = rgbToHex(metadataValueColorScale(processedValue));
        return (
          <rect
            key={key}
            x={axis === "X" ? x(key) : 0}
            y={axis === "X" ? 0 : Math.ceil(y(key))}
            width={cellWidth}
            height={Math.ceil(height)}
            fill={color}
            onMouseMove={(e) => {
              openTooltip(
                {
                  title: key,
                  data: {
                    [selectedMetadata]: processedValue,
                  },
                },
                e.clientX,
                e.clientY,
              );
            }}
            onMouseOut={closeTooltip}
          />
        );
      })}
      <Text
        x={axisLabelX}
        y={axisLabelY}
        verticalAnchor="middle"
        textAnchor="middle"
        orientation={axis === "X" ? "horizontal" : "vertical"}
        style={{
          textTransform: "capitalize",
        }}
      >
        {selectedMetadata.split("_").join(" ")}
      </Text>
    </svg>
  );
}
