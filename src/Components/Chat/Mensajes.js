import { Text } from "@mantine/core";
import Mensaje from "./Mensaje";
import Vacio from "../Vacio";

export default function Mensajes({ mensajes }) {
  const mensajesComponents = mensajes.map((mensaje) => (
    <Mensaje key={mensaje.id} mensaje={mensaje} />
  ));
  return <>{mensajes.length === 0 ? <SinMensajes/> : mensajesComponents}</>;
}

function SinMensajes() {
  return <Vacio children={<Text color="dimmed">¡Manda un mensaje!</Text>} />;
}
