import { Box, Text } from "@mantine/core";
import MensajeOpcionesCrud from "../../../Components/Chatbot/MensajeOpcionesCrud";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeBienvenidaAgendar,
  MensajeCitaConfirmacion,
  MensajeCitaInformacion,
  MensajeIngresarFecha,
  MensajeListaHorarios,
  MensajeNombre,
  MensajeSeleccionarHorario,
  MensajeSeleccionarModalidad,
  confirmarAgendar,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import axios from "axios";
import { PreguntaSeleccionarTerapeuta } from "./PreguntaSeleccionarTerapeuta";
import { PreguntaSeleccionarDomicilio } from "./PreguntaSeleccionarDomicilio";
import { PreguntaBienvenida } from "./PreguntaBienvenida";
import { type } from "@testing-library/user-event/dist/type";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";

//PreguntaConfirmacionAgendar ->PreguntaBienvenida
export const PreguntaConfirmacionAgendar = new NodoPregunta(
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
        <MensajeCitaConfirmacion mensaje={confirmarAgendar}/>
      </>
    );
  },
  (Siguiente) => {
    //Se marca la pregunta siguiente
    NodoPregunta.setPregunta(Siguiente);
  },
  (
    //La pregunta en si
    <>
      <MensajeCitaInformacion />
      <MensajeCitaConfirmacion />
    </>
  ),
  async (value) => {
    //Se obtiene lo que ingreso el usuario
    try {
      switch (value) {
        //si es 1, quiere decir que desea guardar los datos
        case "1":
          //Ahora, si la cita ya tiene una id, se esta modificando una cita, por lo tanto se hace una petición patch en vez de un post
          //Y se guarda los cambios / se crea la cita
          if (NodoPregunta.datos.cita.id) {
            await axios.patch("/citas", {
              ...NodoPregunta.datos.cita,
            });
          } else {
            await axios.post("/citas", {
              ...NodoPregunta.datos.cita,
            });
          }
          //Se añade un mensaje de guardado
          NodoPregunta.datos = null;
          NodoPregunta.addMensaje(
            <>
              <BotMensaje>
                <Text>¡Listo! He guardado tu cita 😉</Text>
              </BotMensaje>
            </>
          );
          //se retorna la pregunta siguiente
          return PreguntaBienvenida;
        case "2":
          //Si puso 2, quiere decir que quiere cancelar
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
