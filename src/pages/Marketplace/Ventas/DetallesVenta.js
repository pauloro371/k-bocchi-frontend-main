import {
  Text,
  Container,
  Grid,
  Paper,
  Flex,
  LoadingOverlay,
  Stack,
  Group,
  ScrollArea,
  Title,
  Avatar,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Vacio from "../../../Components/Vacio";
import Info from "../../../Components/Marketplace/Info";
import { colocarFecha } from "../../../utils/fechas";
import { currencyFormatter } from "../../../utils/formatters";
import ImagenAvatar from "../../../Components/ImagenAvatar";
import Imagen from "../../../Components/Imagen";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../../utils/usuarioHooks";
import { FISIOTERAPEUTA, PACIENTE } from "../../../roles";
import ListaProductosTicket from "../../../Components/Marketplace/ListaProductosTicket";

export default function DetallesVenta() {
  const [venta, setVenta] = useState();
  const { id: id_ticket } = useParams();
  const { rol, terapeuta } = useSelector(selectUsuario);
  async function fetchVenta() {
    try {
      let endpoint = `/ventas/${id_ticket}`;
      if (rol === FISIOTERAPEUTA)
        endpoint = endpoint + "?id_terapeuta=" + terapeuta.id;
      let { data } = await axios.get(endpoint);
      if (rol === FISIOTERAPEUTA) {
        let total = data.detalles.reduce(
          (acc, { subtotal }) => acc + subtotal,
          0
        );
        data.total = total;
      }
      setVenta(data);
    } catch (error) {
      if (!error) return;
      console.log(error);
      if (error.response.status === 404) setVenta(null);
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
  }
  useEffect(() => {
    fetchVenta();
  }, []);
  if (venta === undefined) return <LoadingOverlay visible overlayBlur={3} />;
  if (venta === null)
    return <Vacio children={<Text>No se encontro la venta</Text>} />;
  return (
    <Container>
      <Title>Detalles de la venta</Title>
      <Paper w="100%" shadow="xs" p="md" withBorder>
        <Info label="Id" value={venta.id} />
        <Group>
          <Info label="Comprador" />
          <Group>
            <ImagenAvatar image={venta.paciente.usuario.foto_perfil} mx={0} />
            <Text>{venta.paciente.usuario.nombre}</Text>
          </Group>
        </Group>
        <Info label="Fecha" value={colocarFecha(venta.fecha)} />
        <Flex justify="end" direction="column" align="end" w="100%">
          {rol === PACIENTE && (
            <>
              <Flex justify="space-between">
                <Text span>Subtotal:</Text>
                <Text span> {currencyFormatter.format(venta.subtotal)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text span>Envio:</Text>
                <Text span> {currencyFormatter.format(venta.costo_envio)}</Text>
              </Flex>
            </>
          )}
          <Flex justify="space-between">
            <Text span>Total:</Text>
            <Text span> {currencyFormatter.format(venta.total)}</Text>
          </Flex>
        </Flex>
      </Paper>
      <Paper w="100%" shadow="xs" p="md" withBorder mt="md">
        <ListaProductosTicket detalles={venta.detalles}/>
      </Paper>
    </Container>
  );
}
