import { Stack } from "@mantine/core";
import GrupoNotas from "./GrupoNotas";
import { formatearFecha } from "../../utils/fechas";

//Este componente permite desplegar los grupos en un contenedor, así mismo
//Permite crear los grupos a partir de las notas
export default function BitacoraCargada({ crearGrupos, notas, controles }) {
  let grupos = crearGrupos(notas);
  return (
    <Stack w="100%" h="100%">
      {controles}
      {grupos.length === 0 ? (
        <div>Vacio</div>
      ) : (
        <Stack w="100%" h="100%" spacing="5em">
          {grupos}
        </Stack>
      )}
    </Stack>
  );
}
