import { Box, Center, ScrollArea, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export default function Conversacion({ mensajes, mandarMensaje, handlers }) {
  const [mensaje, setMensaje] = useState("");
  const refScrollArea = useRef(null);
  useEffect(
    () =>
      refScrollArea.current.scrollTo({
        top: refScrollArea.current.scrollHeight,
        behavior: "smooth",
      }),
    [mensajes]
  );
  function handleMandar(e) {
    if ((e.key === "Enter" || e.keyCode === 13) && mensaje !== "") {
      handlers.append(mandarMensaje(mensaje));
      setMensaje("");
    }
  }
  return (
    <Box h="45vh" mah="45vh">
      <Stack h="90%">
        <ScrollArea.Autosize h="100%" viewportRef={refScrollArea}>
          {mensajes.map((m) => (
            <Mensaje mensaje={m} />
          ))}
        </ScrollArea.Autosize>
      </Stack>
      <Center>
        <TextInput
          w="90%"
          value={mensaje}
          onChange={({ target }) => {
            setMensaje(target.value);
          }}
          onKeyDown={handleMandar}
        />
      </Center>
    </Box>
  );
}

function Mensaje({ mensaje }) {
  return (
    <>
      <Text mb="md" style={{ wordWrap: "break-word", width: "90%" }}>
        <Text span fw="bold">
          {mensaje.nombre}
        </Text>
        : {mensaje.contenido}{" "}
        <Text span fz="sm" c="dimmed">
          {mensaje.fecha}
        </Text>
      </Text>
    </>
  );
}
