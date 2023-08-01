import { useForm } from "@mantine/form";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  isLongitudMaxima,
  isLongitudMinima,
  isRequiredValidation,
} from "../../utils/inputValidation";
import { MAX_LENGTH_COMENTARIO } from "./longitud";
import { Button, Flex, Text } from "@mantine/core";
import ComentarioInput from "./ComentarioInput";
import { useState } from "react";
import axios from "axios";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";

export default function EditarComentario({
  comentario,
  onClick,
}) {
  const [guardando, setGuardando] = useState(false);
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      comentario: comentario.contenido,
    },
    validate: {
      comentario: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMinima(value, 10, "caracteres"),
          (value) =>
            isLongitudMaxima(value, MAX_LENGTH_COMENTARIO, "caracteres"),
        ]),
    },
  });
  const handleClick = async () => {
    setGuardando(true);
    let { id } = comentario;
    let comentarioEditar = { ...comentario };
    comentarioEditar.contenido = form.values.comentario
    delete comentarioEditar.fecha_ordenacion;
    try {
      await axios.patch("/comentarios", {
        id,
        comentario: comentarioEditar,
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
    <>
      <Text>Deja un comentario sobre este terapeuta</Text>
      <ComentarioInput
        form={form}
        inputName="comentario"
        max={MAX_LENGTH_COMENTARIO}
      />
      <Flex justify="end">
        <Button
          variant="guardar"
          disabled={!form.isValid() || !form.isDirty()}
          onClick={handleClick}
          loading={guardando}
        >
          Guardar
        </Button>
      </Flex>
    </>
  );
}
