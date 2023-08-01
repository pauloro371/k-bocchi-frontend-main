import {
  Button,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import FilaProducto from "./FilaProducto";
import { useSm } from "../../utils/mediaQueryHooks";
import { modals } from "@mantine/modals";
import CrearProducto from "./CrearProducto";
import CenterHorizontal from "../CenterHorizontal";
import Vacio from "../Vacio";
import { BsGraphDownArrow } from "react-icons/bs";

export default function TablaProductos() {
  const [productos, setProductos] = useState();
  let { terapeuta } = useSelector(selectUsuario);
  const sm = useSm();

  async function fecthProductos() {
    try {
      let { id: id_terapeuta } = terapeuta;
      let { data } = await axios.get(`/productos/terapeuta/${id_terapeuta}`);
      console.log({ data });
      setProductos(data);
    } catch (err) {
      console.log(err);
      if (err) {
        let {
          response: { data },
        } = err;
        showNegativeFeedbackNotification(data);
      }
    }
  }
  useEffect(() => {
    fecthProductos();
  }, []);
  useEffect(() => {
    console.log({ productos });
  }, [productos]);
  function mostrarModalCrearProducto() {
    modals.open({
      title: <Title order={3}>Crear producto</Title>,
      children: (
        <CrearProducto
          onCrear={(producto) => {
            setProductos((ps) => [{ ...producto }, ...ps]);
            modals.closeAll();
          }}
        />
      ),
    });
  }
  if (productos === undefined)
    return <LoadingOverlay visible overlayBlur={2} />;
  return productos.length === 0 ? (
    <Vacio
      children={
        <Stack align="center" fz="xl">
          <Text color="dimmed">No hay productos</Text>
          <BsGraphDownArrow color="gray" />
          <Button onClick={mostrarModalCrearProducto} variant="siguiente">
            ¡Añade un producto!
          </Button>
        </Stack>
      }
    />
  ) : (
    <>
      <Flex justify="end" pr="sm">
        <Button onClick={mostrarModalCrearProducto} variant="siguiente">
          Añadir producto
        </Button>
      </Flex>
      <ScrollArea style={{ flex: "1" }}>
        <Table w={sm ? "100%" : "130%"}>
          <thead>
            <tr>
              <th></th>
              <th>
                <CenterHorizontal>
                  <Text>Producto</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Caracteristicas</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Precio</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Stock</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Categoria</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Vendidos</Text>
                </CenterHorizontal>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <FilaProducto
                producto={producto}
                key={producto.id}
                onEditar={(producto) => {
                  setProductos((ps) =>
                    ps.map((p) => (p.id === producto.id ? producto : p))
                  );
                  modals.closeAll();
                }}
                onEliminar={(id_producto) => {
                  setProductos((ps) => ps.filter((p) => p.id !== id_producto));
                  modals.closeAll();
                }}
              />
            ))}
          </tbody>
        </Table>
      </ScrollArea>
      {/* <div
        style={{
          overflowY: "scroll",
          overflowX: "scroll",
          flex: "1",
          maxWidth: "100%",
        }}
      >
      </div> */}
    </>
  );
}

