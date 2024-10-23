import { scaleLinear } from "@visx/scale";
import { useMemo } from "react";

/**
 * Generates a linear scale for the counts bars with the provided domain and range.
 * @param domain
 * @param range
 * @returns
 */
export function useCountsScale(domain: number[], range: number[]) {
  return useMemo(() => {
    return scaleLinear<number>({
      domain,
      range,
      nice: true,
    });
  }, [domain, range]);
}
