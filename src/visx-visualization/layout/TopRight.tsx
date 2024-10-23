import React from "react";

import { TopGraphScale } from "../side-graphs/TopGraph";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function TopRightPanel({ id }: VisualizationPanelProps) {
  return (
    <VisualizationPanel id={id}>
      <TopGraphScale />
    </VisualizationPanel>
  );
}
