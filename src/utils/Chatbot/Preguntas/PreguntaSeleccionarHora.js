import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeListaHorarios,
  MensajeSeleccionarHorario,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import { PreguntaConfirmacionAgendar } from "./PreguntaConfirmacionAgendar";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";

//PreguntaSeleccionarModalidad ->PreguntaSeleccionarDomicilio
export const PreguntaSeleccionarHora = new NodoPregunta(
  null,
  null,
  (error) => {
    console.log(error);
    NodoPregunta.addMensaje(
      <>
        <BotMensaje>
          <Text>{error.message}</Text>
        </BotMensaje>
        
      </>
    );
    NodoPregunta.addMensaje(
      <>
        <MensajeSeleccionarHorario />
        <MensajeListaHorarios />
      </>
    );
  },
  (data) => {
    //Si la opcion seleccionada si estaba dentro de los parametros, se guarda la fecha (que ya contiene la hora) seleccionada
    NodoPregunta.setDatos({
      cita: {
        ...NodoPregunta.datos.cita,
        fecha: data.fecha,
      },
    });
    //Luego se marca la pregunta de confirmación agendar como la siguiente
    NodoPregunta.setPregunta(PreguntaConfirmacionAgendar);
  },
  (
    //El contenido de la pregunta
    <>
      <MensajeSeleccionarHorario />
      <MensajeListaHorarios />
    </>
  ),
  async (value) => {
    //Se obtiene el valor ingresado por el usuario
    let seleccionado = NodoPregunta.opciones[value - 1];
    //Si esta fuera de rango se le hace saber
    if (!seleccionado) throw new Error("Opcion no identificada");
    //Si todo bien regresa el valor seleccionado
    return seleccionado;
  }
  //   () => {}
);
