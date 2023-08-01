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
import { modals } from "@mantine/modals";
import { FormatDate } from "../../utils/fechas";

export default function CitaEliminar({ cita, setCitas }) {
  const textoVerificacion = `Kbocchi/Borrar/${cita.id}`;
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
      let { id: id_cita } = cita;

      await axios.delete(`/citas/${id_cita}`);
      showPositiveFeedbackNotification("¡Se ha borrado la cita! 😀");
      setCitas((citas) => {
        let citasNew = [...citas];
        let fecha = FormatDate(cita.fecha);
        let n = citasNew.findIndex(({ header }) => header === fecha);
        citasNew[n].citas = citasNew[n].citas.filter((n) => n.id !== cita.id);
        return citasNew;
      });
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
        <Text>Borrar una cita es una acción sin retorno.</Text>
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
        para eliminar la cita
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
