import {
  Box,
  Card,
  Center,
  LoadingOverlay,
  PasswordInput,
  ThemeIcon,
  Title,
  Text,
  Flex,
  Stack,
  Loader,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { executeValidation } from "../utils/isFormInvalid";
import {
  isRequiredValidation,
  password_validation,
} from "../utils/inputValidation";
import { FaLock } from "react-icons/fa";
import { useForm } from "@mantine/form";
import {
  showInfoNotification,
  showPositiveFeedbackNotification,
} from "../utils/notificationTemplate";
import { DisabledButton, EnabledButton } from "../Components/DynamicButtons";

export default function CambiarContrasena() {
  const [isValidando, setIsValidando] = useState(true);
  const [correcto, setIsCorrecto] = useState(true);
  const { stringEncoded } = useParams();
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  async function validarLink() {
    try {
      setIsValidando(true);
      await axios.get(`/usuarios/validarLink/${stringEncoded}`);
    } catch (err) {
      if (!err) {
        return;
      }
      console.log(err);
      modals.open({
        title: <Title order={3}>Error</Title>,
        children: (
          <>
            <Text>{err.response.data}</Text>
          </>
        ),
        withCloseButton: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
      });
      console.log(err);
    }
    setIsValidando(false);
  }

  const form = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
    validate: {
      contrasena: (value) =>
        executeValidation(value, [isRequiredValidation, password_validation]),
      confirmarContrasena: (value, values) =>
        executeValidation(value, [
          isRequiredValidation,
          password_validation,
          (value) =>
            values.contrasena !== value ? "Las contraseñas no coinciden" : null,
        ]),
    },
  });

  async function onSubmitSuccess() {
    setIsValidando(true);

    try {
      await axios.post("/usuarios/reestablecerContrasena", {
        contrasena: form.values.contrasena,
        stringEncoded: stringEncoded,
      });
      modals.open({
        title: <Title order={3}>Correcto</Title>,
        children: (
          <Stack spacing="md" justify="center" align="center">
            <Text>Se ha cambiado tu contraseña correctamente</Text>
            <Text>Te estamos redirigiendo al inicio...</Text>
            <Loader size="md" />
          </Stack>
        ),
        withCloseButton: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
      });
      setTimeout(() => {
        modals.closeAll();
        navigate("/");
      }, 2500);
    } catch (error) {
      if (!error) return;
      form.setErrors({
        contrasena: error.response.data,
      });
    }
    setIsValidando(false);
  }
  useEffect(() => {
    validarLink();
  }, [stringEncoded]);
  useEffect(() => {
    setDisabled(!form.isValid());
  }, [form.values]);
  return (
    <Flex align="center" h="100vh">
      <Card maw="30%" miw="320px" mx="auto" shadow="lg">
        <Box w="auto" mx="auto" pos={"relative"}>
          <LoadingOverlay visible={isValidando} overlayBlur={2} />
          <Center>
            <ThemeIcon radius="xl" size="xl" color="green-nature">
              <FaLock color="green-nature" />
            </ThemeIcon>
          </Center>
          <Title align="center" order={3}>
            Introduce tu nueva contraseña
          </Title>
          <form onSubmit={form.onSubmit(onSubmitSuccess)}>
            <>
              <PasswordInput
                label="Contraseña"
                placeholder="Contrasena"
                mt="xl"
                withAsterisk
                disabled={isValidando}
                {...form.getInputProps("contrasena")}
              />
              <PasswordInput
                label="Confirmar contraseña"
                placeholder="Contraseña"
                mt="xl"
                disabled={isValidando}
                withAsterisk
                {...form.getInputProps("confirmarContrasena")}
              />
            </>

            <Flex justify="flex-end" mt="lg">
              {disabled ? (
                <DisabledButton color="green-nature">Siguiente</DisabledButton>
              ) : (
                <EnabledButton color="green-nature">Siguiente</EnabledButton>
              )}
            </Flex>
          </form>
        </Box>
      </Card>
    </Flex>
  );
}
