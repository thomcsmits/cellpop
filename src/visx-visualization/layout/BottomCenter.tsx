import React from "react";

import HeatmapXAxis from "../HeatmapXAxis";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function BottomCenterPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <HeatmapXAxis />
    </VisualizationPanel>
  );
}
