import {
  ActionIcon,
  Button,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  UnstyledButton,
  rem,
} from "@mantine/core";
import CarritoItem from "./CarritoItem";
import { useEffect, useState } from "react";
import Imagen from "../Imagen";
import ControlCantidad from "./ControlCantidad";
import { useMd, useSm, useXs } from "../../utils/mediaQueryHooks";
import CenterHorizontal from "../CenterHorizontal";
import { currencyFormatter } from "../../utils/formatters";
import { FaTrash } from "react-icons/fa";
import ButtonEliminarCarrito from "./BotonEliminarProducto";
import { usePrevious } from "@mantine/hooks";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import axios from "axios";

export default function CarritoProductos({ productos, setProductos }) {
  const md = useMd();
  const xs = useXs();
  return xs ? (
    <VistaGrande productos={productos} setProductos={setProductos} />
  ) : (
    <VistaMovil productos={productos} setProductos={setProductos} />
  );
}

function VistaGrande({ productos, setProductos }) {
  const md = useMd();
  const xs = useXs();
  return (
    <Table>
      <thead>
        <tr>
          <th>
            {md ? (
              <Text>Producto</Text>
            ) : (
              <CenterHorizontal>
                <Text>Producto</Text>
              </CenterHorizontal>
            )}
          </th>
          <th>
            <CenterHorizontal>
              <Text>Cantidad</Text>
            </CenterHorizontal>
          </th>
          <th>
            <CenterHorizontal>
              <Text>Precio</Text>
            </CenterHorizontal>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {productos.map(({ producto, ...carritoItem }) => (
          <tr key={producto.id}>
            <td width={"30%"}>
              <Grid w={md ? "100%" : "auto"}>
                <Grid.Col span={12} md={12}>
                  <Text fw="bold" fz="lg">
                    {producto.nombre}
                  </Text>
                  <Imagen image={producto.imagen} heightSkeleton="20vh" />
                </Grid.Col>
              </Grid>
            </td>
            <td>
              <CenterHorizontal>
                <ModificarCantidad
                  carritoItem={carritoItem}
                  setProductos={setProductos}
                  size={xs ? 42 : 20}
                  heightInput={xs ? 42 : 20}
                  widthInput={rem(xs ? 54 : 45)}
                  min={1}
                />
              </CenterHorizontal>
            </td>
            <td>
              <Text ta="center">
                <Text>
                  {currencyFormatter.format(
                    producto.precio * carritoItem.cantidad
                  )}
                </Text>
                <Text fz="xs" color="dimmed">
                  Precio unitario: {currencyFormatter.format(producto.precio)}
                </Text>
              </Text>
            </td>
            <td>
              <CenterHorizontal>
                <ButtonEliminarCarrito
                  setProductos={setProductos}
                  producto={producto}
                >
                  <EliminarProductoCarrito />
                </ButtonEliminarCarrito>
              </CenterHorizontal>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
function VistaMovil({ productos, setProductos }) {
  const md = useMd();
  const xs = useXs();
  return (
    <div>
      {productos.map(({ producto, ...carritoItem }) => (
        <Flex
          style={{ borderTop: "1px solid gray" }}
          align="center"
          wrap="wrap"
          my="md"
          pos="relative"
          key={producto.id}
        >
          <Stack style={{ flex: "1" }} align="center" h="100%" mb="md">
            <Text fw="bold" fz="lg" ta="start">
              {producto.nombre}
            </Text>
            <Imagen
              image={producto.imagen}
              width="50vw"
              heightSkeleton="20vh"
            />
          </Stack>

          <Flex
            align="center"
            direction="column"
            justify="center"
            style={{ flex: "1" }}
          >
            <Text>
              <ModificarCantidad
                carritoItem={carritoItem}
                setProductos={setProductos}
                size={42}
                heightInput={42}
                widthInput={rem(54)}
                min={1}
              />
              <Text ta="center">
                {currencyFormatter.format(
                  producto.precio * carritoItem.cantidad
                )}
              </Text>
              <Text ta="center" fz="xs" color="dimmed">
                Precio unitario: {currencyFormatter.format(producto.precio)}
              </Text>
            </Text>
            <ButtonEliminarCarrito
              producto={producto}
              setProductos={setProductos}
            >
              <Button color="red">Sacar del carrito</Button>
            </ButtonEliminarCarrito>
          </Flex>

          {/* <EliminarProductoCarrito pos="absolute" /> */}
        </Flex>
      ))}
    </div>
  );
}

function ModificarCantidad({ setProductos, carritoItem, ...props }) {
  const [actualValue, setActualValue] = useState(carritoItem.cantidad);
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    console.log({ actualValue });
  }, [actualValue]);
  async function handleChange(cantidad) {
    try {
      let res = await axios.post("/carrito/set", {
        ...carritoItem,
        cantidad,
      });
      showPositiveFeedbackNotification("¡Se ha cambiado el carrito!");
      setProductos((ps) =>
        ps.map((p) =>
          p.id_producto === carritoItem.id_producto ? { ...p, cantidad } : p
        )
      );
      return cantidad;
    } catch (err) {
      if (!err) return null;
      if (err.response.status === 500) {
        showNegativeFeedbackNotification(
          "Lo lamentamos, algo ha salido mal 😥"
        );
        return null;
      }
      let mensaje;
      if (err.response.status === 420) {
        //Ya no hay stock para este producto
        // setStock(0);
        mensaje = "Este producto se encuentra agotado";
      }
      if (err.response.status === 421) {
        //No hay stock suficiente para la cantidad requerida
        mensaje = "No hay stock suficiente";
        // setStock(data.stock_carrito);
      }
      showNegativeFeedbackNotification(mensaje);
    }
    return null;
  }
  return (
    <ControlCantidad
      onBlur={async (value, setValue) => {
        if (actualValue === value) return;
        setCargando(true);
        let resultado = await handleChange(value);
        setCargando(false);
        if (resultado !== null) {
          //condicion de correcto
          setActualValue(value);
        } else {
          setValue(actualValue);
        }
      }}
      disabled={cargando}
      initialValue={carritoItem.cantidad}
      {...props}
    />
  );
}

function EliminarProductoCarrito({ ...props }) {
  return (
    <ActionIcon variant="light" color="red" {...props}>
      <FaTrash />
    </ActionIcon>
  );
}
