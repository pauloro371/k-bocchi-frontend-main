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
import { erase } from "./ManipularNotas";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useState } from "react";
import { modals } from "@mantine/modals";

export default function NotaEliminar({ nota, setNotas }) {
  const textoVerificacion = `Kbocchi/Borrar/${nota.id}`;
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
      let { id: id_nota } = nota;
      let {
        terapeuta: { id: id_terapeuta },
      } = usuario;
      await axios.delete(`/notas`, {
        data: {
          id: id_nota,
          id_terapeuta,
        },
      });
      showPositiveFeedbackNotification("¡Se ha borrado la nota! 😀");
      erase(nota, setNotas);
      modals.closeAll();
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
        <Text>Borrar una nota es una acción sin retorno.</Text>
        <Text>
          Una vez eliminada{" "}
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
        para eliminar la nota
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
