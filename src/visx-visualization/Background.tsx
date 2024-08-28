import React from "react";

interface BackgroundProps {
  width: number;
  height: number;
}

export default function Background({width, height}: BackgroundProps) {
  return <rect width={width} height={height} />;
}