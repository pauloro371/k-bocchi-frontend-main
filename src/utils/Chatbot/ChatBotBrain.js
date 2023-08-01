import { Box, Text } from "@mantine/core";
import NodoPregunta from "./NodoPregunta";
import MensajeOpcionesCrud from "../../Components/Chatbot/MensajeOpcionesCrud";
import {
  MensajeBienvenidaAgendar,
  MensajeNombre,
} from "../../Components/Chatbot/MensajesAgendarCita";
let nombre;
const PreguntaAgendar = new NodoPregunta(
  null,
  null,
  () => {
    console.log("mal");
  },
  (value) => {
    console.log(`bien, valor ingresado: ${nombre}`);

  },
  (
    <>
      <MensajeBienvenidaAgendar />
      <MensajeNombre />
    </>
  ),
  (value) => {
    console.log(`Haciendo request con axios... `);
    nombre = value
  }
);

