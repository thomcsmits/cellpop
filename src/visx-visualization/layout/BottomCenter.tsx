import React from "react";

import { useColumnConfig } from "../../contexts/AxisConfigContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import HeatmapXAxis from "../heatmap/HeatmapXAxis";
import MetadataValueBar from "../heatmap/MetadataValueBar";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function BottomCenterPanel({ id }: VisualizationPanelProps) {
  const flipAxisPosition = useColumnConfig((store) => store.flipAxisPosition);
  const { width, height } = usePanelDimensions("center_bottom");
  return (
    <VisualizationPanel id={id}>
      {flipAxisPosition ? (
        <MetadataValueBar axis="X" width={width} height={height} />
      ) : (
        <svg width={width} height={height}>
          <HeatmapXAxis />
        </svg>
      )}
    </VisualizationPanel>
  );
}
