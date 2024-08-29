import React, { PropsWithChildren } from "react";

interface VizContainerProps extends PropsWithChildren {
  width: number;
  height: number;
}

function VizContainer({width, height, children}: VizContainerProps, ref: React.Ref<HTMLDivElement>) {
  return  <div ref={ref} id="cellpop__container"><svg width={width} height={height}>{children}</svg></div>;
}

export default React.forwardRef(VizContainer);