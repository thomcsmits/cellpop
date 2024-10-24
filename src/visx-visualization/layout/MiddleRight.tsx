import React from "react";

import { useRowConfig } from "../../contexts/AxisConfigContext";
import { useRows } from "../../contexts/AxisOrderContext";
import { usePanelDimensions } from "../../contexts/DimensionsContext";
import { AxisButtons } from "../heatmap/AxisButtons";
import HeatmapYAxis from "../heatmap/HeatmapYAxis";
import MetadataValueBar from "../heatmap/MetadataValueBar";
import RowSelectionControls from "../heatmap/RowSelectionControls";
import VisualizationPanel, { VisualizationPanelProps } from "./Panel";

export default function MiddleRightPanel({ id }: VisualizationPanelProps) {
  const [, { setSortOrder, sortOrders }] = useRows();
  const { width, height } = usePanelDimensions("right_middle");
  const { flipAxisPosition } = useRowConfig();

  return (
    <VisualizationPanel id={id}>
      {flipAxisPosition ? (
        <MetadataValueBar axis="Y" width={width} height={height} />
      ) : (
        <svg width={width} height={height}>
          <HeatmapYAxis />
        </svg>
      )}
      <AxisButtons
        axis="Y"
        setSortOrder={setSortOrder}
        sortOrders={sortOrders}
      />
      <RowSelectionControls />
    </VisualizationPanel>
  );
}
