import { Box, Container, Flex, Paper, Space, Stack, Text } from "@mantine/core";
import Vacio from "../Vacio";
import BadgeEstadoPaquete from "./BadgesPaquete/BadgeEstadoPaquete";
import {
  FormatUTCTime,
  colocarFecha,
  formatearFecha,
} from "../../utils/fechas";
import { Link } from "react-router-dom";

export default function ListaPaquetes({ paquetes }) {
  if (paquetes.length === 0)
    return <Vacio children={<Text>No hay paquetes</Text>} />;
  return (
    <Stack w="100%" spacing="md">
      {paquetes.map(
        ({
          id,
          direccion_destino,
          numero_exterior_destino,
          estado_destino,
          ciudad_destino,
          estatus,
          ticket,
          terapeuta,
          fecha_creacion,
        }) => {
          let { nombre } = terapeuta
            ? terapeuta.usuario
            : ticket.paciente.usuario;
          return (
            <Paper
              key={id}
              w="100%"
              shadow="xs"
              p="md"
              withBorder
              component={Link}
              to={`../${id}`}
            >
              <Flex justify="space-between" mb="sm">
                <Text size="lg" fw="bold" color="dark.3">
                  {nombre}
                </Text>
                <BadgeEstadoPaquete estado={estatus} />
              </Flex>
              <Container>
                <Text>
                  {numero_exterior_destino} {direccion_destino} {ciudad_destino}{" "}
                  {estado_destino}
                </Text>
                <Text fw="bold" color="dark.2">
                  Fecha pedido:{" "}
                  <Text fw="normal" span>
                    {colocarFecha(fecha_creacion)}
                  </Text>
                </Text>
              </Container>
            </Paper>
          );
        }
      )}
    </Stack>
  );
}
