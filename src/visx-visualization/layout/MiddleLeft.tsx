import React from "react";

import LeftGraph from "../LeftGraph";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function MiddleLeftPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <LeftGraph />
    </VisualizationPanel>
  );
}
