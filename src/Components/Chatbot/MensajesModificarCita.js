import { List, Text } from "@mantine/core";
import BotMensaje from "./BotMensaje";
import NodoPregunta from "../../utils/Chatbot/NodoPregunta";
import { FormatUTCDateTime } from "../../utils/fechas";


export function MensajeElegirParametro() {
  const { terapeuta } = NodoPregunta.datos;
  return (
    <>
      <BotMensaje>
        <Text>¿Qué quieres cambiar de tu cita?</Text>
        <List type="ordered">
          <List.Item key="parametroFecha">
            <Text>Cambiar fecha</Text>
          </List.Item>
          <List.Item key="parametroHora">
            <Text>Cambiar hora</Text>
          </List.Item>
          <List.Item key="parametroAmbas">
            <Text>Cambiar fecha y hora</Text>
          </List.Item>
          {terapeuta.servicio_domicilio == 1 ? (
            <List.Item key="parametroLugar">
              <Text>Cambiar domicilio</Text>
            </List.Item>
          ) : (
            <></>
          )}
        </List>
      </BotMensaje>
    </>
  );
}

export function MensajeMostrarCitas({mensaje}) {
  const citas = NodoPregunta.opciones;
  return (
    <>
      <BotMensaje>
        <Text>{mensaje}</Text>
        <List type="ordered">
          {citas.map((cita) => (
            <List.Item key={`cita-${cita.id}`} mb="sm">
              <Text style={{ wordWrap: "break-word", width: "90%" }}>
                <Text span fw="bold">
                  Domicilio:{" "}
                </Text>
                {cita.domicilio}
              </Text>
              <Text style={{ wordWrap: "break-word", width: "90%" }}>
                <Text span fw="bold">
                  Fecha:{" "}
                </Text>
                {FormatUTCDateTime(cita.fecha)}
              </Text>
              <Text style={{ wordWrap: "break-word", width: "90%" }}>
                <Text span fw="bold">
                  Terapeuta:{" "}
                </Text>
                {cita.terapeuta_datos.usuario.nombre} (
                {cita.terapeuta_datos.numero_cedula})
              </Text>
            </List.Item>
          ))}
        </List>
      </BotMensaje>
    </>
  );
}
export function MensajeModificarBienvenida() {
  return (
    <>
      <BotMensaje>
        <Text>¡Bien! Estas son tus citas proximas</Text>
      </BotMensaje>
    </>
  );
}

export function MensajeModificarHora() {
  let horarios = NodoPregunta.opciones;
  return (
    <>
      <BotMensaje>
        <Text>Elige uno de los horarios disponibles</Text>
        <List type="ordered">
          {horarios.map((h) => (
            <List.Item key={`horario-${h.horario_formatted}`} mb="sm">
              <Text>{h.horario_formatted}</Text>
            </List.Item>
          ))}
        </List>
      </BotMensaje>
    </>
  );
}

export function MensajeDecidirCambio() {
  return (
    <>
      <BotMensaje>
        <Text>¿Deseas elegir cambiar tu cita para otro día?</Text>
        <List type="ordered">
          <List.Item key="cambio-si">
            <Text>Si</Text>
          </List.Item>
          <List.Item key="cambio-no">
            <Text>No (Volver al menu principal)</Text>
          </List.Item>
        </List>
      </BotMensaje>
    </>
  );
}
export function MensajeDecidir() {
  return (
    <>
      <BotMensaje>
        <Text>Parece que no hay cupo para citas este día</Text>
      </BotMensaje>
      <MensajeDecidirCambio />
    </>
  );
}
