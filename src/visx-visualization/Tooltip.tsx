import { Divider, Stack, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { defaultStyles, TooltipWithBounds } from "@visx/tooltip";
import React, { useEffect } from "react";
import { useParentRef } from "../contexts/ContainerRefContext";
import {
  useSetTooltipData,
  useTooltipData,
} from "../contexts/TooltipDataContext";

/**
 * Component which renders a basic tooltip with the data set in the tooltip data context.
 * @returns
 */
export default function Tooltip() {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, contextMenuOpen } =
    useTooltipData();
  const { closeTooltip } = useSetTooltipData();

  const parentRef = useParentRef();
  const visualizationBounds = parentRef.current?.getBoundingClientRect();
  const theme = useTheme();

  useEffect(() => {
    if (!tooltipData) {
      closeTooltip();
    }
  }, [tooltipData, closeTooltip]);

  if (!tooltipOpen || contextMenuOpen) {
    return null;
  }

  return (
    <TooltipWithBounds
      top={tooltipTop - (visualizationBounds?.top ?? 0)}
      left={tooltipLeft - (visualizationBounds?.left ?? 0)}
      style={{
        ...defaultStyles,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <Stack gap={0.25}>
        <Typography variant="subtitle1">{tooltipData?.title}</Typography>
        <Divider />
        {tooltipData?.data &&
          Object.entries(tooltipData.data).map(([key, value]) => (
            <Stack direction="row" key={key} gap={0.25}>
              <Typography
                sx={{ textTransform: "capitalize", fontWeight: 700 }}
                variant="caption"
              >
                {key.replace("_", " ")}:{" "}
              </Typography>
              <Typography variant="caption">{String(value)}</Typography>
            </Stack>
          ))}
      </Stack>
    </TooltipWithBounds>
  );
}
