import React from "react";

import { LeftGraphScale } from "../side-graphs/LeftGraph";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function BottomLeftPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <LeftGraphScale />
    </VisualizationPanel>
  );
}
