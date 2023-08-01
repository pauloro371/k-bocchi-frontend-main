import { Container, Grid, LoadingOverlay, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import Vacio from "../../Components/Vacio";
import CarritoProductos from "../../Components/Marketplace/CarritoProductos";
import Checkout from "../../Components/Marketplace/Checkout";

export default function Carrito() {
  const [carrito, setCarrito] = useState();
  const [cargando, setCargando] = useState(true);
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  async function fetchCarrito() {
    setCargando(true);
    try {
      let { data: carrito } = await axios.get(`/carrito/${id_paciente}`);
      setCarrito(carrito);
    } catch (err) {
      if (!err) return err;
      let {
        response: { data },
      } = err;
      showNegativeFeedbackNotification(data);
    }
    setCargando(false);
  }
  useEffect(() => {
    fetchCarrito();
  }, []);
  if (cargando) return <LoadingOverlay visible overlayBlur={2} />;
  return carrito.length === 0 ? (
    <Vacio children={<Text>No tienes productos en tu carrito</Text>} />
  ) : (
    <Container fluid px="xl">
      <Grid>
        <Grid.Col span={12} md={8}>
          <Title>Carrito</Title>
          <CarritoProductos productos={carrito} setProductos={setCarrito} />
        </Grid.Col>
        <Grid.Col span={12} md={4}>
          <Title>Checkout</Title>
          <Checkout carrito={carrito} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
