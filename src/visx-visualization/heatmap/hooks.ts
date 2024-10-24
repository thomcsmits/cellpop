import { useCallback, useEffect } from "react";
import { AxisConfig } from "../../contexts/AxisConfigContext";

export function useOpenInNewTab(
  createHref: ((tick: string) => string) | undefined,
) {
  return useCallback(
    (tick: string) => {
      const href = createHref?.(tick);
      if (href) {
        window.open(href, "_blank");
      }
    },
    [createHref],
  );
}

export function useTickTitle(
  createHref: ((tick: string) => string) | undefined,
) {
  return useCallback(
    (tick: string) =>
      createHref ? `${tick} (Click to view in new tab)` : tick,
    [createHref],
  );
}

export function useHeatmapAxis(
  { createHref, label, flipAxisPosition }: AxisConfig,
  filterId?: string,
) {
  const openInNewTab = useOpenInNewTab(createHref);
  const tickTitle = useTickTitle(createHref);
  const tickLabelStyle = {
    fontVariantNumeric: "tabular-nums",
    cursor: createHref ? "pointer" : "default",
  };
  return { openInNewTab, tickTitle, tickLabelStyle };
}

// Calculates the size of the tick labels if the axis is flipped,
// so that the counts bars can be positioned correctly
export function useSetTickLabelSize(
  flipAxisPosition: boolean,
  setTickLabelSize: (size: number) => void,
  orientation: "x" | "y" = "x",
  // Size is not actually used, but changes to this value let us know when to recalculate
  size: number,
) {
  useEffect(() => {
    if (flipAxisPosition) {
      const ticks = document.getElementsByClassName(
        `${orientation}-axis-tick-label`,
      );
      if (ticks.length > 0) {
        const tickBounds = Array.from(ticks).map((t) =>
          t.getBoundingClientRect(),
        );
        const maxSize = Math.max(...tickBounds.map((b) => orientation === 'x' ? b.height : b.width));
        setTickLabelSize(maxSize);
      }
    } else {
      setTickLabelSize(0);
    }
  }, [flipAxisPosition, orientation, size]);
}
