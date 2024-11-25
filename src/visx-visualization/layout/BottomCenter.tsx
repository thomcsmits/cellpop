import React from "react";

import { useColumnConfig } from "../../contexts/AxisConfigContext";
import { useColumnSortKeys, useData } from "../../contexts/DataContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { AxisButtons } from "../heatmap/AxisButtons";
import HeatmapXAxis from "../heatmap/HeatmapXAxis";
import MetadataValueBar from "../heatmap/MetadataValueBar";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function BottomCenterPanel({ id }: VisualizationPanelProps) {
  const setSortOrder = useData((s) => s.setColumnSortOrder);
  const sortOrders = useColumnSortKeys();
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
      <AxisButtons
        axis="X"
        setSortOrder={setSortOrder}
        sortOrders={sortOrders}
      />
    </VisualizationPanel>
  );
}
