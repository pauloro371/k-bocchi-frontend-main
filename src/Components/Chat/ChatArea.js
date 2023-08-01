import {
  Flex,
  LoadingOverlay,
  Overlay,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import axios from "axios";
import Mensajes from "./Mensajes";
import { socket } from "../../utils/socket/socket";
import {
  MENSAJE_ENVIAR,
  MENSAJE_RECIBIDO,
} from "../../utils/socket/socketEvents";
import ImagenAvatar from "../ImagenAvatar";
import Vacio from "../Vacio";

const useStyles = createStyles((theme) => ({
  header: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    background: `${theme.colors["green-nature"][5]}`,
    color: `${theme.white}`,
    fontWeight: `${theme.fontSizes.md}`,
  },
}));

export default function ChatArea({ chatItem }) {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const usuario = useSelector(selectUsuario);
  const [mensaje, setMensaje] = useState("");
  const { classes, cx } = useStyles();
  const refScrollArea = useRef();
  async function fecthMensajes() {
    const { id: id_from } = usuario;
    const { id: id_to } = chatItem;
    setLoading(true);
    try {
      let { data: mensajesIniciales } = await axios.get(
        `/mensajes/chat/${id_to}/${id_from}`
      );
      console.log({ mensajesIniciales });
      setMensajes(mensajesIniciales);
    } catch (error) {
      console.log(error);
      if (error) {
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      }
    }
    setLoading(false);
  }
  function pushMensaje(msg) {
    if (!chatItem) return;
    console.log({ sh: chatItem });
    if (msg.id_from === chatItem.id || msg.id_to === chatItem.id)
      setMensajes((m) => [...m, { ...msg }]);
    console.log("Mensaje añadido", msg);
  }

  function getChatItem() {
    return chatItem;
  }
  useEffect(() => {
    console.log({ chatItem });
    if (chatItem) {
      fecthMensajes();
      socket.on(MENSAJE_RECIBIDO, onMensajeRecibido);
      return () => {
        socket.off(MENSAJE_RECIBIDO, onMensajeRecibido);
      };
    }
  }, [chatItem]);
  function onMensajeRecibido(msg) {
    let c = getChatItem();
    console.log({ c });
    pushMensaje(msg);
  }
  // useEffect(() => {
  //   socket.on(MENSAJE_RECIBIDO, onMensajeRecibido);
  //   return () => {
  //     socket.off(MENSAJE_RECIBIDO, onMensajeRecibido);
  //   };
  // }, []);
  useEffect(() => {
    if (refScrollArea.current)
      refScrollArea.current.scrollTo({
        top: refScrollArea.current.scrollHeight,
        behavior: "smooth",
      });
  }, [mensajes]);

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      mandarMensaje();
      return;
    }
  }
  function handleChange(e) {
    setMensaje(e.target.value);
  }
  function mandarMensaje() {
    console.log({ mensaje });
    socket.emit(MENSAJE_ENVIAR, {
      to: chatItem.id,
      contenido: mensaje,
    });
    // pushMensaje({
    //   contenido: mensaje,
    //   fecha: new Date(),
    //   id_from: usuario.id,
    // });
    setMensaje("");
  }
  if (!chatItem) {
    return <NoChatActivo />;
  }
  return loading ? (
    <LoadingOverlay visible />
  ) : (
    <>
      <Stack
        style={{ flex: "1", boxSizing: "border-box" }}
        pos={"relative"}
        h="100%"
        w="100%"
        spacing={0}
      >
        <Flex align="center" gap="md" className={classes.header}>
          <ImagenAvatar mx={0} image={chatItem.foto_perfil} />
          <Text fw="bold">{chatItem.nombre}</Text>
        </Flex>
        <div
          // offsetScrollbars={false}
          ref={refScrollArea}
          style={{
            flex: "1",
            boxSizing: "border-box",
            overflowY: "scroll",
            position: "relative",
          }}
          // maw="100%"
          // m="lg"
        >
          <Mensajes mensajes={mensajes} />
        </div>
        <form>
          <Textarea
            value={mensaje}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />
        </form>
      </Stack>
    </>
  );
}

function NoChatActivo() {
  return <Vacio children={<Text color="dimmed">Selecciona un chat</Text>} />;
}
