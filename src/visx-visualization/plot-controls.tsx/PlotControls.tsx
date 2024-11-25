import { CloseRounded, Settings } from "@mui/icons-material";
import Button from "@mui/material/Button";
import React, { PropsWithChildren, useState } from "react";
import { useParentRef } from "../../contexts/ContainerRefContext";

import {
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useEventCallback,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import {
  useColumnConfig,
  useRowConfig,
} from "../../contexts/AxisConfigContext";
import { DisplayControls } from "./DisplayControls";
import {
  PlotControlsSection,
  PlotControlsSectionProvider,
} from "./PlotControlsContext";
import { SortControls } from "./SortControls";

interface PlotControlsProps {
  onClose: () => void;
}

interface PlotControlSectionProps extends PropsWithChildren {
  selectedValue: PlotControlsSection;
  value: PlotControlsSection;
}

function PlotControlSection({
  value,
  selectedValue,
  ...other
}: PlotControlSectionProps) {
  return (
    <PlotControlsSectionProvider value={value}>
      <div
        role="tabpanel"
        hidden={value !== selectedValue}
        id={`tabpanel-${value}`}
        aria-labelledby={`simple-tab-${value}`}
        {...other}
      >
        <SortControls />
        <DisplayControls />
      </div>
    </PlotControlsSectionProvider>
  );
}

function PlotControls({ onClose }: PlotControlsProps) {
  const [selectedTab, setSelectedTab] = useState<PlotControlsSection>("Column");
  const columnLabel = useColumnConfig((s) => s.label);
  const rowLabel = useRowConfig((s) => s.label);

  return (
    <Stack spacing={2} padding={2} direction="column">
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        <Typography variant="h5" component="label">
          Plot Controls
        </Typography>
        <IconButton aria-label="Close Plot Controls" onClick={onClose}>
          <CloseRounded />
        </IconButton>
      </Stack>
      <Tabs
        variant="fullWidth"
        value={selectedTab}
        onChange={(_e, value) => setSelectedTab(value)}
      >
        <Tab label={`Column: ${columnLabel}`} value="Column" />
        <Tab label={`Row: ${rowLabel}`} value="Row" />
      </Tabs>
      <PlotControlSection value="Column" selectedValue={selectedTab} />
      <PlotControlSection value="Row" selectedValue={selectedTab} />
    </Stack>
  );
}

export function PlotControlsButton() {
  const parentRef = useParentRef();
  const [showDrawer, setShowDrawer] = useState(false);
  const closeDrawer = useEventCallback(() => setShowDrawer(false));
  const openDrawer = useEventCallback(() => setShowDrawer(true));
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Settings />}
        sx={{ whiteSpace: "nowrap" }}
        onClick={openDrawer}
      >
        Plot Controls
      </Button>
      <Drawer
        container={parentRef.current}
        open={showDrawer}
        onClose={closeDrawer}
        anchor="right"
      >
        <PlotControls onClose={closeDrawer} />
      </Drawer>
    </>
  );
}
