import { useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { selectUsuario } from "./usuarioHooks";
import useMantenerSesion from "./mantenerSesionHook";
const minutos = 10;
const NOMBRE_LOCAL_STORAGE = "sesion-item";
export const milisegundos = minutos * 60 * 1000;
function getValoresIniciales() {
  let sesionItem = localStorage.getItem(NOMBRE_LOCAL_STORAGE);
  if (sesionItem === null) {
    return { fecha_expiracion: null, id: null };
  } else {
    return deserializeItem(sesionItem);
  }
}
function deserializeItem(sesionItem) {
  let { fecha_expiracion, id } = JSON.parse(sesionItem);
  fecha_expiracion = new Date(fecha_expiracion);
  return { fecha_expiracion, id };
}
export default function useSesionExpiracion() {
  const { id: id_usuario } = useSelector(selectUsuario);
  const {isSesionAbierta,mantenerSesion} = useMantenerSesion();
  const [sesionExpiracion, setSesionExpiracion] = useLocalStorage({
    key: NOMBRE_LOCAL_STORAGE,
    defaultValue: getValoresIniciales(),
    serialize: (object) => {
      console.log({ object });
      return JSON.stringify(object);
    },
    getInitialValueInEffect: true,
    deserialize: (str) => (str === undefined ? null : deserializeItem(str)),
  });
  function setMinutos() {
    let fecha = addMinutos();
    setSesionExpiracion({ ...sesionExpiracion, fecha_expiracion: fecha });
  }
  function addMinutos() {
    let fecha = new Date(Date.now());
    console.log(fecha);
    fecha.setMinutes(fecha.getMinutes() + minutos);
    return fecha;
  }
  function setNull() {
    setSesionExpiracion({ fecha_expiracion: null, id: null });
  }
  function init() {
    let fecha = addMinutos();
    let item = { fecha_expiracion: fecha, id: id_usuario };
    console.log({ item });
    setSesionExpiracion({ ...item });
  }

  function isExpirado() {
    let fecha = new Date();
    console.log(sesionExpiracion);
    if(isSesionAbierta()) return false;
    if (sesionExpiracion.fecha_expiracion === null) return true;
    return fecha >= sesionExpiracion.fecha_expiracion;
  }
  function getId(){
    return sesionExpiracion.id||mantenerSesion.id;
  }

  function isNull() {
    return (
      sesionExpiracion.fecha_expiracion === null || sesionExpiracion.id === null
    );
  }
  return { setMinutos, setNull, isExpirado, sesionExpiracion, init,isNull,getId };
}
