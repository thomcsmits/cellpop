import React from "react";

import Heatmap from "../Heatmap";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function MiddleCenterPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <Heatmap />
    </VisualizationPanel>
  );
}
