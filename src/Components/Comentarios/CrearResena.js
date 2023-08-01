import { Button, Center, Flex, Rating, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { Resena } from "../Resena";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import axios from "axios";
import { useForm } from "@mantine/form";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  isLongitudMaxima,
  isLongitudMinima,
  isRequiredValidation,
} from "../../utils/inputValidation";
import ComentarioInput from "./ComentarioInput";
import { MAX_LENGTH_COMENTARIO } from "./longitud";

export default function CrearResena({
  setResena,
  id_terapeuta,
  onClick = function () {},
}) {
  const [guardando, setGuardando] = useState(false);
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      estrellas: null,
      comentario: "",
    },
    validate: {
      estrellas: (value) => executeValidation(value, [isRequiredValidation]),
      comentario: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 10, "caracteres"),
          (value) => isLongitudMaxima(value, MAX_LENGTH_COMENTARIO, "caracteres"),
        ]),
    },
  });
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  const handleClick = async () => {
    setGuardando(true);
    let {estrellas} = form.values;
    try {
        await axios.post("/resenas", {
          id_terapeuta,
          estrellas,
          id_paciente,
        });
        await axios.post("/comentarios", {
          id_terapeuta,
          contenido:form.values.comentario,
          id_paciente,
        });
      onClick();
      showPositiveFeedbackNotification("Se ha guardado tu reseña");
    } catch (error) {
      if (!error) {
        return;
      }
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
      console.log(error);
    }
    setGuardando(false);
  };
  return (
    <Stack>
      <Text ta="center">¿Cuántas estrellas le pones a este terapeuta?</Text>
      <Center>
        <Resena ta={"center"} {...form.getInputProps("estrellas")} />
      </Center>
      <Text>Deja un comentario sobre este terapeuta</Text>
      <ComentarioInput form={form} inputName="comentario" max={MAX_LENGTH_COMENTARIO} />
      <Flex justify="end">
        <Button variant="guardar" disabled={!form.isValid()} onClick={handleClick} loading={guardando}> 
          Guardar
        </Button>
      </Flex>
    </Stack>
  );
}
