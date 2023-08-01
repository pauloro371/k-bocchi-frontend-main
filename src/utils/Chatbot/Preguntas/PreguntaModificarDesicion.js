import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import { PreguntaAgendar } from "./PreguntaAgendar";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import axios from "axios";
import { PreguntaBienvenida } from "./PreguntaBienvenida";
import {
  MensajeDecidir,
  MensajeDecidirCambio,
  MensajeElegirParametro,
  MensajeModificarBienvenida,
  MensajeMostrarCitas,
} from "../../../Components/Chatbot/MensajesModificarCita";
import { PreguntaModificarFecha } from "./PreguntaModificarFecha";
import { PreguntaModificarHora } from "./PerguntaModificarHora";
import { PreguntaSeleccionarFecha } from "./PreguntaSeleccionarFecha";
import { MensajeFechasOpciones } from "../../../Components/Chatbot/MensajesAgendarCita";

export const PreguntaModificarDesicion = new NodoPregunta(
  null,
  null,
  ({ message }) => {
    // console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{message}</Text>
        </BotMensaje>
        <MensajeDecidir />
      </>
    );
    NodoPregunta.addMensaje(error);
    return;
  },
  (pregunta) => {
    console.log("bien");
    NodoPregunta.setPregunta(pregunta);
  },
  (
    <>
      <MensajeDecidir />
      <MensajeFechasOpciones
        fechas={NodoPregunta.opciones}
        mensaje="Estas son fechas cercanas a la cita que quieres cambiar 😉"
      />
    </>
  ),
  async (value) => {
    switch (value) {
      case "1":
        //fecha
        return PreguntaSeleccionarFecha;
      case "2":
      default:
        throw new Error("Opción no identificada");
    }
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
