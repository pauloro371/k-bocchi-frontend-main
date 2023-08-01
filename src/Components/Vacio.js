import { Overlay, useMantineTheme } from "@mantine/core";

export default function Vacio({ children,...props }) {
  const theme = useMantineTheme();
  return (
    <Overlay center color={theme.colors["blue-calmer"][4]} opacity={0.05}>
      {children}
    </Overlay>
  );
}
