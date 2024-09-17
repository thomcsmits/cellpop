import { useTooltip } from "@visx/tooltip";
import React, { PropsWithChildren, useMemo } from "react";
import { createContext, useContext } from "../utils/context";

interface TooltipData {
  title: string;
  data: Record<string, unknown>;
}

interface TooltipDataContextType {
  tooltipData: TooltipData | null;
  tooltipOpen: boolean;
  tooltipLeft: number;
  tooltipTop: number;
}

const TooltipDataContext = createContext<TooltipDataContextType>("TooltipData");

interface TooltipActionsContextType {
  openTooltip: (data: TooltipData, left: number, top: number) => void;
  closeTooltip: () => void;
}

const TooltipActionsContext =
  createContext<TooltipActionsContextType>("SetTooltipData");

export const useTooltipData = () => useContext(TooltipDataContext);
export const useSetTooltipData = () => useContext(TooltipActionsContext);

/**
 * Provider which manages the tooltip data and actions for displaying tooltips.
 */
export function TooltipDataProvider({ children }: PropsWithChildren) {
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>({
    tooltipOpen: false,
    tooltipData: null,
  });

  const tooltipDataContext = useMemo(
    () => ({
      tooltipData,
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
    }),
    [tooltipData, tooltipOpen, tooltipLeft, tooltipTop],
  );

  const tooltipActionsContext = useMemo(() => {
    const openTooltip = (data: TooltipData, left: number, top: number) => {
      showTooltip({ tooltipData: data, tooltipLeft: left, tooltipTop: top });
    };
    const closeTooltip = () => {
      hideTooltip();
    };
    return { openTooltip, closeTooltip };
  }, [showTooltip]);

  return (
    <TooltipDataContext.Provider value={tooltipDataContext}>
      <TooltipActionsContext.Provider value={tooltipActionsContext}>
        {children}
      </TooltipActionsContext.Provider>
    </TooltipDataContext.Provider>
  );
}
