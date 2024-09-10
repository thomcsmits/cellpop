import React, { PropsWithChildren, useId } from "react";
import { useDimensions } from "../contexts/DimensionsContext";
import Tooltip from "./Tooltip";

function VizContainer(
  { children }: PropsWithChildren,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    dimensions: {
      global: {
        width: { total: width },
        height: { total: height },
      },
    },
  } = useDimensions();

  const id = useId();

  return (
    <div ref={ref} className="cellpop__container" id={id}>
      <svg width={width} height={height}>
        {children}
      </svg>
      <Tooltip />
    </div>
  );
}

export default React.forwardRef(VizContainer);
