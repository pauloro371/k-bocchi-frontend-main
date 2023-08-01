import BitacoraCargada from "./BitacoraCargada";
import BitacoraPlaceholder from "./BitacoraPlaceholder";

//Este componente recibe las notas de la bitacora de un paciente
//Y se enecarga de los estados de carga, vacío y mostrado de bitacora
export default function Bitacora({ notas, crearGrupos,controles }) {
  if (notas === undefined) return <BitacoraPlaceholder />;
  return <BitacoraCargada crearGrupos={crearGrupos} notas={notas} controles={controles} />;
}
