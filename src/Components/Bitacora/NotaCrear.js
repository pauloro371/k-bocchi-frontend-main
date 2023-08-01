import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useState } from "react";
import axios from "axios";
import { useForm } from "@mantine/form";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  isLongitudMinima,
  isRequiredValidation,
} from "../../utils/inputValidation";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import ImagenAvatar from "../ImagenAvatar";
import LabelNota from "./LabelNota";
import NotaFechas from "./NotaFechas";
import { modals } from "@mantine/modals";
import { FormatDate } from "../../utils/fechas";
import { addTop } from "./ManipularNotas";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import SelectorCitas from "./SelectorCitas";

export default function NotaCrear({ setNotas, pacienteId }) {
  const {
    terapeuta: { id },
  } = useSelector(selectUsuario);
  const [guardando, setIsGuardando] = useState(false);
  const handleSubmit = async () => {
    setIsGuardando(true);
    try {
      let notaContent = form.values;
      let { data: notaCreada } = await axios.post("/notas", {
        id_terapeuta: id,
        nota: notaContent,
      });
      // console.log({ notaModificada });
      let grupoPrevio = FormatDate(notaCreada.fecha_edicion);
      addTop(notaCreada, setNotas, grupoPrevio);
      showPositiveFeedbackNotification(
        "Perfecto, se ha creado la nota correctamente 😀"
      );

      modals.closeAll();
    } catch (err) {
      if (err) {
        let {
          response: { data },
        } = err;
        showNegativeFeedbackNotification(data);
      }
      console.log(err);
    }
    setIsGuardando(false);
  };
  const form = useForm({
    validate: {
      titulo: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 3, "caracteres"),
        ]),
      diagnostico: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 3, "caracteres"),
        ]),
      evolucion: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 3, "caracteres"),
        ]),
      observaciones: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 3, "caracteres"),
        ]),
      tratamiento: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 3, "caracteres"),
        ]),
      id_cita: (value) =>
        value === undefined || value === null
          ? "Selecciona una cita por favor"
          : null,
    },

    validateInputOnChange: true,
    validateInputOnBlur: true,
  });
  return (
    <>
      <Stack pos="relative" py="md">
        <TextInput
          placeholder="Introduce el titulo"
          label={<LabelNota label="Título" />}
          {...form.getInputProps("titulo")}
        />
        {/* <Flex align="center" gap="sm" w="100%">
          <Box>
            <ImagenAvatar image={usuario.foto_perfil} />
          </Box>
          <Text>
            <Text span fw="bold">
              Autor:{" "}
            </Text>
            {usuario.nombre}
          </Text>
        </Flex> */}
        <SelectorCitas
          pacienteId={pacienteId}
          terapeutaId={id}
          form={form}
          fieldName="id_cita"
          label={<LabelNota label="Cita"/>}
          description="Tienes que seleccionar la cita a la cual pertenece la nota"
        />
        <Divider />
        <Container w="100%">
          <Stack spacing="xs" w="100%">
            <Textarea
              label={<LabelNota label="Diagnostico" />}
              {...form.getInputProps("diagnostico")}
            />
            <Textarea
              label={<LabelNota label="Observaciones" />}
              {...form.getInputProps("observaciones")}
            />
            <Textarea
              label={<LabelNota label="Tratamiento" />}
              {...form.getInputProps("tratamiento")}
            />
            <Textarea
              label={<LabelNota label="Evolución" />}
              {...form.getInputProps("evolucion")}
            />
          </Stack>
        </Container>
        <Divider />
        {/* <Stack spacing={0}>
          <NotaFechas nota={nota} />
        </Stack> */}
        <Divider />
        <Flex w="100%" justify="end" gap="md">
          <Button
            onClick={() => {
              modals.closeAll();
            }}
            variant="cerrar"
          >
            Cancelar
          </Button>
          <Button
            disabled={!form.isValid() || !form.isDirty()}
            onClick={() => {
              handleSubmit();
            }}
            variant="guardar"
            loading={guardando}
          >
            Guardar
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
