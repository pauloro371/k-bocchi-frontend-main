import { Box, Text } from "@mantine/core";
import NodoPregunta from "../NodoPregunta";
import MensajeOpcionesCrud from "../../../Components/Chatbot/MensajeOpcionesCrud";
import { PreguntaAgendar } from "./PreguntaAgendar";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import { PreguntaModificar, getFecha } from "./PreguntaModificar";
import axios from "axios";
import { PreguntaMenuModificar } from "./PreguntaMenuModificar";
import { PreguntaEliminar } from "./PreguntaEliminar";
import { PreguntaConfirmacionEliminar } from "./PreguntaConfirmacionEliminar";

//PreguntaBienvenida -> PreguntaAgendar
//PreguntaBienvenida -> PreguntaModificar
//PreguntaBienvenida -> PreguntaCancelar
export const PreguntaBienvenida = new NodoPregunta(
  null,
  null,
  (e) => {
    //Escribimos el mensaje de error
    console.log(e);
    //Creamos el componente con el mensaje de error
    let error = (
      <>
        <BotMensaje>
          <Text>{e.message}</Text>
        </BotMensaje>
        {/* Mostramos las opciones posibles del menu */}
        <MensajeOpcionesCrud />
      </>
    );
    //Agregamos el mensaje
    NodoPregunta.addMensaje(error);
    return;
  },
  (siguiente) => {
    //Cuando se elige una opcion correcta, se cambia la pregunta a la opción elegida
    console.log("bien");
    NodoPregunta.setPregunta(siguiente);
  },
  (
    //Este es el contenido de la pregunta
    <>
      <MensajeOpcionesCrud />
    </>
  ),
  //Aqui se procesa lo que el usuario escribio
  async (value) => {
    switch (value) {
      //Si escribio 1 la siguiente pregunta es la de agendar
      case "1":
        //agendar
        console.log("Agendar");
        return PreguntaAgendar;
      //Modificar
      //Si escribio 1 la siguiente pregunta es la de modficar
      case "2": {
        console.log("Modificar");
        //Se obtiene el id del paciente y la fecha actual
        let id = NodoPregunta.id_paciente;
        let fecha = getFecha(new Date());
        let citas;
        try {
          //Posteriormente se obtiene las citas del paciente
          citas = await axios.get(
            `/usuarios/pacientes/${id}/citas?fecha=${fecha}`
          );
        } catch (err) {
          //Si hay un error se lanza al siguiente try catch
          console.log(err);
          throw new Error("Algo ha salido mal :c");
        }
        //Si no tiene citas se hace lo mismo
        if (citas.data.length === 0) {
          throw new Error("Disculpa, no tienes citas proximas 😓");
        }
        //Si solo tiene una cita, se guardan los datos de la misma
        if (citas.data.length === 1) {
          let { terapeuta_datos } = { ...citas.data[0] };
          delete citas.data[0].terapeuta_datos;
          //Se guardan en los datos
          NodoPregunta.setDatos({
            cita: {
              ...NodoPregunta.datos.cita,
              ...citas.data[0],
            },
            terapeuta: {
              ...terapeuta_datos,
            },
          });
          //Y se retorna la siguiente pregunta que es la de PreguntaMenuModificar
          return PreguntaMenuModificar;
        }
        //Si tiene más de una se agregan todas las citas como opciones
        NodoPregunta.opciones = citas.data;
        //Y se retorna la siguiente pregunta PreguntaModificar
        return PreguntaModificar;
      }

      case "3": {
        console.log("Cancelar");
        // throw new Error("Opcion no implementada");
        //Cancelar
        let id = NodoPregunta.id_paciente;
        let fecha = getFecha(new Date());
        let citas;
        try {
          //Se obtienen las citas del usuario
          citas = await axios.get(
            `/usuarios/pacientes/${id}/citas?fecha=${fecha}`
          );
        } catch (err) {
          console.log(err);
          throw new Error("Algo ha salido mal :c");
        }
        if (citas.data.length === 0) {
          throw new Error("Disculpa, no tienes citas proximas 😓");
        }
        if (citas.data.length === 1) {
          let { terapeuta_datos } = { ...citas.data[0] };
          delete citas.data[0].terapeuta_datos;
          NodoPregunta.setDatos({
            cita: {
              ...NodoPregunta.datos.cita,
              ...citas.data[0],
            },
            terapeuta: {
              ...terapeuta_datos,
            },
          });
          //Se determina que la siguiente pregunta es PreguntaConfirmacionEliminar
          return PreguntaConfirmacionEliminar;
        }
        //Se guardan las citas como opciones
        NodoPregunta.opciones = citas.data;
        //Y se retorna PreguntaEliminar como siguiente pregunta
        return PreguntaEliminar;
      }
      default:
        throw new Error("Opcion no reconocida");
    }
  },
  () => {
    return resetDatos();
  }
);
export function resetDatos() {
  NodoPregunta.setDatos({
    cita: {
      id_paciente: NodoPregunta.id_paciente,
    },
    terapeuta: null,
  });
  return true;
}
