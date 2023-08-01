import { Text } from "@mantine/core";
import LabelNota from "./LabelNota";

export default function ContenidoCompleto({
  label,
  contenido,
  labelProps,
  ...props
}) {
  return (
    <Text {...props} style={{ wordWrap: "break-word", width: "90%" }}>
      <LabelNota label={label} {...labelProps} />
      <Text>{contenido}</Text>
    </Text>
  );
}
