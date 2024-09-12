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
import DragOverlay from "./DragOverlay";
import Heatmap from "./Heatmap";
import HeatmapXAxis from "./HeatmapXAxis";
import HeatmapYAxis from "./HeatmapYAxis";
import LeftGraph from "./LeftGraph";
import { Legend } from "./Legend";
import TopGraph from "./TopGraph";

interface VerticalPanelGroupProps extends PropsWithChildren {
  id: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  onLayout: PanelGroupOnLayout;
  side: "left" | "center" | "right";
}

function StyledPanelHandle(props: PanelResizeHandleProps) {
  return <PanelResizeHandle {...props} style={{ background: "black" }} />;
}

function getPanelSize(id: string) {
  const panel = getPanelElement(id);
  return panel.getBoundingClientRect();
}

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
      <Panel id={middlePanelId}>{children}</Panel>
      <StyledPanelHandle id={`${id}-resize-mb`} />
      <Panel id={bottomPanelId} minSize={10}>
        {bottom}
      </Panel>
    </PanelGroup>
  );
});

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
      <Panel id={leftPanelId}>
        <VerticalPanelGroup
          ref={leftPanelGroupRef}
          id={`${id}-left`}
          onLayout={onLayout}
          top={<Legend />}
          side="left"
        >
          <LeftGraph />
        </VerticalPanelGroup>
      </Panel>
      <StyledPanelHandle id={`${id}-resize-left`} />
      <Panel id={centerPanelId}>
        <VerticalPanelGroup
          ref={centerPanelGroupRef}
          id={`${id}-center`}
          onLayout={onLayout}
          top={<TopGraph />}
          bottom={<HeatmapXAxis />}
          side="center"
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Heatmap />
            <DragOverlay />
          </div>
        </VerticalPanelGroup>
      </Panel>
      <StyledPanelHandle id={`${id}-resize-right`} />
      <Panel id={rightPanelId}>
        <VerticalPanelGroup
          ref={rightPanelGroupRef}
          id={`${id}-right`}
          onLayout={onLayout}
          side="right"
        >
          <HeatmapYAxis />
        </VerticalPanelGroup>
      </Panel>
    </PanelGroup>
  );
}
