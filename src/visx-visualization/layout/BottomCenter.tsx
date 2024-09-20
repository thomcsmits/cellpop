import React from "react";

import { useColumns } from "../../contexts/AxisOrderContext";
import { AxisButtons } from "../AxisButtons";
import HeatmapXAxis from "../HeatmapXAxis";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function BottomCenterPanel({ id }: VisualizationPanelProps) {
  const [, { setSortOrder }] = useColumns();
  return (
    <VisualizationPanel id={id}>
      <HeatmapXAxis />
      <AxisButtons axis="X" setSortOrder={setSortOrder} />
    </VisualizationPanel>
  );
}
