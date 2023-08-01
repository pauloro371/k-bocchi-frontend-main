import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import {
  ActionIcon,
  Box,
  Container,
  Flex,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import {
  FaVolumeMute,
  FaVolumeUp,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { useDisclosure, useListState } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import { socket } from "../utils/socket/socket";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showNegativeFeedbackNotification } from "../utils/notificationTemplate";
import { modals } from "@mantine/modals";
import { useSm } from "../utils/mediaQueryHooks";
import { FISIOTERAPEUTA, PACIENTE } from "../roles";
const useStyles = createStyles((theme) => ({
  videoInsert: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    margin: "auto",
    backgroundColor: theme.black,
    padding: "1em",
  },
}));

export default function Videochat() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [userStream, setUserStream] = useState();
  const currentStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const doneRef = useRef(null);
  const peerInstance = useRef(null);
  const { classes, cx } = useStyles();
  const [audio, { toggle: toggleAudio }] = useDisclosure(true);
  const [video, { toggle: toggleVideo }] = useDisclosure(true);
  const [showMessages, { open: openMessages, close: closeMessages }] =
    useDisclosure(false);
  const [messages, handlers] = useListState();
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const { nombre } = useSelector(selectUsuario);
  const { rol } = useSelector(selectUsuario);
  const { codigo_acceso } = useParams();
  const { id: id_usuario } = useSelector(selectUsuario);
  const sm = useSm();
  const navigate = useNavigate();
  useEffect(() => {
    if (!peerInstance.current) {
      const peer = new Peer();
      peerInstance.current = peer;
    }
  }, []);
  function onData(conn) {
    conn.on("data", (data) => {
      console.log({ data });
      handlers.append(data);
    });
  }
  function onCall(call) {
    setRemotePeerIdValue(call.peer);

    call.answer(currentStreamRef.current);
    call.on("stream", function (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      // remoteVideoRef.current.play();
    });
  }
  useEffect(() => {
    if (peerInstance.current) {
      console.log("Current");
      peerInstance.current.on("open", (id) => {
        setPeerId(id);
      });

      peerInstance.current.on("call", onCall);
      peerInstance.current.on("connection", onData);
    }
    return () => {
      if (peerInstance.current) {
        peerInstance.current.off("call", onCall);
        peerInstance.current.off("connection", onData);
      }
    };
  }, [peerInstance]);
  useEffect(() => {
    console.log({ video });
    if (currentStreamRef.current)
      currentStreamRef.current
        .getVideoTracks()
        .forEach((t) => (t.enabled = video));
  }, [video]);
  useEffect(() => {
    console.log({ audio });
    if (currentStreamRef.current) {
      currentStreamRef.current
        .getAudioTracks()
        .forEach((t) => (t.enabled = audio));
    }
  }, [audio]);
  useEffect(() => {
    // getUserResources();
  }, []);
  async function getUserResources() {
    if (currentStreamRef.current || doneRef.current == true) return;
    doneRef.current = true;
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    try {
      let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      currentStreamRef.current = mediaStream;
      // getUserMedia({ video: true, audio: true });
    } catch (error) {
      console.log(error);
    } finally {
      currentUserVideoRef.current.srcObject = currentStreamRef.current;
      console.log("EN CALL");
      socket.emit("videochat:entrar", {
        peer_id: peerId,
        codigo_acceso,
        rol,
      });
    }
  }
  function onUsuarioConectado({ peer_id, rol }) {
    console.log("Nueva llamada");
    if (peer_id) {
      call(peer_id);
      setRemotePeerIdValue(peer_id);
    }
  }
  function onUsuarioDesconectado({ id }) {
    // let usuarios = filter(id);
    // handlers.setState(usuarios);
    console.log({ id });
  }
  useEffect(() => {
    // socket.emit("chat:entrar");
    socket.on("videochat:nuevaConexion", onUsuarioConectado);
    socket.on("videochat:salir", onUsuarioDesconectado);
    setMounted(true);
    return () => {
      socket.emit("videochat:salir", { codigo_acceso, rol });
      socket.off("videochat:nuevaConexion", onUsuarioConectado);
      socket.off("videochat:salir", onUsuarioDesconectado);
      // if (localRefStream) {
      currentStreamRef.current?.getTracks().forEach((t) => t.stop());
      // }
    };
  }, [mounted]);
  async function entrarLlamada() {
    let conectar = false;
    if (mounted && peerId && currentStreamRef.current !== undefined) {
      try {
        let response = await axios.get(
          `/salas/acceso/${codigo_acceso}/${id_usuario}`
        );
        conectar = true;
      } catch (error) {
        if (!error) return;
        let {
          response: { status },
        } = error;
        if (status === 403 && rol === PACIENTE) {
          modals.open({
            title: <Title order={3}>¡Atención!</Title>,
            children: <Text>Aún no puedes entrar a la sala</Text>,
          });
          return;
        }
        if (status === 403 && rol === FISIOTERAPEUTA) {
          conectar = true;
          return;
        }
        console.log(error);
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      } finally {
        if (conectar) getUserResources();
      }
    }
  }
  useEffect(() => {
    entrarLlamada();
  }, [mounted, peerId, currentStreamRef.current]);
  const call = (remotePeerId) => {
    console.log("EN CALL");
    // setUserStream(mediaStream);
    const call = peerInstance.current.call(
      remotePeerId,
      currentStreamRef.current
    );
    try {
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        // remoteVideoRef.current.play();
      });
    } catch (err) {
      console.log(err);
    }
  };
  function mandarMensaje() {
    if (message !== "") {
      console.log({ remotePeerIdValue });
      const conn = peerInstance.current.connect(remotePeerIdValue);
      const msgObj = {
        name: nombre,
        message: message,
      };
      conn.on("open", () => {
        conn.send(msgObj);
      });
      handlers.append({ name: "Tú", message });
      setMessage("");
    }
  }
  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      mandarMensaje();
      return;
    }
  }
  function handleChange(e) {
    setMessage(e.target.value);
  }
  return (
    <Flex h="100vh" w="100vw" justify="center" align="center">
      <Container w="100%" h="80%" pos="relative">
        <Container w="100%" h="100%">
          <SimpleGrid
            w="100%"
            breakpoints={[
              { minWidth: "xs", cols: 1 },
              { minWidth: "sm", cols: 2 },
            ]}
          >
            <Box
              pos="relative"
              style={{
                position: "relative",
                overflow: "hidden",
                height: "0",
                paddingBottom: sm ? "80%" : "50%",
                backgroundColor: "black",
              }}
            >
              <video
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
                ref={currentUserVideoRef}
                autoPlay
                muted
              />
            </Box>
            <Box
              pos="relative"
              style={{
                position: "relative",
                overflow: "hidden",
                height: "0",
                paddingBottom: sm ? "80%" : "50%",
                backgroundColor: "black",
              }}
            >
              <video
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
                ref={remoteVideoRef}
                autoPlay
              />
            </Box>
          </SimpleGrid>
          <Flex gap="md" w="100%" justify="center" mt="sm">
            <ToggleIcon
              activeElement={
                <ControlButtonLlamada
                  actionIconProps={{ size: "3em", variant: "filled" }}
                >
                  <FaVolumeUp />
                </ControlButtonLlamada>
              }
              desactiveElement={
                <ControlButtonLlamada
                  actionIconProps={{ size: "3em", variant: "filled" }}
                >
                  <FaVolumeMute />
                </ControlButtonLlamada>
              }
              value={audio}
              onClick={() => {
                toggleAudio();
              }}
            />
            <ToggleIcon
              activeElement={
                <ControlButtonLlamada
                  actionIconProps={{ size: "3em", variant: "filled" }}
                >
                  <FaVideo />
                </ControlButtonLlamada>
              }
              desactiveElement={
                <ControlButtonLlamada
                  actionIconProps={{ size: "3em", variant: "filled" }}
                >
                  <FaVideoSlash />
                </ControlButtonLlamada>
              }
              value={video}
              onClick={() => {
                toggleVideo();
              }}
            />
            <ControlButtonLlamada
              actionIconProps={{
                size: "3em",
                variant: "filled",
                color: "blue-empire.0",
                onClick: openMessages,
              }}
            >
              <TiMessages />
            </ControlButtonLlamada>
            <ControlButtonLlamada
              actionIconProps={{
                size: "3em",
                variant: "filled",
                color: "red",
                onClick: () => {
                  if (rol === PACIENTE) {
                    navigate("/app/paciente/videollamada");
                  } else if (rol === FISIOTERAPEUTA) {
                    navigate("/app/terapeuta/salas");
                  }
                },
              }}
            >
              <FaPhoneSlash />
            </ControlButtonLlamada>
          </Flex>
        </Container>
        <Modal
          opened={showMessages}
          onClose={closeMessages}
          title={<Title order={3}>Mensajes</Title>}
          keepMounted={true}
        >
          <Stack h="70vh">
            <ScrollArea style={{ flex: "1" }}>
              <Stack>
                {messages.map(({ message, name }) => (
                  <Text>
                    {name}:{message}
                  </Text>
                ))}
              </Stack>
            </ScrollArea>
            <Textarea
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
            />
          </Stack>
        </Modal>
      </Container>
    </Flex>
  );
}

function ControlButtonLlamada({ actionIconProps, ...props }) {
  return (
    <ActionIcon radius="xl" {...actionIconProps}>
      {props.children}
    </ActionIcon>
  );
}

function ToggleIcon({ activeElement, desactiveElement, value, onClick }) {
  return (
    <UnstyledButton onClick={onClick}>
      {value ? activeElement : desactiveElement}
    </UnstyledButton>
  );
}
