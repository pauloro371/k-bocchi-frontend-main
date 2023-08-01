import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function useXs() {
  const theme = useMantineTheme();
  const big = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);
  return big;
}

export function useMd() {
  const theme = useMantineTheme();
  const mid = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  return mid;
}
export function useSm() {
  const theme = useMantineTheme();
  const sm = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  return sm;
}
