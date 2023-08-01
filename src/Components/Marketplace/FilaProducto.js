import { Center, Flex, Menu, Text, Title, UnstyledButton } from "@mantine/core";
import Imagen from "../Imagen";
import MenuElipse from "../MenuElipse";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import CenterHorizontal from "../CenterHorizontal";
import { modals } from "@mantine/modals";
import EditarProducto from "./EditarProducto";
import EliminarProducto from "./EliminarProducto";
import { useShallowEffect } from "@mantine/hooks";
import { useRef, useState } from "react";
import { currencyFormatter } from "../../utils/formatters";
import CategoriaProducto from "./CategoriaProducto";

export default function FilaProducto({ producto, onEliminar, onEditar }) {
  const imagenRef = useRef(null);
  const [firstRender, setFirstRender] = useState(false);
  function mostrarModalEditar() {
    modals.open({
      title: <Title order={3}>Editar producto</Title>,
      children: <EditarProducto onEditar={onEditar} producto={producto} />,
    });
  }
  function mostrarModalEliminar() {
    modals.open({
      title: <Title order={3}>Eliminar producto</Title>,
      children: <EliminarProducto onEliminar={onEliminar} producto={producto} />,
    });
  }
  useShallowEffect(() => {
    if (firstRender) imagenRef.current.loadFotoPerfil();
  }, [producto.imagen]);
  return (
    <tr>
      <td width="10%">
        <Imagen
          image={producto.imagen}
          ref={imagenRef}
          onImageLoaded={() => {
            setFirstRender(true);
          }}
        />
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Text>{producto.nombre}</Text>
        </CenterHorizontal>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Text>{producto.caracteristicas}</Text>
        </CenterHorizontal>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Text>{currencyFormatter.format(producto.precio)}</Text>
        </CenterHorizontal>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Text>{producto.stock}</Text>
        </CenterHorizontal>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <CategoriaProducto categoria={producto.categoria}/>
          
        </CenterHorizontal>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Text>{producto.cantidad_vendida}</Text>
        </CenterHorizontal>
      </td>

      <td width="6%">
        <Flex w="100%" justify="center">
          <MenuElipse>
            <Menu.Item
              color="blue"
              icon={<MdEdit />}
              onClick={mostrarModalEditar}
            >
              Editar
            </Menu.Item>
            <Menu.Item
              color="red"
              icon={<MdOutlineDelete />}
              onClick={mostrarModalEliminar}
            >
              Eliminar
            </Menu.Item>
          </MenuElipse>
        </Flex>
      </td>
    </tr>
  );
}
