import React from "react";

import { useRows } from "../../contexts/AxisOrderContext";
import { AxisButtons } from "../AxisButtons";
import HeatmapYAxis from "../HeatmapYAxis";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function MiddleRightPanel({ id }: VisualizationPanelProps) {
  const [, { setSortOrder }] = useRows();

  return (
    <VisualizationPanel id={id}>
      <HeatmapYAxis />
      <AxisButtons axis="Y" setSortOrder={setSortOrder} />
    </VisualizationPanel>
  );
}
