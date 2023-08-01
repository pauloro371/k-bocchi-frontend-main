import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { capitalizeWord } from "../../utils/capitalizeWord";
import { CONSULTORIO, DOMICILIO } from "../../utils/modalidad";
import SeleccionarUsuario from "../Chat/SeleccionarUsuario";
import { DateTimePicker } from "@mantine/dates";
import { executeValidation } from "../../utils/isFormInvalid";
import { isRequired, isRequiredValidation } from "../../utils/inputValidation";
import { useEffect, useState } from "react";
import { useShallowEffect } from "@mantine/hooks";
import MapaComponent, { abrirMapa } from "../Mapa";
import CenterHorizontal from "../CenterHorizontal";
import { modals } from "@mantine/modals";
import { FormatDate, formatearFecha } from "../../utils/fechas";
import axios from "axios";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import { useNavigate } from "react-router-dom";

export default function CitaEmergenciaCrear({
  setResultados,
  horario_elegido,
  terapeuta_datos,
  domicilio_elegido,
}) {
  const { paciente } = useSelector(selectUsuario);
  const [guardando, setGuardando] = useState(false);
  const [terapeutaModalidad, setTerapeutaModalidad] = useState();
  const navigate = useNavigate();
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      modalidad: undefined,
      lat: domicilio_elegido.lat,
      lng: domicilio_elegido.lng,
      id_terapeuta: terapeuta_datos.terapeuta.id,
      fecha: horario_elegido.fecha,
      id_paciente: paciente.id,
    },
    validate: {
      modalidad: (value) => executeValidation(value, [isRequiredValidation]),
      domicilio: (value) => executeValidation(value, [isRequiredValidation]),
      lat: (value) => executeValidation(value, [isRequiredValidation]),
      lng: (value) => executeValidation(value, [isRequiredValidation]),
    },
  });
  useEffect(() => {
    console.log({ terapeuta_datos });
    if (
      terapeuta_datos.terapeuta.nombre_del_consultorio === "" &&
      terapeuta_datos.terapeuta.servicio_domicilio === 1
    ) {
      setTerapeutaModalidad("Domicilio");
      form.setFieldValue("modalidad", DOMICILIO);
    }
    if (
      terapeuta_datos.terapeuta.nombre_del_consultorio !== "" &&
      terapeuta_datos.terapeuta.servicio_domicilio === 0
    ) {
      setTerapeutaModalidad("Consultorio");
      form.setFieldValue("modalidad", CONSULTORIO);
    }
    if (
      terapeuta_datos.terapeuta.nombre_del_consultorio !== "" &&
      terapeuta_datos.terapeuta.servicio_domicilio === 1
    ) {
      setTerapeutaModalidad("Ambos");
      form.setFieldValue("modalidad", DOMICILIO);
    }
  }, []);

  useShallowEffect(() => {
    if (form.values.modalidad === CONSULTORIO) {
      console.log("XDDDD", terapeuta_datos.terapeuta.domicilio);
      form.setFieldValue("domicilio", terapeuta_datos.terapeuta.domicilio);
      form.setFieldValue("lat", terapeuta_datos.terapeuta.lat);
      form.setFieldValue("lng", terapeuta_datos.terapeuta.lng);
    }
    if (form.values.modalidad === DOMICILIO) {
      form.setFieldValue("domicilio", domicilio_elegido.domicilio);
      form.setFieldValue("lat", domicilio_elegido.lat);
      form.setFieldValue("lng", domicilio_elegido.lng);
    }
  }, [form.values.modalidad]);
  async function handleGuardar(values) {
    setGuardando(true);

    try {
      let { data } = await axios.post("/citas", {
        ...values,
      });

      showPositiveFeedbackNotification("Se ha agendado tu cita");
      navigate("/app/paciente/agenda");
      modals.closeAll();
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
      console.log(error);
    }
    setGuardando(false);
  }
  return (
    <form onSubmit={form.onSubmit(handleGuardar)}>
      <Stack>
        <Title order={3}>Detalles de la cita</Title>
        <Text>Terapeuta: {terapeuta_datos.nombre}</Text>
        {terapeuta_datos.terapeuta.nombre_del_consultorio !== "" && (
          <Text>
            Consultorio: {terapeuta_datos.terapeuta.nombre_del_consultorio}
          </Text>
        )}
        <Text>Fecha: {FormatDate(horario_elegido.fecha)}</Text>
        <Text>Hora: {horario_elegido.horario_formatted}</Text>

        <>
          {terapeutaModalidad === "Domicilio" && (
            <Text>Modalidad: Domicilio</Text>
          )}
          {terapeutaModalidad === "Consultorio" && (
            <Text>Modalidad: Consultorio</Text>
          )}
          {terapeutaModalidad === "Ambos" && (
            <Radio.Group
              label="Selecciona una modalidad"
              withAsterisk
              {...form.getInputProps("modalidad")}
            >
              <Group mt="xs">
                <Radio value={DOMICILIO} label={capitalizeWord(DOMICILIO)} />
                <Radio
                  value={CONSULTORIO}
                  label={capitalizeWord(CONSULTORIO)}
                />
              </Group>
            </Radio.Group>
          )}
        </>
        <Stack>
          <Text>Domicilio: {form.values.domicilio}</Text>
        </Stack>
        <Flex justify="end">
          <Button
            variant="guardar"
            disabled={!form.isValid()}
            type="submit"
            loading={guardando}
          >
            Guardar
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
