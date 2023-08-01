import { Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeCitaConfirmacion,
  MensajeCitaInformacion,
  confirmarEliminar,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import axios from "axios";
import { PreguntaBienvenida } from "./PreguntaBienvenida";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import { MensajeReagendar } from "../../../Components/Chatbot/MensajeEliminar";
import { PreguntaAgendar } from "./PreguntaAgendar";

//PreguntaSeleccionarModalidad ->PreguntaSeleccionarDomicilio
export const PreguntaReagendar = new NodoPregunta(
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
        <MensajeReagendar />
      </>
    );
  },
  (Siguiente) => {
    NodoPregunta.setPregunta(Siguiente);
  },
  (
    <>
      <MensajeReagendar />
    </>
  ),
  async (value) => {
    //Si marca 1, desea reagendar, si marca 2 no desea reagendar
    try {
      switch (value) {
        case "1":
          return PreguntaAgendar;
        case "2":
          return PreguntaBienvenida;
        default:
          throw new Error("Opcion no reconocida");
      }
    } catch (err) {
      if (!err) throw new Error("Algo ha salido mal");
      if (err.response) throw { message: err.response.data };
      throw err;
    }
  }
  //   () => {}
);
