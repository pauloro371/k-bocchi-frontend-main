import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../../utils/usuarioHooks";
import axios from "axios";
import ListaProductosTicket from "../../../Components/Marketplace/ListaProductosTicket";
import { Container, LoadingOverlay, Paper, Text } from "@mantine/core";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import Vacio from "../../../Components/Vacio";

export default function Ventas({ mes }) {
  const [ventas, setVentas] = useState();
  const {
    terapeuta: { id: id_terapeuta },
  } = useSelector(selectUsuario);
  async function fetchVentas() {
    try {
      let { data } = await axios.get(
        `/ventas/terapeuta/${id_terapeuta}?mes=${Number(mes) + 1}`
      );

      setVentas(data);
    } catch (error) {
      if (!error) return;
      console.log(error);
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
  }
  useEffect(() => {
    setVentas();
    fetchVentas();
  }, [mes]);
  if (ventas === undefined) return <LoadingOverlay overlayBlur={3} visible />;
  if (ventas.length === 0)
    return <Vacio children={<Text>No hay ventas</Text>} />;
  return (
    <Container fluid px="lg">
      <Paper w="100%" shadow="xs" p="md" withBorder>
        <ListaProductosTicket detalles={ventas} />
      </Paper>
    </Container>
  );
}
