import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import { PreguntaAgendar } from "./PreguntaAgendar";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import axios from "axios";
import { PreguntaBienvenida } from "./PreguntaBienvenida";
import {
  MensajeModificarBienvenida,
  MensajeMostrarCitas,
} from "../../../Components/Chatbot/MensajesModificarCita";
import { PreguntaMenuModificar } from "./PreguntaMenuModificar";

//PreguntaModificar -> PreguntaMenuModificar
export const PreguntaModificar = new NodoPregunta(
  null,
  null,
  (e) => {
    console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{e.message}</Text>
        </BotMensaje>
        <MensajeMostrarCitas mensaje="Elije una cita para modificarla" />
      </>
    );

    NodoPregunta.addMensaje(error);
    return;
  },
  (cita) => {
    //Se guardan los datos de la cita seleccionada
    console.log("bien");
    // NodoPregunta.setPregunta(siguiente);
    let { terapeuta_datos } = { ...cita };
    delete cita.terapeuta_datos;
    NodoPregunta.setDatos({
      cita: {
        ...NodoPregunta.datos.cita,
        ...cita,
      },
      terapeuta: {
        ...terapeuta_datos,
      },
    });
    //Se manda al menu de modificacion
    NodoPregunta.setPregunta(PreguntaMenuModificar);
  },
  (
    //La pregunta como tal
    <>
      <MensajeModificarBienvenida />
      <MensajeMostrarCitas mensaje="Elije una cita para modificarla"/>
    </>
  ),
  async (value) => {
    //Se obtiene el valor ingresado por el usuario
    let seleccionado = NodoPregunta.opciones[value - 1];
    //Si el valor no esta dentro de los parametros se le hace saber
    if (!seleccionado) throw new Error("Opcion no identificada");
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
