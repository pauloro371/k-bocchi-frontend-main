import {
  Button,
  Container,
  Flex,
  Group,
  Image,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { FaFileUpload, FaImage } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";
import {
  CATEGORIA_DISPOSITIVO,
  CATEGORIA_MEDICAMENTO,
} from "../../utils/categorias";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  isLongitudMaxima,
  isLongitudMinima,
  isMaximoNumero,
  isMinimoNumero,
  isRequired,
  isRequiredValidation,
} from "../../utils/inputValidation";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import SeleccionarUsuario from "../Chat/SeleccionarUsuario";
import { DateTimePicker } from "@mantine/dates";
import { FormatUTCDateTime, FormatUTCDateTime12 } from "../../utils/fechas";

export default function EditarSala({ onEditar, sala }) {
  const theme = useMantineTheme();
  const [urlImagen, setUrlImagen] = useState();
  const [guardando, setGuardando] = useState(false);
  const {
    terapeuta: { id: id_terapeuta },
  } = useSelector(selectUsuario);
  console.log({ editar: sala });
  console.log(FormatUTCDateTime12(sala.fecha_inicio));

  const form = useForm({
    initialValues: {
      id_terapeuta,
      id_paciente: sala.paciente.id,
      fecha_inicio: new Date(FormatUTCDateTime(sala.fecha_inicio)),
      id: sala.id,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: {
      id_paciente: (value) => executeValidation(value, [isRequiredValidation]),
      fecha_inicio: (value) => executeValidation(value, [isRequiredValidation]),
    },
    transformValues: (values) => ({
      ...values,
      fecha_inicio: new Date(
        values.fecha_inicio.setHours(values.fecha_inicio.getHours() - 6)
      ),
    }),
  });
  async function handleGuardar(value) {
    setGuardando(true);
    console.log({ value });
    try {
      let { data: sala } = await axios.patch(`/salas`, value);
      onEditar(sala);
      showPositiveFeedbackNotification("Se ha creado correctamente tu sala");
    } catch (err) {
      if (!err) {
        return;
      }
      let {
        response: { data },
      } = err;
      showNegativeFeedbackNotification(data);
      console.log(err);
    }
    setGuardando(false);
  }
  return (
    <Container fluid>
      <form onSubmit={form.onSubmit(handleGuardar)}>
        <Stack>
          <DateTimePicker
            valueFormat="DD MMM YYYY hh:mm"
            label="Selecciona la fecha de inicio de la videollamada"
            minDate={new Date()}
            maw={400}
            modalProps={{
              zIndex: 1000,
            }}
            dropdownType="modal"
            mx="auto"
            {...form.getInputProps("fecha_inicio")}
          />
          <SeleccionarUsuario
            setSeleccion={(obj) => {
              console.log({ obj });
              form.setFieldValue("id_paciente", obj.id_paciente);
            }}
            initialValue={sala.paciente.id_usuario}
          />
          <Flex justify="end" w="100%">
            <Button
              variant="guardar"
              disabled={!form.isValid()}
              loading={guardando}
              type="submit"
            >
              Guardar
            </Button>
          </Flex>
        </Stack>
      </form>
    </Container>
  );
}
