import {
  Box,
  Button,
  Flex,
  Grid,
  Loader,
  Container,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import MensajeBienvenida from "../../Components/Chatbot/MensajeBienvenida";
import MensajeOpcionesCrud from "../../Components/Chatbot/MensajeOpcionesCrud";
import { MdPersonSearch } from "react-icons/md";
import NodoPregunta from "../../utils/Chatbot/NodoPregunta";
import { PreguntaBienvenida } from "../../utils/Chatbot/Preguntas/PreguntaBienvenida";
import { useSelector } from "react-redux";
import UsuarioMensaje from "../../Components/Chatbot/UsuarioMensaje";
import { selectPacienteId } from "../../utils/usuarioHooks";

//Hook que permite hacer una lista de mensajes
function useMensajes() {
  //Primero definimos el estado de los mensajes
  const [mensajes, setMensajes] = useState([
    { key: 0, element: <MensajeBienvenida /> },
  ]);

  const [uniqueKey, setUniqueKey] = useState(2);

  //Funcion que permite recibir un mensaje y añadirlo a la lista de mensajes
  const addMensaje = (mensaje) => {
    setMensajes((mensajes) => [
      ...mensajes,
      {
        key: uniqueKey,
        element: mensaje,
      },
    ]);
    setUniqueKey((key) => key + 1);
  };
  //Funcion que permite eliminar un mensaje
  const popMensaje = (mensaje) => {
    setMensajes((mensajes) => {
      let mensajesPop = [...mensajes];
      mensajesPop.pop();
      return mensajesPop;
    });
    setUniqueKey((key) => key + 1);
  };
  //Retorna los mensajes y los métodos para manipular los mensajes
  return [mensajes, addMensaje, popMensaje];
}
// let skip = true;
export default function ChatBot() {
  //Usamos el hook de mantine para obtener estilos
  const theme = useMantineTheme();
  const [skip, setSkip] = useState(true);
  //Permite desactivar el boton de enviar mensajes mientras el chatbot obtiene la info solicitada
  const [pensando, setPensando] = useState(false);
  //Usamos el hook de mensajes
  const [mensajes, addMensaje, popMensaje] = useMensajes();
  //Creamos una referncia para el text input donde el usuario escribe
  const refInput = useRef(null);
  //Una referencia para el area donde se muestran los mensajes
  const refScrollArea = useRef(null);
  //Una estado que permite cambiar entre las preguntas. La pregunta inicial es la re PreguntaBienvenida
  const [preguntaActual, setPreguntaActual] = useState(PreguntaBienvenida);
  const [datos, setDatos] = useState({});
  //Mediante el react redux obtenemos el id del usuario
  const usuarioId = useSelector(selectPacienteId);

  //Asignamos las propiedades estáticas de la clase NodoPregunta
  NodoPregunta.addMensaje = addMensaje;
  NodoPregunta.setPregunta = setPreguntaActual;
  NodoPregunta.NodoInicial = PreguntaBienvenida;
  NodoPregunta.id_paciente = usuarioId;

  useEffect(() => {
    //Cada vez que cambia la pregunta actual se ejecuta esto
    if (!skip) {
      //Se ejecuta la función de onInit
      let res = preguntaActual.onInit();
      //Si onInit devuelve falso, no se agrega el mensaje
      if (res) addMensaje(preguntaActual.pregunta);
    } else {
      //Si es la primera vez que se carga el componente, entonces guardamos en el NodoPregunta los datos del usuario
      NodoPregunta.setDatos({
        cita: {
          id_paciente: usuarioId,
        },
      });
    }
    setSkip(false);
    // return ()=>{skip=false}
  }, [preguntaActual.pregunta, skip]);
  useEffect(() => {
    //Cada vez que se agrega un mensaje, se hace scroll hasta abajo del area donde se ven los mensajes
    refScrollArea.current.scrollTo({
      top: refScrollArea.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajes]);
  // useEffect(() => {
  //   console.log(datos);
  // }, [datos]);

  //Funcion que permite mandar mensaje una vez el usuario presiona enter
  function handleEnter(e) {
    if (
      (e.key === "Enter" || e.keyCode === 13) &&
      refInput.current.value !== ""
    ) {
      mandarMensaje();
    }
  }

  //Funcion que permite agregar el mensaje y ejecutar el onSubmit de la pregunta actual y reseteando el input del usuario
  function mandarMensaje() {
    addMensaje(
      <UsuarioMensaje>
        <Text children={refInput.current.value}></Text>
      </UsuarioMensaje>
    );
    preguntaActual.onSubmit(refInput.current.value);
    refInput.current.value = "";
  }
  return (
    <Flex id="XD" direction="column" pl="12px" h="95vh">
      {/* Este componente permite mostrar los mensajes */}
      <ScrollArea
        id="MDsd"
        offsetScrollbars
        h="95vh"
        p={0}
        viewportRef={refScrollArea}
        styles={{
          // root: { height: "100vh", padding: 0 },
          viewport: { height: "100%", paddingBottom: 0 },
        }}
      >
        {mensajes.map((m) => m.element)}
      </ScrollArea>
      {/* Este componente permite que el usuario escriba los datos */}
      <Flex bg="transparent" sx={{ flex: "0" }}>
        <TextInput
          ref={refInput}
          placeholder="Escribe tu respuesta..."
          w="100%"
          radius={0}
          onChange={({ target }) => {}}
          onKeyUp={handleEnter}
        />
        <Button
          radius={0}
          color="green-nature"
          variant="subtle"
          styles={{
            root: {
              border: `1px solid ${theme.colors.gray[4]}`,
              borderLeft: 0,
            },
          }}
          onClick={() => {
            mandarMensaje();
          }}
        >
          {/* Si el chatbot esta "pensando" desactivamos el boton de mandar */}
          {pensando ? (
            <Loader color="green-nature" size="xs" />
          ) : (
            <MdPersonSearch />
          )}
        </Button>
      </Flex>
      {/* <div>1</div>
      <div>2</div> */}
    </Flex>
  );
}

