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
import { PreguntaReagendar } from "./PreguntaReagendar";

//PreguntaConfirmacionEliminar ->PreguntaReagendar
export const PreguntaConfirmacionEliminar = new NodoPregunta(
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
        <MensajeCitaInformacion />
        <MensajeCitaConfirmacion mensaje={confirmarEliminar} />
      </>
    );
  },
  (Siguiente) => {
    NodoPregunta.setPregunta(Siguiente);
  },
  (
    <>
      <MensajeCitaInformacion />
      <MensajeCitaConfirmacion mensaje={confirmarEliminar} />
    </>
  ),
  async (value) => {
    try {
      switch (value) {
        //Si el usuario escribe 1, quiere decir que si quiere eliminar la cita
        case "1":
          console.log("eliminando");
          console.log(NodoPregunta.datos);
          console.log(NodoPregunta.datos.cita.id);
          let { id } = NodoPregunta.datos.cita;
          //Se hace la petición para eliminar la cita
          await axios.delete(`/citas/${id}`);
          //Y se notifica mediante el bot el exito de la operación
          NodoPregunta.addMensaje(
            <>
              <BotMensaje>
                <Text>¡Listo! He eliminado tu cita 😉</Text>
              </BotMensaje>
            </>
          );
          //Se manda a la pregunta de reagendar
          return PreguntaReagendar;
        case "2":
          //Si marco 2 quiere decir que no desea eliminar la cita seleccionada
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
