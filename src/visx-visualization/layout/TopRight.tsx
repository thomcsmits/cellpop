import React from "react";

import { TopGraphScale } from "../TopGraph";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function TopRightPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <TopGraphScale />
    </VisualizationPanel>
  );
}
