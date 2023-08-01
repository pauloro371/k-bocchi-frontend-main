import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USUARIO_AUTORIZADO, USUARIO_LOGOUT } from "../Actions/actionsUsuario";
import { FISIOTERAPEUTA, PACIENTE } from "../roles";
import {
  AppShell,
  Burger,
  Footer,
  Header,
  MediaQuery,
  NavLink,
  Navbar,
  Title,
  Text,
  useMantineTheme,
  Flex,
  Stack,
  Box,
  Avatar,
  Menu,
  LoadingOverlay,
  Container,
  SimpleGrid,
  Grid,
  ScrollArea,
  Modal,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { socket } from "../utils/socket/socket";
import { useTimeout } from "@mantine/hooks";
import useSesionExpiracion, { milisegundos } from "../utils/sesionHook";
import BarraNavegacion from "./Navbar";
import ButtonLogout from "./ButtonLogout";
import useMantenerSesion from "../utils/mantenerSesionHook";
import { SEND_DATA } from "../utils/socket/socketEvents";
import { checkToken } from "../utils/FirebaseMessaging/checkToken";
import Notificacion from "./Notificacion";
import { deleteToken } from "firebase/messaging";
import { messaging } from "../firebase";

const selectUsuario = (state) => state.usuario;

function NavLinkBar({ to, label }) {
  return (
    <Navbar.Section className="link">
      <NavLink label={<Link to={to}>{label}</Link>} />
    </Navbar.Section>
  );
}

export default function Layout() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const usuario = useSelector(selectUsuario);
  const navigate = useNavigate();
  const { sesionExpiracion, isExpirado, setMinutos, init, isNull } =
    useSesionExpiracion();
  const { isSesionAbierta, mantenerSesion } = useMantenerSesion();
  const [modalNotificaciones, setModalNotificaciones] = useState();

  useEffect(() => {
    // return (()=>{
    //   deleteToken(messaging)
    // })
  }, []);
  const { start, clear } = useTimeout(() => {
    console.log("Estas conectado :O");
    setMinutos();
  }, milisegundos);
  useEffect(() => {
    socket.connect();
    function onConnect() {
      socket.emit(SEND_DATA, { id: usuario.id, nombre: usuario.nombre });
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  useEffect(() => {
    if (isNull()) {
      dispatch({ type: USUARIO_LOGOUT });
    } else {
      start();
    }
  }, [sesionExpiracion]);

  useEffect(() => {
    if (isNull() && !isSesionAbierta()) {
      navigate("/");
    }
  }, [usuario, mantenerSesion]);

  function FooterApp() {
    return (
      <Footer height="auto" p="xs">
        <Flex justify="flex-end" c="dimmed">
          <Box fz="xs">
            <Text>By K-Bocchi Team</Text>
            <Text>© 2023 K-Bocchi</Text>
          </Box>
        </Flex>
      </Footer>
    );
  }

  function HeaderApp() {
    return (
      <Header p="md">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Flex justify="space-between" align="center" w="100%">
            <Text>K-Bocchi</Text>
            <Flex>
              <Link to="/app/cita/buscar">
                <NavLink label="Cita" />
              </Link>
              <Link to="/app/chatbot">
                <NavLink label="Chatbot" />
              </Link>
              <Link to="/app/chat">
                <NavLink label="Chat" />
              </Link>
              <Menu>
                <Menu.Target>
                  <Avatar radius="xl" />
                </Menu.Target>
                <Menu.Dropdown>
                  <Link to="/app/perfil">
                    <Menu.Item component="li">{usuario.nombre}</Menu.Item>
                  </Link>
                  <Link>
                    <ButtonLogout
                      Child={<Menu.Item component="li">Salir</Menu.Item>}
                    />
                  </Link>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </Flex>
        </div>
      </Header>
    );
  }
  return (
    <>
      <LoadingOverlay visible={!isConnected} overlayBlur={2} />
      {/* <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        header={<HeaderApp />}
        mah="80vh"
        mih="80vh"
        // navbar={<BarraNavegacion />}
        // footer={<FooterApp />}
      ></AppShell> */}
      <Notificacion />
      <Modal
        opened={modalNotificaciones != undefined && !modalNotificaciones}
        onClose={() => setModalNotificaciones(true)}
        title="¡Aviso!"
      >
        <Modal.Body>
          Para una mejor experiencia de usuario, habilite las notificaciones
        </Modal.Body>
      </Modal>
      <ScrollArea
        sx={{
          flex: "1",
        }}
        w="100vw"
        h="100vh"
        m={0}
        p={0}
        styles={{
          viewport: {
            height: "100%",
            width: "100%",
            margin: 0,
            paddingBottom: 0,
          },
          root: { height: "100vh", width: "100%", margin: 0 },
        }}
        py={0}
      >
        <Outlet />
        <BarraNavegacion />
      </ScrollArea>

      {/* <Flex h="100vh" direction="column">
        <Container
          sx={{
            flex: "1",
          }}
        >
          1
        </Container>
        <Container>2</Container>
      </Flex> */}
    </>
  );
}
