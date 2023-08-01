import {
  ActionIcon,
  Center,
  Flex,
  Group,
  Menu,
  PasswordInput,
  Spoiler,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import Imagen from "../Imagen";
import MenuElipse from "../MenuElipse";
import { MdEdit, MdOutlineDelete, MdVideoChat } from "react-icons/md";
import CenterHorizontal from "../CenterHorizontal";
import { modals } from "@mantine/modals";
import { useDisclosure, useShallowEffect } from "@mantine/hooks";
import { useRef, useState } from "react";
import EditarSala from "./EditarSala";
import ImagenAvatar from "../ImagenAvatar";
import EliminarSala from "./EliminarSala";
import { FormatUTCDateTime, formatearFecha } from "../../utils/fechas";
import { IoEyeOutline } from "react-icons/io";
import {
  HiEye,
  HiEyeSlash,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

export default function FilaSala({ sala, onEditar, onEliminar }) {
  const imagenRef = useRef(null);
  const [firstRender, setFirstRender] = useState(false);
  const [mostrarCodigo, handlers] = useDisclosure(false);
  const navigate = useNavigate();
  function mostrarModalEditar() {
    modals.open({
      title: <Title order={3}>Editar sala</Title>,
      children: <EditarSala onEditar={onEditar} sala={sala} />,
    });
  }
  function mostrarModalEliminar() {
    modals.open({
      title: <Title order={3}>Eliminar sala</Title>,
      children: <EliminarSala onEliminar={onEliminar} sala={sala} />,
    });
  }
  useShallowEffect(() => {
    imagenRef.current.loadFotoPerfil();
  }, [sala.paciente.usuario.foto_perfil]);
  return (
    <tr>
      <td width="10%">
        <ImagenAvatar
          mx={0}
          image={sala.paciente.usuario.foto_perfil}
          ref={imagenRef}
          onImageLoaded={() => {
            setFirstRender(true);
          }}
        />
      </td>
      <td width="14%">
        <Text>{sala.paciente.usuario.nombre}</Text>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Text>{FormatUTCDateTime(sala.fecha_inicio)}</Text>
        </CenterHorizontal>
      </td>
      <td width="14%">
        <CenterHorizontal>
          <Group>
            {mostrarCodigo ? (
              <Text>{sala.codigo_acceso}</Text>
            ) : (
              <Text>********</Text>
            )}
            {mostrarCodigo ? (
              <ActionIcon
                onClick={() => {
                  handlers.toggle();
                }}
              >
                <HiOutlineEyeSlash />
              </ActionIcon>
            ) : (
              <ActionIcon
                onClick={() => {
                  handlers.toggle();
                }}
              >
                <HiOutlineEye />
              </ActionIcon>
            )}
          </Group>
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
            <Menu.Item
              color="green"
              icon={<MdVideoChat />}
              onClick={() => {
                navigate(`/app/videollamada/${sala.codigo_acceso}`);
              }}
            >
              Entrar
            </Menu.Item>
          </MenuElipse>
        </Flex>
      </td>
    </tr>
  );
}
