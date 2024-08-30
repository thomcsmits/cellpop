import { AxisBottom, AxisRight, Orientation } from "@visx/axis";
import React from "react";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useData } from "../contexts/DataContext";
import { useDimensions } from "../contexts/DimensionsContext";
import { useColorScale, useXScale, useYScale } from "../contexts/ScaleContext";

export default function Heatmap() {
  const { data } = useData();
  const { theme } = useCellPopTheme();
  const {
    dimensions: {
      heatmap: { width, height, offsetWidth, offsetHeight },
      textSize,
    },
  } = useDimensions();
  const { scale: x } = useXScale();
  const { scale: y } = useYScale();
  const { scale: colors } = useColorScale();

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
