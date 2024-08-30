import { mean } from "d3";

// Kernel Density Estimation
export function kde<T extends number>(
  kernel: (input: number) => number,
  thds: number[],
) {
  return (V: Iterable<T>) =>
    thds.map((t) => [t, mean(V, (d: T) => kernel(t - d))]);
}

// Epanechnikov kernel
export function epanechnikov(bandwidth: number) {
  return (x: number) =>
    Math.abs((x /= bandwidth)) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0;
}
