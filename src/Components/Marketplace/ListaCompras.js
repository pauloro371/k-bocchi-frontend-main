import { Link } from "react-router-dom";
import { colocarFecha } from "../../utils/fechas";
import Vacio from "../Vacio";
import { Box, Container, Flex, Paper, Space, Stack, Text } from "@mantine/core";
import { currencyFormatter } from "../../utils/formatters";

export default function ListaCompras({ compras }) {
  if (compras.length === 0)
    return <Vacio children={<Text>No hay compras aún</Text>} />;
  return (
    <Flex wrap="wrap" gap="lg">
      {compras.map(({ id, fecha, total }) => (
        <Paper
          key={id}
          w="fit-content"
          shadow="xs"
          p="md"
          withBorder
          component={Link}
          to={`../ticket/${id}`}
        >
          <Info label="Fecha" value={colocarFecha(fecha)} />
          <Info label="Costo" value={currencyFormatter.format(total)} />
          <Info label="id" value={id} />
        </Paper>
      ))}
    </Flex>
  );
}
function Info({ label, value }) {
  return (
    <Text>
      <Text span fw="bold" color="dark.4">
        {label}:{" "}
      </Text>
      <Text span>{value}</Text>
    </Text>
  );
}
