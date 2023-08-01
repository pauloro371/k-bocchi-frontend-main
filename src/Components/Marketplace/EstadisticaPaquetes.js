import { Paper, Stack, Text, Title } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";

export default function EstadisticaPaquetes({
  total,
  entregados,
  sinEntregar,
}) {
  const { nombre } = useSelector(selectUsuario);
  return (
    <Paper w="100%" shadow="xs" p="md" withBorder component={Stack} spacing="100px">
      <Title pb="xl" order={3}>¡Hola {nombre}!</Title>
      <Text size="lg" pb="xl">Paquetes entregados: {entregados}</Text>
      <Text size="lg" pb="xl">Paquetes sin entregar: {sinEntregar}</Text>
      <Text size="lg">Paquetes totales: {total}</Text>
    </Paper>
  );
}
