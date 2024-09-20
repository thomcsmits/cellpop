import React from "react";

import HeatmapYAxis from "../HeatmapYAxis";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function MiddleRightPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <HeatmapYAxis />
    </VisualizationPanel>
  );
}
