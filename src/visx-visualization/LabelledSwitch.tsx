import {
  FormControlLabel,
  InputLabel,
  Stack,
  Switch,
  SwitchProps,
} from "@mui/material";
import React from "react";
import InfoTooltip from "./InfoTooltip";

interface LabelledSwitchProps extends SwitchProps {
  leftLabel: string;
  rightLabel: string;
  label: string;
  tooltip?: string;
}

export default function LabelledSwitch({
  leftLabel,
  rightLabel,
  label,
  tooltip,
  ...rest
}: LabelledSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Stack direction="row" gap={1} alignItems="center">
          <InputLabel>{leftLabel}</InputLabel>
          <Switch {...rest} />
          <InputLabel>{rightLabel}</InputLabel>
        </Stack>
      }
      label={
        <InputLabel
          color="primary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {label} <InfoTooltip title={tooltip} />
        </InputLabel>
      }
      labelPlacement="top"
    />
  );
}
