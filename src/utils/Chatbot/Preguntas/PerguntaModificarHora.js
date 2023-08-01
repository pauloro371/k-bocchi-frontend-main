import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import { PreguntaAgendar } from "./PreguntaAgendar";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import axios from "axios";
import { PreguntaBienvenida } from "./PreguntaBienvenida";
import {
  MensajeElegirParametro,
  MensajeModificarBienvenida,
  MensajeModificarHora,
  MensajeMostrarCitas,
} from "../../../Components/Chatbot/MensajesModificarCita";
import { PreguntaModificarFecha } from "./PreguntaModificarFecha";
import { PreguntaConfirmacionAgendar } from "./PreguntaConfirmacionAgendar";
// PreguntaModificarHora->PreguntaConfirmacionAgendar
export const PreguntaModificarHora = new NodoPregunta(
  null,
  null,
  (e) => {
    console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{e.message}</Text>
        </BotMensaje>
        <MensajeModificarHora />
      </>
    );
    NodoPregunta.addMensaje(error);
    return;
  },
  (horario) => {
    console.log("bien");
    console.log(horario);
    //Se guarda el horario nuevo
    NodoPregunta.setDatos({
      cita: { ...NodoPregunta.datos.cita, fecha: horario.fecha },
    });
    //Se manda a la pantalla de guardar
    NodoPregunta.setPregunta(PreguntaConfirmacionAgendar);
  },
  (
    <>
      <MensajeModificarHora />
    </>
  ),
  async (value) => {
    //Se revisa si el valor ingresado por el usuario es valido
    let seleccionado = NodoPregunta.opciones[value - 1];
    if (!seleccionado) throw new Error("Opcion no identificada");
    //Se retorna el valor seleccionado
    return seleccionado;
  }
);
export function getFecha(fecha) {
  // Obtener la fecha actual

  // Obtener el año, mes y día
  let año = fecha.getFullYear();
  let mes = String(fecha.getMonth() + 1).padStart(2, "0"); // El mes es base 0, por lo que se le suma 1
  let día = String(fecha.getDate()).padStart(2, "0");

  // Formatear la fecha en el formato YYYY-mm-dd
  let fechaFormateada = `${año}-${mes}-${día}`;

  console.log(fechaFormateada);
  return fechaFormateada;
}
