import { useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { selectUsuario } from "./usuarioHooks";
const NOMBRE_LOCAL_STORAGE = "mantener-sesion";
function getValoresIniciales() {
  let sesionItem = localStorage.getItem(NOMBRE_LOCAL_STORAGE);
  if (sesionItem === null) {
    return null;
  } else {
    return deserializeItem(sesionItem);
  }
}
function deserializeItem(sesionItem) {
  let { id } = JSON.parse(sesionItem);
  return { id };
}
export default function useMantenerSesion() {
  const { id: id_usuario } = useSelector(selectUsuario);
  const [mantenerSesion, setMantenerSesion, clear] = useLocalStorage({
    key: NOMBRE_LOCAL_STORAGE,
    defaultValue: getValoresIniciales(),
    serialize: (object) => {
      console.log({ object });
      return JSON.stringify(object);
    },
    getInitialValueInEffect: true,
    deserialize: (str) => (str === undefined ? null : deserializeItem(str)),
  });
  function deleteSesion() {
    clear();
  }
  function setMantener() {
    setMantenerSesion({ id: id_usuario });
  }

  function toggleSesionMantener(value) {
    if (value === true) setMantener();
    else clear();
  }

  function isSesionAbierta() {
    console.log(mantenerSesion);
    return mantenerSesion !== null;
  }

  return {
    deleteSesion,
    setMantener,
    isSesionAbierta,
    mantenerSesion,
    toggleSesionMantener,
  };
}
