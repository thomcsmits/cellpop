import { AxisBottom, AxisRight, Orientation } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import React, { useMemo } from "react";
import { getUpperBound } from "../visualization/util";
import useCellPopConfig from "./CellPopConfigContext";

export default function Heatmap() {
  const {
    data,
    dimensions: {
      heatmap: { width, height, offsetWidth, offsetHeight },
      textSize,
    },
    theme,
  } = useCellPopConfig();
  const x = useMemo(() => {
    return scaleBand<string>({
      range: [0, width],
      domain: data.colNames,
      padding: 0.01,
    });
  }, [width, data.colNames]);

  const y = useMemo(() => {
    return scaleBand<string>()
      .range([height, 0])
      .domain(data.rowNames)
      .padding(0.01);
  }, [height, data.rowNames]);

  const colors = useMemo(() => {
    return scaleLinear<string>({
      range: [theme.heatmapZero, theme.heatmapMax],
      domain: [0, getUpperBound(data.countsMatrix.map((r) => r.value))],
    });
  }, [data.countsMatrix, theme.heatmapZero, theme.heatmapMax]);

  return (
    <g
      width={width}
      height={height}
      className="heatmap"
      transform={`translate(${offsetWidth}, ${offsetHeight})`}
    >
      {data.countsMatrix.map((cell, i) => {
        return (
          <rect
            key={i}
            x={x(cell.col) || 0}
            y={y(cell.row) || 0}
            width={x.bandwidth()}
            height={y.bandwidth()}
            fill={colors(cell.value)}
          />
        );
      })}

      <AxisBottom
        scale={x}
        label="Cell Type"
        numTicks={x.domain().length}
        tickLineProps={{
          fontSize: textSize.ind.tickX,
        }}
        tickLabelProps={(t) =>
          ({
            textAnchor: "end",
            fontSize: "1em",
            fontFamily: "sans-serif",
            style: {
              fontVariantNumeric: "tabular-nums",
            },
            fill: theme.text,
            dy: "0.25em",
            transform: `rotate(-45, ${x(t)}, 12)translate(0, ${x.bandwidth() / 2})`,
          }) as const
        }
        tickValues={x.domain()}
        orientation={Orientation.bottom}
        top={height}
        labelOffset={Math.max(...x.domain().map((s) => s.length)) * 16}
        labelProps={{
          fontSize: textSize.global.labelSmall,
          fill: theme.text,
        }}
      />
      <AxisRight
        scale={y}
        label="Sample"
        numTicks={y.domain().length}
        tickLineProps={{
          fontSize: textSize.ind.tickY,
        }}
        tickLabelProps={{
          fontSize: textSize.global.tick,
          fill: theme.text,
          style: {
            fontFamily: "sans-serif",
            fontVariantNumeric: "tabular-nums",
          },
        }}
        tickValues={y.domain()}
        orientation={Orientation.right}
        left={width}
        labelOffset={Math.max(...y.domain().map((s) => s.length)) * 12}
        labelProps={{
          fontSize: textSize.global.labelSmall,
          fill: theme.text,
        }}
      />
    </g>
  );
}
