import { Box, Text } from "@mantine/core";
import MensajeOpcionesCrud from "../../../Components/Chatbot/MensajeOpcionesCrud";
import NodoPregunta from "../NodoPregunta";
import {
  MensajeBienvenidaAgendar,
  MensajeNombre,
  MensajeSeleccionarDomicilio,
  MensajeSeleccionarModalidad,
} from "../../../Components/Chatbot/MensajesAgendarCita";
import axios from "axios";
import { PreguntaSeleccionarTerapeuta } from "./PreguntaSeleccionarTerapeuta";
import { abrirMapa } from "../../../Components/Mapa";
import { showNegativeFeedbackNotification } from "../../notificationTemplate";
import { PreguntaSeleccionarFecha } from "./PreguntaSeleccionarFecha";
import BotMensaje from "../../../Components/Chatbot/BotMensaje";
import { PreguntaConfirmacionAgendar } from "./PreguntaConfirmacionAgendar";

//PreguntaSeleccionarDomicilio -> PreguntaSeleccionarFecha
export const PreguntaSeleccionarDomicilio = new NodoPregunta(
  null,
  null,
  (e) => {
    console.log(e);
    let { message } = e;

    let error = (
      <>
        <BotMensaje>
          <Text>{message}</Text>
        </BotMensaje>

        <MensajeSeleccionarDomicilio />
      </>
    );
    NodoPregunta.addMensaje(error);
    return;
  },
  (resultados) => {
    //Se obtiene el domicilio seleccionado por el usuario
    //Se guarda en los datos
    NodoPregunta.setDatos({
      cita: {
        ...NodoPregunta.datos.cita,
        modalidad: "domicilio",
        lat: resultados.lat,
        lng: resultados.lng,
        domicilio: resultados.direccion,
      },
    });
    //Si la cita en datos tiene un id, quiere decir que estamos modificando una cita, entonces mandamos al usuario a la pregunta de guardar
    if (NodoPregunta.datos.cita.id) {
      NodoPregunta.setPregunta(PreguntaConfirmacionAgendar);
    } else {
      //Si no tiene id, quiere decir que estamos agendando/creando una cita
      NodoPregunta.setPregunta(PreguntaSeleccionarFecha);
    }
  },
  (
    //El contenido de la pregunta
    <>
      <MensajeSeleccionarDomicilio />
    </>
  ),
  async (value) => {
    //Si el usuario no selecciono nada, se marca error
    if (!value.direccion || !value.lat || !value.lng)
      throw new Error("Vuelve a seleccionar la dirección porfavor");
    console.log(NodoPregunta.datos.terapeuta);
    try {
      // Se obtienen los datos ingresados por el usuario
      let { lat: latA, lng: lngA } = value;
      //Y se obtiene la id del terapeuta
      let { id } = NodoPregunta.datos.terapeuta;
      //Se valida que el domicilio este dentro del rango
      await axios.get(
        `/citas/validarDomicilio/${id}?latA=${latA}&lngA=${lngA}`
      );
      //Retorna el valor ingresado si todo sale bien
      return value;
    } catch (err) {
      //Si algo sale mal se marca como error
      if (!err) throw new Error("Algo ha salido mal :c");
      let { status, data } = err.response;
      throw { status, message: data };
    }
  }
);

//Permite abrir el mapa y guardar los datos
export async function seleccionarUbicacion() {
  return new Promise((resolve, reject) => {
    abrirMapa({
      setDatosLat: async ({ coords, direccion }) => {
        resolve({ ...coords, direccion });
      },
    });
  });
}

async function obtenerUbicacionActual() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${process.env.REACT_APP_MAPS_API_KEY}`
          )
          .then((value) => {
            resolve({ lat: pos.coords.altitude, lng: pos.coords.longitude });
            console.log(value);
          })
          .catch((err) => {
            console.log(err);
            throw new Error("No se ha podido obtener tu ubicación :c");
          });
        console.log(pos);
      },
      (err) => {
        showNegativeFeedbackNotification(
          "No se pudo obtener la posición actual"
        );
        throw new Error("No se pudo obtener la posición actual");
        console.log(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  });
}
