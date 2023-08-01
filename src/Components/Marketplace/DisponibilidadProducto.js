import { Badge, Text } from "@mantine/core";
import { numberFormatter } from "../../utils/formatters";

export default function DisponibilidadProducto({ stock, textProps }) {
  return stock !== 0 ? (
    <Text {...textProps}>{numberFormatter.format(stock)} piezas</Text>
  ) : (
    <Badge>Agotado</Badge>
  );
}
