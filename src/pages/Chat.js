import {
  TextInput,
  Text,
  Table,
  Box,
  ScrollArea,
  Stack,
  Center,
  Flex,
  Grid,
  createStyles,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useListState } from "@mantine/hooks";
import { socket } from "../utils/socket/socket";
import { useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import ListaChats from "../Components/Chat/ListaChats";
import { showNegativeFeedbackNotification } from "../utils/notificationTemplate";
import { selectUsuario } from "../utils/usuarioHooks";
import axios from "axios";
import Mensajes from "../Components/Chat/Mensajes";
import ChatArea from "../Components/Chat/ChatArea";
import { MENSAJE_RECIBIDO } from "../utils/socket/socketEvents";
// import { socket } from "../../utils/socket/socket";
// import { MENSAJE_RECIBIDO } from "../../utils/socket/socketEvents";

const useStyles = createStyles((theme) => ({
  buscador: {
    borderRight: `1px solid ${theme.colors.gray[3]}`,
    padding:0

  },
}));
export default function Chat() {
  // const [usuariosConectados, handlers] = useListState([]);
  // const filter = (id) => handlers.filter((item) => item.id !== id);
  const [chats, setChats] = useState();
  const { id: id_usuario } = useSelector(selectUsuario);
  const [chatItem, setChatItem] = useState();
  const {classes,cx} = useStyles();
  async function fetchChats() {
    try {
      let { data: chats } = await axios.get(`/mensajes/chats/${id_usuario}`);
      setChats(chats);
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
    // socket.emit("chat:entrar");
    function onUsuarioConectado(usuario) {
      console.log({ usuario });
      // handlers.append(usuario);
    }
    function onUsuarioDesconectado({ id }) {
      // let usuarios = filter(id);
      // handlers.setState(usuarios);
      console.log({ id });
    }
    function onUsuarioLista(lista) {
      // handlers.setState(lista);
      console.log({ lista });
    }
    socket.on("usuario:conectado", onUsuarioConectado);
    socket.on("usuario:desconectado", onUsuarioDesconectado);
    socket.on("usuario:lista", onUsuarioLista);
    fetchChats();
    return () => {
      socket.off("usuario:lista", onUsuarioLista);
      socket.off("usuario:conectado", onUsuarioConectado);
      socket.off("usuario:desconectado", onUsuarioDesconectado);
    };
  }, []);
  useEffect(() => {
    function onMensajeRecibido(msg) {
      console.log({msg});
      setChats((cs) => {
        let c = cs.find(
          (value) => value.id === msg.id_from || value.id === msg.id_to
        );
        if (c) {
          let c2 = cs.filter(({ id }) => id != c.id);
          delete msg.id;
          if (msg.id_from === id_usuario) {
            delete msg.foto_perfil;
            delete msg.nombre;
          }
          return [{ ...c, ...msg }, ...c2];
        } else {
          //crear chat
          return [
            {
              nombre: msg.nombre,
              id: msg.id_from,
              foto_perfil: msg.foto_perfil,
              fecha: msg.fecha,
              contenido: msg.contenido,
            },
            ...cs,
          ];
        }
      });
    }
    socket.on(MENSAJE_RECIBIDO, onMensajeRecibido);
    return () => {
      socket.off(MENSAJE_RECIBIDO, onMensajeRecibido);
    };
  }, []);
  useEffect(() => {
    console.log({ chatItem });
  }, [chatItem]);
  return (
    <>
      <Grid h="100vh" w="100%" m={0}>
        <Grid.Col span={4} h="100%" className={classes.buscador} pos={"relative"}>
          {/* <ListaUsuarios usuarios={usuariosConectados} /> */}
          <ListaChats
            chats={chats}
            chatItem={chatItem}
            onClick={(item) => {
              // alert(JSON.stringify(item))

              setChatItem(item);
            }}
            setChats={setChats}
          />
        </Grid.Col>
        <Grid.Col span={8} p={0} h="100%" pos={"relative"}>
          <ChatArea chatItem={chatItem} />
        </Grid.Col>
      </Grid>
    </>
  );
}
