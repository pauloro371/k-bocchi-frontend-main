import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeBienvenidaAgendar,
  MensajeNombre,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import axios from "axios";
import { PreguntaSeleccionarTerapeuta } from "./PreguntaSeleccionarTerapeuta";
import { PreguntaSeleccionarModalidad } from "./PreguntaSeleccionarModalidad";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import { resetDatos } from "./PreguntaBienvenida";

//PreguntaAgendar -> PreguntaSeleccionarTerapeuta
//PreguntaAgendar -> PreguntaSeleccionarModalidad
export const PreguntaAgendar = new NodoPregunta(
  null,
  null,
  (e) => {
    //Misma forma de mostrar error
    console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{e.message}</Text>
        </BotMensaje>
        <MensajeNombre />
      </>
    );
    NodoPregunta.addMensaje(error);
    return;
  },
  (resultados) => {
    //Se reciben los resultados
    //Si es un solo resultado automáticamente se selecciona el terapeuta y se guarda en los datos
    if (resultados.length === 1) {
      if (resultados[0].dias_habiles === 0)
        throw new Error(
          "Lo lamento, este terapeuta no ha definido su horario de trabajo 😐"
        );
      NodoPregunta.setDatos({
        terapeuta: resultados[0],
        cita: { ...NodoPregunta.datos.cita, id_terapeuta: resultados[0].id },
      });
      //Se determina que la siguiente pregunta es PreguntaSeleccionarModalidad
      NodoPregunta.setPregunta(PreguntaSeleccionarModalidad);
    } else {
      //Si son varios, se guardan todos en las opciones
      NodoPregunta.opciones = resultados;
      console.log(NodoPregunta.opciones);
      //Y se determina la siguiente pregunta PreguntaSeleccionarTerapeuta
      NodoPregunta.setPregunta(PreguntaSeleccionarTerapeuta);
    }
    console.log("bien");
    // NodoPregunta.setPregunta(siguiente);
  },
  (
    //El contenido de la pregunta
    <>
      <MensajeBienvenidaAgendar />
      <MensajeNombre />
    </>
  ),
  async (value) => {
    //Se recibe el valor que escribio el usuario
    let response;
    try {
      //Buscar terapeutas con ese nombre
      response = await axios.get(
        `/usuarios/fisioterapeutas/buscarNombre/${value}`
      );
    } catch (err) {
      if (!err) throw { message: "Algo ha salido mal :c" };
      throw { message: err.response.data };
    }
    //Si no hay respuesta, se tira error
    if (!response) throw new Error("Algo ha salido mal :c");
    //Si no se encontro nada también se tira error
    if (response.data.length === 0)
      throw new Error("No se encontro un terapeuta con ese nombre");
    //Si todo salió bien se retornan los resultados
    return response.data;
  },
  () => {
    return resetDatos();
  }
);
