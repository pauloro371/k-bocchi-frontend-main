import { List, Text } from "@mantine/core";
import BotMensaje from "./BotMensaje";

export function MensajeReagendar() {
  return (
    <>
      <BotMensaje>
        <Text>¿Deseas reagendar una cita?</Text>
        <List type="ordered">
          <List.Item>
            <Text>Si</Text>
          </List.Item>
          <List.Item>
            <Text>No (Volver al menu principal)</Text>
          </List.Item>
        </List>
      </BotMensaje>
    </>
  );
}
