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

export default function CrearComentario({
  id_terapeuta,
  setComentarios,
  onClick,
}) {
  const max = 100;
  const [guardando, setGuardando] = useState(false);
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      comentario: "",
    },
    validate: {
      comentario: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 10, "caracteres"),
          (value) => isLongitudMaxima(value, max, "caracteres"),
        ]),
    },
  });
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  const handleClick = async () => {
    setGuardando(true);
    let { comentario } = form.values;
    try {
      await axios.post("/comentarios", {
        id_terapeuta,
        contenido: comentario,
        id_paciente,
      });
      onClick();
      showPositiveFeedbackNotification("Se ha guardado tu comentario");
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
      <Text>Deja un comentario sobre este terapeuta</Text>
      <ComentarioInput form={form} inputName="comentario" max={max} />
      <Flex justify="end">
        <Button
          variant="guardar"
          disabled={!form.isValid()}
          onClick={handleClick}
          loading={guardando}
        >
          Guardar
        </Button>
      </Flex>
    </Stack>
  );
}
