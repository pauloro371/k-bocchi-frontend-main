import { Box, Button, List, Text } from "@mantine/core";
import NodoPregunta from "../../utils/Chatbot/NodoPregunta";
import { useState } from "react";
import { abrirMapa } from "../Mapa";
import {
  PreguntaSeleccionarDomicilio,
  seleccionarUbicacion,
} from "../../utils/Chatbot/Preguntas/PreguntaSeleccionarDomicilio";
import BotMensaje from "./BotMensaje";
import { capitalizeWord } from "../../utils/capitalizeWord";
import { FormatUTCDateTime } from "../../utils/fechas";

export function MensajeBienvenidaAgendar() {
  return (
    <BotMensaje>
      <Text>¡Ok! Agendemos una cita</Text>
    </BotMensaje>
  );
}

export function MensajeNombre() {
  return (
    <BotMensaje>
      <Text>Porfavor ingresa el nombre completo del terapeuta</Text>
    </BotMensaje>
  );
}

export function MensajeSeleccionarTerapeuta({ terapeutas }) {
  console.log(NodoPregunta.opciones);

  return (
    <BotMensaje>
      <Text>
        Por favor elige el terapeuta con el que deseas agendar una cita
      </Text>
      <List type="ordered">
        {/* Se itera sobre todas las opciones posibles para mostrarlas */}
        {NodoPregunta.opciones.map((t) => {
          return (
            <List.Item key={`${t.id_usuario}`}>
              <Text>Nombre: {t.usuario.nombre}</Text>
              <Text>Cedula: {t.numero_cedula}</Text>
              <Text>
                Consultorio: {t.nombre_del_consultorio || "Sin consultorio"}
              </Text>
            </List.Item>
          );
        })}
      </List>
    </BotMensaje>
  );
}

export function MensajeAvisoVariosTerapeutas() {
  return (
    <BotMensaje>
      <Text>Se han encotrado varios terapeutas con nombre similar.</Text>
    </BotMensaje>
  );
}

export function MensajeSeleccionarModalidad() {
  let { terapeuta } = NodoPregunta.datos;
  return (
    <BotMensaje>
      <Text>Este terapeuta cuenta con las siguientes modalidades:</Text>
      <List type="ordered">
        <List.Item key="consultorio">
          Consultorio: {terapeuta.domicilio}
        </List.Item>
        <List.Item key="domicilio">Domicilio</List.Item>
      </List>
    </BotMensaje>
  );
}

export function MensajeSeleccionarDomicilio() {
  //Se crea un estado para guardar la direccion seleccionada
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(false);
  return (
    <BotMensaje>
      <Text mb="sm">Ahora tienes que seleccionar el domicilio de la cita</Text>
      {direccionSeleccionada ? (
        <Text>Direccion seleccionada: {direccionSeleccionada}</Text>
      ) : (
        <>
          {/* Se muestra la pregunta de seleccionar ubicación y el boton que permite abrir el mapa */}
          <Button
            color="blue-calm.4"
            onClick={async () => {
              let domicilio = await seleccionarUbicacion();
              //Una vez se obtiene el domicilio, ejecuta la función onSubmit la pregunta PreguntaSeleccionarDomicilio
              await PreguntaSeleccionarDomicilio.onSubmit(domicilio);
              setDireccionSeleccionada(domicilio.direccion);
            }}
          >
            Seleccionar dirección de la cita
          </Button>
        </>
      )}
    </BotMensaje>
  );
}
const defaultMessage =
  "La fecha seleccionada no esta disponible. Las siguientes opciones son las más cercanas a la elegida";
export function MensajeFechasOpciones({ fechas, mensaje = defaultMessage }) {
  return (
    <BotMensaje>
      {mensaje !== null ? <Text>{mensaje}</Text> : <></>}
      <List type="unordered">
        {fechas.map((t) => {
          return (
            <List.Item key={`${t}`}>
              <Text>{t.split("T")[0]}</Text>
            </List.Item>
          );
        })}
      </List>
    </BotMensaje>
  );
}

export function MensajeIngresarFecha() {
  return (
    <BotMensaje>
      <Text>
        Ingresa la fecha que deseas agendar tu cita {"(En formato YYYY-mm-dd)"}
      </Text>
    </BotMensaje>
  );
}

export function MensajeSeleccionarHorario() {
  return (
    <BotMensaje>
      <Text>Estos son los horarios disponibles en la fecha elegida</Text>
    </BotMensaje>
  );
}

export function MensajeListaHorarios() {
  let horarios_disponibles = NodoPregunta.opciones;
  //Se itera sobre las opciones de horario y se muestran
  return (
    <BotMensaje>
      <List type="ordered">
        {horarios_disponibles.map((t) => {
          return (
            <List.Item key={`${t.horario_formatted}`}>
              <Text>{t.horario_formatted}</Text>
            </List.Item>
          );
        })}
      </List>
    </BotMensaje>
  );
}

export function MensajeCitaInformacion() {
  let { cita } = NodoPregunta.datos;
  let { terapeuta } = NodoPregunta.datos;
  //Se muestran los datos de la cita
  return (
    <BotMensaje>
      <Text>
        <Text span fw="bold">
          Fecha:{" "}
        </Text>
        {FormatUTCDateTime(cita.fecha)}
      </Text>
      <Text>
        <Text span fw="bold">
          Modalidad:{" "}
        </Text>
        {capitalizeWord(cita.modalidad)}
      </Text>
      <Text>
        <Text span fw="bold">
          Domicilio:{" "}
        </Text>
        {cita.domicilio}
      </Text>
      <Text>
        <Text span fw="bold">
          Nombre terapeuta:{" "}
        </Text>
        {terapeuta.usuario.nombre}
      </Text>
      <Text>
        <Text span fw="bold">
          Cedula terapeuta:{" "}
        </Text>
        {terapeuta.numero_cedula}
      </Text>
    </BotMensaje>
  );
}

export const confirmarAgendar = "¡Perfecto! ¿Deseas guardar la cita?";
export const confirmarEliminar = "¡Perfecto! ¿Deseas eliminar la cita?";

export function MensajeCitaConfirmacion({ mensaje }) {
  return (
    <BotMensaje>
      <Text>{mensaje}</Text>
      <List type="ordered">
        <List.Item key="consultorio">Si</List.Item>
        <List.Item key="domicilio">No (Volver al menu principal)</List.Item>
      </List>
    </BotMensaje>
  );
}
