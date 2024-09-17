import React, {
  forwardRef,
  PropsWithChildren,
  Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  getPanelElement,
  ImperativePanelGroupHandle,
  Panel,
  PanelGroup,
  PanelGroupOnLayout,
  PanelResizeHandle,
  PanelResizeHandleProps,
} from "react-resizable-panels";

import { useEventCallback } from "@mui/material";
import { useCellPopTheme } from "../contexts/CellPopThemeContext";
import { useDimensions } from "../contexts/DimensionsContext";
import Heatmap from "./Heatmap";
import HeatmapXAxis from "./HeatmapXAxis";
import HeatmapYAxis from "./HeatmapYAxis";
import LeftGraph, { LeftGraphScale } from "./LeftGraph";
import { Legend } from "./Legend";
import Tooltip from "./Tooltip";
import TopGraph, { TopGraphScale } from "./TopGraph";

interface VerticalPanelGroupProps extends PropsWithChildren {
  id: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  onLayout: PanelGroupOnLayout;
  side: "left" | "center" | "right";
}

// Placeholder in case we need to style the resize handle
function StyledPanelHandle(props: PanelResizeHandleProps) {
  return <PanelResizeHandle {...props} />;
}

function getPanelSize(id: string) {
  const panel = getPanelElement(id);
  return panel.getBoundingClientRect();
}

/**
 * Represents a group of panels arranged vertically.
 * @param props.top The content of the top panel.
 * @param props.bottom The content of the bottom panel.
 * @param props.children The content of the middle panel.
 * @param props.id The id of the panel group.
 * @param props.onLayout Callback for when the layout changes.
 * @param props.side The side of the visualization the panel group is on.
 */
const VerticalPanelGroup = forwardRef(function VerticalPanelGroup(
  { top, bottom, children, id, onLayout, side }: VerticalPanelGroupProps,
  ref: Ref<ImperativePanelGroupHandle>,
) {
  const topPanelId = `${id}-panel-top`;
  const middlePanelId = `${id}-panel-middle`;
  const bottomPanelId = `${id}-panel-bottom`;
  const {
    setDimension,
    dimensions: { height },
  } = useDimensions();

  const onLayoutWithUpdates: PanelGroupOnLayout = useEventCallback(
    (newLayout: number[]) => {
      setDimension(`${side}_top`, getPanelSize(topPanelId));
      setDimension(`${side}_middle`, getPanelSize(middlePanelId));
      setDimension(`${side}_bottom`, getPanelSize(bottomPanelId));
      onLayout(newLayout);
    },
  );

  return (
    <PanelGroup
      direction="vertical"
      onLayout={onLayoutWithUpdates}
      ref={ref}
      style={{ height }}
    >
      <Panel id={topPanelId} minSize={10}>
        {top}
      </Panel>
      <StyledPanelHandle id={`${id}-resize-tm`} />
      <Panel id={middlePanelId} minSize={25}>
        {children}
      </Panel>
      <StyledPanelHandle id={`${id}-resize-mb`} />
      <Panel
        id={bottomPanelId}
        minSize={15}
        style={{ position: "relative", width: "100%" }}
      >
        {bottom}
      </Panel>
    </PanelGroup>
  );
});

/**
 * Main container for the visualization.
 * Contains a grid of nine panels arranged in a 3x3 grid.
 */
export default function VizContainer() {
  const { theme } = useCellPopTheme();
  const {
    dimensions: { width, height },
    setSideWidth,
  } = useDimensions();

  const id = useId();
  const topLevelRef = useRef<ImperativePanelGroupHandle>(null);
  const leftPanelId = `${id}-left-container`;
  const centerPanelId = `${id}-center-container`;
  const rightPanelId = `${id}-right-container`;
  const leftPanelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const centerPanelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const rightPanelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const [verticalLayout, setVerticalLayout] = useState<number[]>([30, 40, 30]);

  // Keep layout in sync between the three vertical groups
  const onLayout: PanelGroupOnLayout = useEventCallback(
    (newLayout: number[]) => {
      setVerticalLayout(newLayout);
    },
  );
  const onHorizontalLayout: PanelGroupOnLayout = useEventCallback(
    (newLayout: number[]) => {
      topLevelRef.current?.setLayout(newLayout);
      const leftWidth = getPanelSize(leftPanelId).width;
      const centerWidth = getPanelSize(centerPanelId).width;
      const rightWidth = getPanelSize(rightPanelId).width;
      setSideWidth("left", leftWidth);
      setSideWidth("center", centerWidth);
      setSideWidth("right", rightWidth);
    },
  );

  /**
   * Update the layout of the vertical panel groups when the layout changes.
   */
  useEffect(() => {
    for (const ref of [
      leftPanelGroupRef,
      centerPanelGroupRef,
      rightPanelGroupRef,
    ]) {
      const panelGroup = ref.current;
      if (panelGroup) {
        panelGroup.setLayout(verticalLayout);
      }
    }
  }, [verticalLayout]);

  return (
    <PanelGroup
      direction="horizontal"
      className="cellpop"
      id={id}
      ref={topLevelRef}
      style={{ background: theme.background, width, height }}
      defaultValue={["25%", "50%", "25%"]}
      onLayout={onHorizontalLayout}
    >
      <Panel id={leftPanelId} minSize={10}>
        <VerticalPanelGroup
          ref={leftPanelGroupRef}
          id={`${id}-left`}
          onLayout={onLayout}
          top={<Legend />}
          bottom={<LeftGraphScale />}
          side="left"
        >
          <LeftGraph />
        </VerticalPanelGroup>
      </Panel>
      <StyledPanelHandle id={`${id}-resize-left`} />
      <Panel id={centerPanelId} minSize={25}>
        <VerticalPanelGroup
          ref={centerPanelGroupRef}
          id={`${id}-center`}
          onLayout={onLayout}
          top={<TopGraph />}
          bottom={<HeatmapXAxis />}
          side="center"
        >
          <Heatmap />
        </VerticalPanelGroup>
      </Panel>
      <StyledPanelHandle id={`${id}-resize-right`} />
      <Panel id={rightPanelId} minSize={15}>
        <VerticalPanelGroup
          ref={rightPanelGroupRef}
          id={`${id}-right`}
          onLayout={onLayout}
          side="right"
          top={<TopGraphScale />}
        >
          <HeatmapYAxis />
        </VerticalPanelGroup>
      </Panel>
      <Tooltip />
    </PanelGroup>
  );
}
