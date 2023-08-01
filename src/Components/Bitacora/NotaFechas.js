import { Text } from "@mantine/core";
import { FormatUTCTime, formatearFecha } from "../../utils/fechas";

export default function NotaFechas({ nota }) {
    let fechaCreacion = `${formatearFecha(
      nota.fecha_creacion
    )} a las ${FormatUTCTime(nota.fecha_creacion)}`;
    let fechaEdicion = `${formatearFecha(
      nota.fecha_edicion
    )} a las ${FormatUTCTime(nota.fecha_edicion)}`;
    return (
      <>
        <Text c="dimmed" fz="xs">
          <Text span fw="bold">
            Creado:{" "}
          </Text>
          {fechaCreacion}
        </Text>
        <Text c="dimmed" fz="xs">
          <Text span fw="bold">
            Modificado:{" "}
          </Text>
          {fechaEdicion}
        </Text>
      </>
    );
  }