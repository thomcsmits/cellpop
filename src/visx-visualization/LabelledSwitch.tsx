import {
  FormControlLabel,
  InputLabel,
  Stack,
  Switch,
  SwitchProps,
} from "@mui/material";
import React from "react";

interface LabelledSwitchProps extends SwitchProps {
  leftLabel: string;
  rightLabel: string;
  label: string;
}

export default function LabelledSwitch({
  leftLabel,
  rightLabel,
  label,
  ...rest
}: LabelledSwitchProps) {
  console.log({ ...rest });
  return (
    <FormControlLabel
      control={
        <Stack direction="row" gap={1} alignItems="center">
          <InputLabel>{leftLabel}</InputLabel>
          <Switch {...rest} />
          <InputLabel>{rightLabel}</InputLabel>
        </Stack>
      }
      label={<InputLabel color="primary">{label}</InputLabel>}
      labelPlacement="top"
    />
  );
}
