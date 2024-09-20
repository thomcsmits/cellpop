import React from "react";

import Legend from "../Legend";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function TopLeftPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <Legend />
    </VisualizationPanel>
  );
}
