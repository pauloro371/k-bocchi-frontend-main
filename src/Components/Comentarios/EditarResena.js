import { Button, Center, Flex, Rating, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { Resena } from "../Resena";
import { useForm } from "@mantine/form";
import { executeValidation } from "../../utils/isFormInvalid";
import { isRequiredValidation } from "../../utils/inputValidation";
import axios from "axios";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";

export default function EditarResena({
  resena,
  id_terapeuta,
  setResena,
  onClick = function () {},
}) {
  const [guardando, setGuardando] = useState(false);
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      estrellas: resena.estrellas,
      comentario: "",
    },
    validate: {
      estrellas: (value) => executeValidation(value, [isRequiredValidation]),
    },
  });
  const handleClick = async () => {
    setGuardando(true);
    try {
      let { estrellas } = form.values;
      let { id } = resena;
      await axios.patch("/resenas", {
        id,
        id_terapeuta,
        estrellas,
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
    <>
      <Stack>
        <Text ta="center">¿Cuántas estrellas le pones a este terapeuta?</Text>
        <Center>
          <Resena ta={"center"} {...form.getInputProps("estrellas")} />
        </Center>
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
      </Stack>
    </>
  );
}
