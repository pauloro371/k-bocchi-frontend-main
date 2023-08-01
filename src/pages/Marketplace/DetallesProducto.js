import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Text,
  Title,
} from "@mantine/core";
import Imagen from "../../Components/Imagen";
import DisponibilidadProducto from "../../Components/Marketplace/DisponibilidadProducto";
import { currencyFormatter } from "../../utils/formatters";
import CategoriaProducto from "../../Components/Marketplace/CategoriaProducto";
import BadgeNuevo from "../../Components/Marketplace/BadgeNuevo";
import { useSm } from "../../utils/mediaQueryHooks";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { PACIENTE } from "../../roles";
import Vendedor from "../../Components/Marketplace/Vendedor";
import ControlCantidad from "../../Components/Marketplace/ControlCantidad";
import BotonAnadirCarrito from "../../Components/Marketplace/BotonAnadirCarrito";

export default function DetallesProducto() {
  let { id_producto } = useParams();
  let [cargando, setCargando] = useState(true);
  let [producto, setProducto] = useState();
  let { rol } = useSelector(selectUsuario);
  let [stockCarrito, setStockCarrito] = useState();
  const sm = useSm();
  async function fetchProducto() {
    setCargando(true);
    try {
      let { data: producto_encontrado } = await axios.get(
        `/productos/${id_producto}`
      );
      setProducto(producto_encontrado);
    } catch (error) {
      if (error) {
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      }
      console.log(error);
    }
    setCargando(false);
  }
  useEffect(() => {
    fetchProducto();
  }, []);
  useEffect(() => {
    if (producto) {
      setStockCarrito(producto.stock_carrito);
    }
  }, [producto]);
  if (cargando === true) return <LoadingOverlay visible overlayBlur={2} />;
  return (
    <Container>
      <Grid justify="center">
        <Grid.Col sm={6} h={{ sm: "80vh" }}>
          {!sm && <Encabezado producto={producto} />}
          <Imagen image={producto.imagen} fit="cover" />
        </Grid.Col>
        <Grid.Col sm={6}>
          {sm && <Encabezado producto={producto} />}
          <Text mb="md">{producto.caracteristicas}</Text>
          <Vendedor
            imagen_vendedor={producto.terapeuta.usuario.foto_perfil}
            nombre_vendedor={producto.terapeuta.usuario.nombre}
          />
          <Box my="md">
            <Text fw="bold" style={{ wordWrap: "break-word", width: "90%" }}>
              Disponibilidad
            </Text>
            <DisponibilidadProducto stock={stockCarrito} />
          </Box>
          {rol === PACIENTE && (
            <>
              <BotonAnadirCarrito
                stock={stockCarrito}
                setStock={setStockCarrito}
                id_producto={id_producto}
                
              />
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

function Encabezado({ producto }) {
  return (
    <Box mb="md">
      <Group mb="md" align="center">
        <Title order={2} style={{ wordWrap: "break-word", width: "90%" }}>
          {producto.nombre}
        </Title>
        <CategoriaProducto categoria={producto.categoria} />
        <BadgeNuevo isNuevo={producto.isNuevo} />
      </Group>
      <Title mb="md" order={4}>
        {currencyFormatter.format(producto.precio)}
      </Title>
    </Box>
  );
}
