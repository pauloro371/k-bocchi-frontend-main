import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeFechasOpciones,
  MensajeIngresarFecha,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import axios from "axios";
import { PreguntaSeleccionarHora } from "./PreguntaSeleccionarHora";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import { PreguntaConfirmacionAgendar } from "./PreguntaConfirmacionAgendar";

//PreguntaModificarFecha -> PreguntaConfirmacionAgendar
export const PreguntaModificarFecha = new NodoPregunta(
  null,
  null,
  ({ status, data, message }) => {
    console.log({ status, data, message });
    // if (!error) return;
    if (status === 420) {
      //Si la fecha no esta disponible, se muestran las fecha cercanas
      NodoPregunta.addMensaje(<MensajeFechasOpciones fechas={data} />);
      return;
    }
    if (message) {
      NodoPregunta.addMensaje(
        <>
          <BotMensaje>
            <Text>{message}</Text>
          </BotMensaje>
        </>
      );
    } else {
      NodoPregunta.addMensaje(
        <>
          <BotMensaje>
            <Text>{data}</Text>
          </BotMensaje>
        </>
      );
    }
    NodoPregunta.addMensaje(
      <>
        <MensajeIngresarFecha />
      </>
    );
  },
  (fecha) => {
    console.log("bien");
    console.log(fecha);
    // NodoPregunta.setPregunta(siguiente);
    //Se guardan los datos de la fecha seleccionada
    NodoPregunta.setDatos({
      cita: { ...NodoPregunta.datos.cita, fecha },
    });
    //Se manda a la pantalla de guardar
    NodoPregunta.setPregunta(PreguntaConfirmacionAgendar);
  },
  (
    <>
      <MensajeIngresarFecha />
    </>
  ),
  async (value) => {
    //Se obtiene la fecha de la cita
    let { fecha: fecha_cita } = NodoPregunta.datos.cita;
    //Se obtiene unicamente la parte del año,mes y dia
    let hora = fecha_cita.split("T")[1].substring(0, 8);
    try {
      //Se valida si el día y hora esta disponible
      await axios.get(
        `/citas/validarCambioFecha/${NodoPregunta.datos.cita.id_terapeuta}?fecha=${value}&hora=${hora}`
      );
      //Si es así se regresa la nueva fecha
      return `${value}T${hora}.000Z`;
    } catch (err) {
      if (!err) throw new Error("Algo ha salido mal :c");
      let { status, data } = err.response;
      throw { status, data };
    }
  }
  //   () => {}
);
