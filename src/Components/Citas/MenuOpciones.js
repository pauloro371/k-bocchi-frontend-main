import { Group, Menu, UnstyledButton } from "@mantine/core";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { mostrarCitaEditar, mostrarCitaEliminar } from "./MostrarCitasModals";
import { forwardRef } from "react";
import { Icono } from "../Opciones";

export function MenuOpciones({ cita, setCitas }) {
  const {
    terapeuta: { id },
  } = useSelector(selectUsuario);
  const handleClick = (event) => {
    event.stopPropagation();
  };
  const handleEditar = (event) => {
    event.stopPropagation();
    mostrarCitaEditar(cita, setCitas);
  };
  const handleEliminar = (event) => {
    event.stopPropagation();
    mostrarCitaEliminar(cita, setCitas);
  };
  return (
    <Group position="center" onClick={handleClick}>
      <Menu withArrow>
        <Menu.Target>
          <Icono />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item color="blue" icon={<MdEdit />} onClick={handleEditar}>
            Editar
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<MdOutlineDelete />}
            onClick={handleEliminar}
          >
            Eliminar
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
