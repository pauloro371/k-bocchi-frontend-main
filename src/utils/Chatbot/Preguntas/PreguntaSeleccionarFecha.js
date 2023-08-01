import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeFechasOpciones,
  MensajeIngresarFecha,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import axios from "axios";
import { PreguntaSeleccionarHora } from "./PreguntaSeleccionarHora";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";

//PreguntaSeleccionarFecha ->PreguntaSeleccionarHora
export const PreguntaSeleccionarFecha = new NodoPregunta(
  null,
  null,
  (error) => {
    console.log(error);
    if (!error) return;
    //Se obtiene el status de la respuesta incorrecta
    //Se obtiene la data
    let {
      response: { data },
      response: { status },
    } = error;
    //Si el status es 420, se muestran las fechas disponibles
    if (status === 420) {
      NodoPregunta.addMensaje(<MensajeFechasOpciones fechas={data} />);
      return;
    }
    //Si el status es diferente, el error no es relacionado con la fechas
    NodoPregunta.addMensaje(
      <>
        <BotMensaje>
          <Text>{data}</Text>
        </BotMensaje>
        
      </>
    );
    NodoPregunta.addMensaje(
      <>
        <MensajeIngresarFecha />
      </>
    );
  },
  ({ data }) => {
    // NodoPregunta.setPregunta(siguiente);
    console.log("bien");
    console.log(data);
    //Si el usuario selecciono la opcion valida, entonces se guarda la propiedad "horarios_disponibles" en las opciones
    NodoPregunta.opciones = data.horarios_disponibles;
    //Y se marca como pregunta siguiente la PreguntaSeleccionarHora
    NodoPregunta.setPregunta(PreguntaSeleccionarHora)
  },
  (
    //La pregunta como tal
    <>
      <MensajeIngresarFecha />
    </>
  ),
  async (value) => {
    //Se obtiene el valor ingresado por el usuario
    try {
      //Se buscan los días/horarios disponibles del terapeuta en la fecha ingresada
      let horarios_disponibles = await axios.get(
        `/citas/validarFecha/${NodoPregunta.datos.cita.id_terapeuta}?fecha=${value}`
      );
      //Se retorna las opciones encontradas
      return horarios_disponibles;
    } catch (err) {
      throw err;
    }
  }
  //   () => {}
);
