import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ErrorModal from "../../Components/ErrorModal";
import MensajeErrorConexion from "../../Components/MensajeErrorConexion";
import {
  isNumber,
  isPhoneValidation,
  isRequiredValidation,
} from "../../utils/inputValidation";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  Box,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  NumberInput,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { hasInitialValues } from "../../utils/hasInitialValues";
import { FaUserAlt } from "react-icons/fa";
import { DisabledButton, EnabledButton } from "../../Components/DynamicButtons";


export default function DatosBasicos({ anterior, siguiente }) {
  const { datos, setDatos } = useOutletContext();
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { nombre, apellidos, edad, telefono } = datos;
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const isMobile = useMediaQuery("(max-width: 50em)");
  const form = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      nombre: nombre,
      apellidos: apellidos,
      edad: edad,
      telefono: telefono,
    },
    validate: {
      nombre: (value) => executeValidation(value, [isRequiredValidation]),
      apellidos: (value) => executeValidation(value, [isRequiredValidation]),
      edad: (value) =>
        executeValidation(value, [isRequiredValidation, isNumber]),
      telefono: (value) =>
        executeValidation(value, [isRequiredValidation, isPhoneValidation]),
    },
  });
  useEffect(() => {
    setDatos({ ...datos, ...form.values });
    setDisabled(!form.isValid());
  }, [form.values]);
  useEffect(() => hasInitialValues(form), []);

  const onSubmitSuccess = () => {
    navigate(siguiente);
  };
  const irAtras = () => {
    navigate(anterior);
  };
  return (
    <>
      <ErrorModal close={close} opened={opened}>
        <MensajeErrorConexion />
      </ErrorModal>

      <Box mx="auto" pos={"relative"}>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <Center>
          <ThemeIcon radius="xl" size="xl" color="green-nature">
            <FaUserAlt />
          </ThemeIcon>
        </Center>
        
        <Title order={3} align="center">¡Ahora cuéntanos sobre ti!</Title>
        <Text order={5} align="center" mt="lg" size="lg" color="dimmed">
          Completa los siguientes datos personales
        </Text>
        <form onSubmit={form.onSubmit(onSubmitSuccess)}>
          <TextInput
            label="Nombre"
            placeholder="Introduce tu nombre...."
            mt="lg"
            withAsterisk
            {...form.getInputProps("nombre")}
          />
          <TextInput
            label="Apellidos"
            placeholder="Introduce tus apellidos..."
            mt="xl"
            withAsterisk
            {...form.getInputProps("apellidos")}
          />
          <NumberInput
            label="Edad"
            placeholder="Introduce tu edad..."
            mt="xl"
            withAsterisk
            {...form.getInputProps("edad")}
          />
          <NumberInput
            label="Telefóno"
            placeholder="Introduce tu telefóno..."
            mt="xl"
            withAsterisk
            {...form.getInputProps("telefono")}
          />
          <Flex justify="space-between" mt="lg">
            <Button onClick={irAtras} color="cyan-opaque.9">
              Atrás
            </Button>
            {disabled ? (
              <DisabledButton color="green-nature">Siguiente</DisabledButton>
            ) : (
              <EnabledButton color="green-nature">Siguiente</EnabledButton>
            )}
          </Flex>
        </form>
      </Box>
    </>
  );
}
