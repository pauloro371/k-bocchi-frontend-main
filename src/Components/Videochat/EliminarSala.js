import {
  Button,
  Flex,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useState } from "react";

export default function EliminarSala({ onEliminar, sala }) {
  const textoVerificacion = `Kbocchi/Borrar/${sala.id}`;
  const [borrando, setBorrando] = useState(false);
  const usuario = useSelector(selectUsuario);
  const theme = useMantineTheme();
  const form = useForm({
    validate: {
      textoVerificacion: (value) => (value !== textoVerificacion ? "" : null),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });
  const handleBorrar = async () => {
    setBorrando(true);
    try {
      let { id: id_sala } = sala;
      await axios.delete(`/salas/${id_sala}`);
      showPositiveFeedbackNotification("¡Se ha borrado la sala! 😀");
      onEliminar(id_sala);
    } catch (error) {
      if (error) {
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      }
    }
    setBorrando(false);
  };
  return (
    <Stack>
      <Text fz="lg">
        <Text>Borrar una sala es una acción sin retorno.</Text>
        <Text>
          Una vez eliminado{" "}
          <Text span fw="bold" c={theme.colors.red[8]}>
            no podrás recuperarla
          </Text>
        </Text>
      </Text>
      <Text fz="lg">
        Escribe{" "}
        <Text span fw="bold" c={theme.colors["blue-calm"][9]}>
          {textoVerificacion}
        </Text>{" "}
        para eliminar la sala
      </Text>
      <TextInput
        placeholder={textoVerificacion}
        fz="lg"
        {...form.getInputProps("textoVerificacion")}
      />
      <Flex justify="end">
        <Button
          variant="danger"
          disabled={!form.isValid()}
          loading={borrando}
          onClick={handleBorrar}
        >
          Borrar
        </Button>
      </Flex>
    </Stack>
  );
}
