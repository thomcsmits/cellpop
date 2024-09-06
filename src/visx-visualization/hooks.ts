import { scaleLinear } from "@visx/scale";
import { useMemo } from "react";

export function useCountsScale(domain: number[], range: number[]) {
  return useMemo(() => {
    return scaleLinear<number>({
      domain,
      range,
      nice: true,
    });
  }, [domain, range]);
}
