import React, { PropsWithChildren } from "react";

export interface VisualizationPanelProps extends PropsWithChildren {
  id: string;
}

export default function VisualizationPanel({
  children,
  id,
}: VisualizationPanelProps) {
  return (
    <div
      id={id}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {children}
    </div>
  );
}
