import { Badge } from "@mantine/core";

export default function BadgeNuevo({ isNuevo }) {
  return isNuevo ? (
    <Badge leftSection="🔥" color="orange">
      ¡Nuevo!
    </Badge>
  ) : (
    <></>
  );
}
