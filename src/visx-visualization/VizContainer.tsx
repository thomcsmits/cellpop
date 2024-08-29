import React, { PropsWithChildren, useId } from "react";
import useCellPopConfig from "./CellPopConfigContext";

interface VizContainerProps extends PropsWithChildren {}

function VizContainer(
  { children }: VizContainerProps,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    dimensions: {
      global: {
        width: { total: width },
        height: { total: height },
      },
    },
  } = useCellPopConfig();

  const id = useId();

  return (
    <div ref={ref} className="cellpop__container" id={id}>
      <svg width={width} height={height}>
        {children}
      </svg>
    </div>
  );
}

export default React.forwardRef(VizContainer);
