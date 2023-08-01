import { Button, Flex } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import axios from "axios";
import { NINGUNO, TODOS, VARIOS } from "../../utils/ModoCompartir";

export default function ControlesModificarAcceso({
  grafo,
  setModoCompartir,
  modoCompartir,
}) {
  return (
    <Flex w="100%" justify="space-between" gap="sm" wrap="wrap">
      <Flex justify="start" gap="sm">
        <SeleccionarTodos setModoCompartir={setModoCompartir} />
        <DeseleccionarTodos setModoCompartir={setModoCompartir} />
      </Flex>
      <Flex justify="end" gap="sm">
        <Cancelar />
        <GuardarAcceso grafo={grafo} />
      </Flex>
    </Flex>
  );
}

export function GuardarAcceso({ grafo }) {
  const [guardando, setGuardando] = useState();
  const navigate = useNavigate();

  async function handleClick() {
    setGuardando(true);
    try {
      await axios.patch(`/notas/compartir`, grafo);
      showPositiveFeedbackNotification(
        "Se ha modificado el acceso a tus notas correctamente 😉"
      );
      navigate("/app/paciente/bitacora");
    } catch (error) {
      console.log(error);
      if (error) {
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      }
    }
    setGuardando(false);
  }
  return (
    <Button
      variant="guardar"
      loading={guardando}
      disabled={!grafo}
      onClick={handleClick}
    >
      Guardar cambios
    </Button>
  );
}

export function Cancelar() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/app/paciente/bitacora");
  }
  return (
    <Button variant="cerrar" onClick={handleClick}>
      Cancelar
    </Button>
  );
}

export function SeleccionarTodos({ setModoCompartir }) {
  function handleClick() {
    setModoCompartir(TODOS);
  }
  return <Button onClick={handleClick}>Selec todos</Button>;
}
export function DeseleccionarTodos({ setModoCompartir }) {
  function handleClick() {
    setModoCompartir(NINGUNO);
  }
  return <Button onClick={handleClick}>Deselec todos</Button>;
}
