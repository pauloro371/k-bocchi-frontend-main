import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeAvisoVariosTerapeutas,
  MensajeSeleccionarTerapeuta,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import { PreguntaSeleccionarModalidad } from "./PreguntaSeleccionarModalidad";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
//PreguntaSeleccionarTerapeuta -> PreguntaSeleccionarModalidad
export const PreguntaSeleccionarTerapeuta = new NodoPregunta(
  null,
  null,
  (e) => {
    console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{e.message}</Text>
        </BotMensaje>

        <MensajeSeleccionarTerapeuta />
      </>
    );
    NodoPregunta.addMensaje(error);
    return;
  },
  (seleccionado) => {
    //Se guarda el terapeuta seleccionado en los datos;
    console.log("bien");
    NodoPregunta.setDatos({
      terapeuta: seleccionado,
      cita: { ...NodoPregunta.datos.cita, id_terapeuta: seleccionado.id },
    });
    //Se marca como siguiente pregunta PreguntaSeleccionarModalidad
    NodoPregunta.setPregunta(PreguntaSeleccionarModalidad);
  },
  //El contenido de la pregunta
  (
    <>
      <MensajeAvisoVariosTerapeutas />
      <MensajeSeleccionarTerapeuta />
    </>
  ),
  async (value) => {
    //Se obtiene el valor escrito por el usuario
    let seleccionado = NodoPregunta.opciones[value - 1];
    //Si no se encuentra ese valor, se hace saber
    if (!seleccionado) throw new Error("Opcion no identificada");
    //Si el terapeuta no tiene dias_habiles (no ha definido su horario)
    if (seleccionado.dias_habiles === 0)
      throw new Error(
        "Lo lamento, este terapeuta no ha definido su horario de trabajo 😐"
      );
      //Se retorna el valor seleccionado
    return seleccionado;
  }
);
