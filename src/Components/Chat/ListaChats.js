import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import ListaItem from "./ListaItem";
import { useEffect, useRef, useState } from "react";
import { useDebouncedState } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { modals } from "@mantine/modals";
import SeleccionarUsuario from "./SeleccionarUsuario";
import Vacio from "../Vacio";

const useStyles = createStyles((theme) => ({
  container: {
    // borderRight: `1px solid ${theme.colors.gray[3]}`,
    height: "100%",
  },
  buscador: {
    borderBottom: `1px solid ${theme.colors.gray[3]}`,
    padding: 0,
    padding: `${theme.spacing.sm}`,
  },
}));

export default function ListaChats({ chats, onClick, chatItem, setChats }) {
  const [chatsResultados, setChatResultados] = useState(chats);
  const [value, setValue] = useDebouncedState("", 350);
  const usuario = useSelector(selectUsuario);
  const { classes, cx } = useStyles();
  useEffect(() => {
    if (chatsResultados) {
      setChatResultados((chatsResultados) =>
        chats.filter(({ nombre }) => {
          let r = new RegExp("^" + value.toLowerCase().trim(), "g");
          console.log({ r });
          return r.test(nombre.toLowerCase().trim());
        })
      );
    }
  }, [value]);
  useEffect(() => {
    setChatResultados(chats);
  }, [chats]);
  function addChat(seleccion) {
    setChats((cs) => {
      const c = cs.find(({ id }) => id === seleccion.id);
      if (c) {
        onClick(seleccion);
        return cs;
      } else {
        return [{ ...seleccion }, ...cs];
      }
    });
  }
  function mostrarModalCrearChat() {
    modals.open({
      title: <Title order={3}>Crear chat</Title>,
      children: <CrearChat addChat={addChat} />,
    });
  }
  return (
    <Stack pos="relative" className={classes.container} w="100%">
      {/* <Title order={3}>Chats</Title> */}
      <Flex
        direction="column"
        className={classes.buscador}
        justify="center"
        gap="xs"
      >
        <TextInput
          placeholder="Buscar..."
          defaultValue={value}
          onChange={({ currentTarget: { value } }) => {
            setValue(value);
          }}
        />
        <Button variant="siguiente" m="auto" onClick={mostrarModalCrearChat}>
          Crear chat
        </Button>
      </Flex>
      <ScrollArea
        w="100%"
        style={{ flex: "1", boxSizing: "border-box" }}
        styles={{
          viewport: {
            width: "100%",
            // backgroundColor:"black"
          },
          root: {
            width: "100%",
            // backgroundColor:"yellow"
          },
        }}
      >
        <Lista chats={chatsResultados} onClick={onClick} selected={chatItem} />
      </ScrollArea>
    </Stack>
  );
}

function Lista({ chats, onClick, selected }) {
  if (!chats) return <LoadingOverlay visible />;
  if (chats.length === 0) return <SinChats/>;
  let chatItems = chats.map((chatItem) => (
    <ListaItem
      key={chatItem.id}
      chatItem={chatItem}
      onClick={onClick}
      selected={selected}
    />
  ));
  return chatItems;
}

function CrearChat({ addChat }) {
  const [seleccion, setSeleccion] = useState();
  function handleClick() {
    if (seleccion) addChat(seleccion);
    modals.closeAll();
  }
  useEffect(() => {
    console.log({ seleccion });
  }, [seleccion]);
  return (
    <>
      <Stack mah="70vh">
        <Text>Selecciona el usuario con el que deseas crear un chat</Text>
        <SeleccionarUsuario setSeleccion={setSeleccion} />
        <Flex justify="end">
          <Button
            variant="siguiente"
            disabled={seleccion === undefined}
            onClick={handleClick}
          >
            Crear
          </Button>
        </Flex>
      </Stack>
    </>
  );
}

function SinChats() {
  return <Vacio children={<Text color="dimmed">Vacio...</Text>}/>
}