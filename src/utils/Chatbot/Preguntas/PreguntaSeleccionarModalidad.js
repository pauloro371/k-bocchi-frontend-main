import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeSeleccionarModalidad,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import { PreguntaSeleccionarDomicilio } from "./PreguntaSeleccionarDomicilio";
import { PreguntaSeleccionarFecha } from "./PreguntaSeleccionarFecha";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";

//PreguntaSeleccionarModalidad -> PreguntaSeleccionarDomicilio
//PreguntaSeleccionarModalidad -> PreguntaSeleccionarFecha
export const PreguntaSeleccionarModalidad = new NodoPregunta(
  null,
  null,
  (e) => {
    console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{e.message}</Text>
        </BotMensaje>
        
        <MensajeSeleccionarModalidad />
      </>
    );
    NodoPregunta.addMensaje(error);
    return;
  },
  (resultados) => {
    console.log("bien");
    // NodoPregunta.setPregunta(siguiente);
  },
  //El contenido de la pregunta
  (
    <>
      <MensajeSeleccionarModalidad />
    </>
  ),
  async (value) => {
    //Se obtiene el valor escrito por el usuario
    switch (value) {
      case "1":
        //Si es 1, quiere modalidad de consultorio
        console.log("consultorio");
        //Se guardan los datos del terapeuta
        setTerapeutaConsultorioDatos(NodoPregunta.datos.terapeuta);
        //Y se le pregunta la fecha que quiera
        NodoPregunta.setPregunta(PreguntaSeleccionarFecha);
        break;
      case "2":
        console.log("domicilio");
        //Si es domicilio, se marca la siguiente pregunta como PreguntaSeleccionarDomicilio
        NodoPregunta.setPregunta(PreguntaSeleccionarDomicilio);
        break;
      default:
        throw new Error("Opcion no reconocida");
    }
  },
  () => {
    //Esta funcion se ejecuta en cuanto se carga la pregunta, pero antes de que muestre el contenido de la misma
    //Se obtiene primero el terapeuta de los datos
    let { terapeuta } = NodoPregunta.datos;
    //Si el terapeuta tiene ambas modalidades, muestra la pregunta de seleccionar domicilio retornando un true
    if (
      terapeuta.servicio_domicilio === 1 &&
      terapeuta.nombre_del_consultorio !== ""
    ) {
      // alert("Ambos");
      return true;
    }
    //Si el terapeuta solo tiene a domicilio, se marca la siguiente pregunta como la de PreguntaSeleccionarDomicilio y se retorna false, para no mostrar la pregunta PreguntaSeleccionarModalidad
    if (
      terapeuta.servicio_domicilio === 1 &&
      terapeuta.nombre_del_consultorio === ""
      ) {
        // alert("Domicilio");
      NodoPregunta.setPregunta(PreguntaSeleccionarDomicilio);
      return false;
    }
    //Si el terapeuta solo tiene a consultorio, se marca la siguiente pregunta como la de PreguntaSeleccionarFecha y se retorna false, para no mostrar la pregunta PreguntaSeleccionarModalidad
    if (
      terapeuta.servicio_domicilio === 0 &&
      terapeuta.nombre_del_consultorio !== ""
    ) {
      // alert("Consultorio");
      setTerapeutaConsultorioDatos(terapeuta);
      NodoPregunta.setPregunta(PreguntaSeleccionarFecha);
      return false;
    }
  }
);

function setTerapeutaConsultorioDatos(terapeuta) {
  NodoPregunta.setDatos({
    cita: {
      ...NodoPregunta.datos.cita,
      modalidad: "consultorio",
      lat: terapeuta.lat,
      lng: terapeuta.lng,
      domicilio: terapeuta.domicilio,
    },
  });
}
