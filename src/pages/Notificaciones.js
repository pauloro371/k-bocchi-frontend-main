import {
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Overlay,
  PasswordInput,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { BsEmojiNeutral, BsEmojiSmile, BsGraphDownArrow } from "react-icons/bs";
import FilaNotificacion from "../Components/Notificaciones/FilaNotificacion";
import { selectUsuario } from "../utils/usuarioHooks";
import { useSm } from "../utils/mediaQueryHooks";
import { showNegativeFeedbackNotification } from "../utils/notificationTemplate";
import Vacio from "../Components/Vacio";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState();
  const [disableControls, setDisableControls] = useState(false);
  let { id } = useSelector(selectUsuario);
  const sm = useSm();

  async function fetchNotificaciones() {
    try {
      let { data } = await axios.get(`/notificaciones/usuario/${id}`);
      console.log({ data });
      setNotificaciones(data);
      if (data.length === 0) setDisableControls(true);
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

  async function handleEliminarTodas() {
    try {
      setDisableControls(true);
      await axios.delete(`/notificaciones/todas/${id}`);
      setNotificaciones((ns) => []);
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    } finally {
      setDisableControls(false);
    }
  }
  async function handleMarcarTodas() {
    try {
      setDisableControls(true);
      await axios.patch(`/notificaciones/todas/${id}`);
      setNotificaciones((ns) => ns.map((n) => ({ ...n, leida: 1 })));
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    } finally {
      setDisableControls(false);
    }
  }
  useEffect(() => {
    fetchNotificaciones();
  }, []);
  useEffect(() => {
    console.log({ notificaciones });
  }, [notificaciones]);

  if (notificaciones === undefined)
    return <LoadingOverlay visible overlayBlur={2} />;
  return notificaciones.length === 0 ? (
    <Vacio
      children={
        <Stack align="center" fz="xl">
          <Text color="dimmed">No hay notificaciones</Text>
          <Text color="dimmed">¡Estas al día!</Text>
          <BsEmojiSmile color="gray" />
        </Stack>
      }
    />
  ) : (
    <Container fluid h="100vh">
      <Title order={3}>Notificaciones</Title>
      <Flex justify="end" gap="md" style={{ flex: "0" }}>
        <Button variant="guardar" onClick={handleMarcarTodas}>
          Marcar todas como leidas
        </Button>
        <Button variant="danger" onClick={handleEliminarTodas}>
          Eliminar todas
        </Button>
      </Flex>
      <ScrollArea style={{ flex: "1" }}>
        <Table w={sm ? "100%" : "130%"} withBorder pos="relative">
          <LoadingOverlay visible={disableControls} overlayBlur={0.5} />
          <thead></thead>
          <tbody>
            {notificaciones.map((notificacion) => (
              <FilaNotificacion
                notificacion={notificacion}
                key={notificacion.id}
                onEditar={(notificacion) => {
                  setNotificaciones((ns) =>
                    ns.map((n) => (n.id === notificacion.id ? notificacion : n))
                  );
                }}
                onEliminar={(id_notificacion) => {
                  setNotificaciones((ns) =>
                    ns.filter((n) => n.id !== id_notificacion)
                  );
                }}
              />
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
