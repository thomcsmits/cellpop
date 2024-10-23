import React from "react";

import LeftGraph from "../side-graphs/LeftGraph";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function MiddleLeftPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <LeftGraph />
    </VisualizationPanel>
  );
}
