import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import { PreguntaAgendar } from "./PreguntaAgendar";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import axios from "axios";
import { PreguntaBienvenida } from "./PreguntaBienvenida";
import {
  MensajeElegirParametro,
  MensajeModificarBienvenida,
  MensajeMostrarCitas,
} from "../../../Components/Chatbot/MensajesModificarCita";
import { PreguntaModificarFecha } from "./PreguntaModificarFecha";
import { PreguntaModificarHora } from "./PerguntaModificarHora";
import { PreguntaModificarDesicion } from "./PreguntaModificarDesicion";
import { MensajeFechasOpciones } from "../../../Components/Chatbot/MensajesAgendarCita";
import { PreguntaSeleccionarFecha } from "./PreguntaSeleccionarFecha";
import { PreguntaSeleccionarDomicilio } from "./PreguntaSeleccionarDomicilio";

//PreguntaModificar -> PreguntaMenuModificar
export const PreguntaMenuModificar = new NodoPregunta(
  null,
  null,
  ({ message }) => {
    // console.log(e);
    let error = (
      <>
        <BotMensaje>
          <Text>{message}</Text>
        </BotMensaje>
        <MensajeElegirParametro />
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
      <MensajeElegirParametro />
    </>
  ),
  async (value) => {
    //Se evalua lo que ingreso el usuario
    switch (value) {
      case "1":
        //si puso 1 quiere modificar la fecha
        //fecha
        return PreguntaModificarFecha;
      case "2":
        ///Si puso 2 quiere modificar la hora
        //Se obtienen los datos
        let { id } = NodoPregunta.datos.terapeuta;
        let { fecha: fecha_completa } = NodoPregunta.datos.cita;
        let fecha = fecha_completa.split("T")[0];
        let horariosResponse;
        try {
          //se sacan los horarios disponibles en la fecha de la cita
          horariosResponse = await axios.get(
            `/citas/validarFecha/${id}?fecha=${fecha}`
          );
          //se guardan como opciones los horarios disponibles
          NodoPregunta.opciones = horariosResponse.data.horarios_disponibles;
          //Se marca la siguiente pregunta PreguntaModificarHora
          return PreguntaModificarHora;
        } catch (err) {
          //Si algo salio mal
          if (!err) throw new Error("Algo ha salido mal :c");
          //Se revisa si el status es 420 (No hay horarios para ese día ya)
          if (err.response.status === 420) {
            //Se guardan las fechas disponibles mas cercanas
            NodoPregunta.opciones = err.response.data;
            console.log(NodoPregunta.opciones);
            //Y se retorna la siguiente pregunta
            return PreguntaModificarDesicion;
          }
          throw { message: err.response.data, status: err.response.status };
        }
      //hora
      case "3":
        //Si pone 3 quiere modificar ambos parametros fecha y hora
        return PreguntaSeleccionarFecha;
      //ambas
      case "4":
        //si puso 4 quiere modificar el domicilio de su cita
        //domicilio
        return PreguntaSeleccionarDomicilio;
        break;
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
