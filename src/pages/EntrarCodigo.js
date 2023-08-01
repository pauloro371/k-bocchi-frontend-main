import {
  Button,
  Center,
  Container,
  Flex,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { executeValidation } from "../utils/isFormInvalid";
import {
  isLongitudExacta,
  isLongitudMinima,
  isRequiredValidation,
} from "../utils/inputValidation";
import { useState } from "react";
import { showNegativeFeedbackNotification } from "../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import { modals } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

export default function EntrarCodigo() {
  const [cargando, setCargando] = useState(false);
  const { id: id_usuario } = useSelector(selectUsuario);
  const form = useForm({
    initialValues: {
      codigo_acceso: undefined,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: {
      codigo_acceso: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) =>
            isLongitudExacta(
              value,
              8,
              "Los códigos de acceso son de 8 caracteres"
            ),
        ]),
    },
  });
  const navigate = useNavigate();
  async function handleSubmit(values) {
    setCargando(true);
    try {
      let { codigo_acceso } = values;
      let response = await axios.get(
        `/salas/acceso/${codigo_acceso}/${id_usuario}`
      );
      navigate(`/app/videollamada/${codigo_acceso}`);
    } catch (error) {
      setCargando(false);
      if (!error) return;
      let {
        response: { status },
      } = error;
      if (status === 403) {
        modals.open({
          title: <Title order={3}>¡Atención!</Title>,
          children: <Text>Aún no puedes entrar a la sala</Text>,
        });
        return;
      }
      console.log(error);
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
    setCargando(false);
  }
  return (
    <Container h="100vh">
      <Flex justify="center" align="center" h="100%">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="lg">
            <Title ta="center">Introduce el código de acceso</Title>
            <Text ta="center">
              Si no cuentas con uno, solicitalo a tu terapeuta
            </Text>
            <TextInput
              styles={{
                input: {
                  textAlign: "center",
                },
              }}
              maxLength={8}
              {...form.getInputProps("codigo_acceso")}
            />
            <Flex justify="center">
              <Button
                variant="siguiente"
                disabled={!form.isValid()}
                loading={cargando}
                type="submit"
              >
                Entrar
              </Button>
            </Flex>
          </Stack>
        </form>
      </Flex>
    </Container>
  );
}
