import React from "react";

import TopGraph from "../TopGraph";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function TopCenterPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <TopGraph />
    </VisualizationPanel>
  );
}
