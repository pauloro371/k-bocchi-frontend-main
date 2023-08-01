import { Text } from "@mantine/core";
import BotMensaje from "./BotMensaje";

export function MensajeVolver() {
  return (
    <BotMensaje>
      Puedes escribir{" "}
      <Text span fw="bold">
        #Volver
      </Text>{" "}
      para ir al menu principal
    </BotMensaje>
  );
}
