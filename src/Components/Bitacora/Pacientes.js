import { Container, Flex, Stack } from "@mantine/core";
import BusquedaPacientes from "./BusquedaPacientes";
import TablaPacientes from "./TablaPacientes";
import { useId, useListState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import axios from "axios";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";

export default function Pacientes() {
  const useid = useId();
  const [pacientes, setPacientes] = useState();
  const usuario = useSelector(selectUsuario);

  async function fetchPacientes(nombre = "") {
    setPacientes(undefined);
    let {
      terapeuta: { id },
    } = usuario;
    try {
      let pacientes = await axios.get(
        `/usuarios/fisioterapeutas/bitacora/pacientes/${id}?nombre=${nombre}`
      );
      setPacientes(pacientes.data);
    } catch (err) {
      showNegativeFeedbackNotification(
        "Lo lamento, no hemos podido obtener tus pacientes 😫"
      );
    }
  }
  useEffect(() => {
    fetchPacientes();
  }, []);
  return (
    <>
      <BusquedaPacientes setPacientes={fetchPacientes} />
      <TablaPacientes pacientes={pacientes} />
    </>
  );
}
