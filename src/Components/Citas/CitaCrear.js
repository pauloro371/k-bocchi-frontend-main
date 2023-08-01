import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Radio,
  SimpleGrid,
  Stack,
  Text,
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
import { FormatDate } from "../../utils/fechas";
import axios from "axios";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
export default function CitaCrear({ setCitas }) {
  const { terapeuta } = useSelector(selectUsuario);
  const [guardando, setGuardando] = useState(false);
  const fechaActual = new Date();
  let fecha = new Date(fechaActual.setMinutes(fechaActual.getMinutes() + 10));
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      lng: terapeuta.lng,
      lat: terapeuta.lat,
      id_paciente: undefined,
      fecha,
      modalidad: undefined,
      domicilio: terapeuta.domicilio,
      id_terapeuta: terapeuta.id,
    },
    validate: {
      lng: (value) => executeValidation(value, [isRequiredValidation]),
      lat: (value) => executeValidation(value, [isRequiredValidation]),
      id_paciente: (value) => executeValidation(value, [isRequiredValidation]),
      fecha: (value) => executeValidation(value, [isRequiredValidation]),
      modalidad: (value) => executeValidation(value, [isRequiredValidation]),
      domicilio: (value) => executeValidation(value, [isRequiredValidation]),
    },
  });
  useEffect(() => {
    console.log({ f: form.values });
  }, [form.values]);
  useShallowEffect(() => {
    if (form.values.modalidad === CONSULTORIO) {
      console.log("XDDDD", terapeuta.domicilio);
      form.setFieldValue("domicilio", terapeuta.domicilio);
      form.setFieldValue("lat", terapeuta.lat);
      form.setFieldValue("lng", terapeuta.lng);
    } else {
      form.setFieldValue("domicilio", undefined);
      form.setFieldValue("lat", undefined);
      form.setFieldValue("lng", undefined);
    }
  }, [form.values.modalidad]);
  async function handleGuardar(values) {
    setGuardando(true);
    let { foto_perfil, nombre } = values;
    delete values.foto_perfil;
    delete values.nombre;
    let { fecha } = values;
    let x = new Date(fecha);

    try {
      let { data } = await axios.post("/citas", {
        ...values,
        fecha: new Date(x.setHours(x.getHours() - 6)),
      });
      console.log("handleGuardar called");
      setCitas((c) => {
        console.log("setCitas called");
        let nuevasCitas = [...c];
        let xd = FormatDate(data.fecha);
        let grupoIndex = nuevasCitas.findIndex(({ header }) => header === xd);
        try {
          if (grupoIndex !== -1) {
            nuevasCitas[grupoIndex].citas = nuevasCitas[
              grupoIndex
            ].citas.filter((n) => n.id !== data.id);
            nuevasCitas[grupoIndex].citas.push({
              ...data,
              nombre,
              foto_perfil,
            });
            nuevasCitas[grupoIndex].citas.sort(compararFecha);
          } else {
            nuevasCitas.push({
              header: FormatDate(data.fecha),
              citas: [{ ...data, nombre, foto_perfil }],
            });
            nuevasCitas.sort(compararHeader);
          }
        } catch (error) {
          console.log(error);
          if (error) {
            let {
              response: { data },
            } = error;
            showNegativeFeedbackNotification(data);
          }
        } finally {
          console.log({ grupoIndex });
        }
        modals.closeAll();
        return nuevasCitas;
      });
    } catch (error) {
      console.log(error);
    }
    setGuardando(false);
  }
  function compararFecha(a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  }
  function compararHeader(a, b) {
    return new Date(a.header) - new Date(b.header);
  }
  return (
    <form onSubmit={form.onSubmit(handleGuardar)}>
      <Stack h="100vh">
        <Grid justify="center" align="end">
          <Grid.Col xs={12} sm={6} lg="auto">
            <SeleccionarUsuario
              setSeleccion={(obj) => {
                console.log(obj);
                form.setFieldValue("id_paciente", obj.id_paciente);
                form.setFieldValue("nombre", obj.nombre);
                form.setFieldValue("foto_perfil", obj.foto_perfil);
              }}
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={6} lg="auto">
            <DateTimePicker
              valueFormat="DD MMM YYYY HH:mm"
              label="Selecciona la fecha para crear una cita"
              minDate={new Date()}
              maw={400}
              modalProps={{
                zIndex: 1000,
              }}
              dropdownType="modal"
              mx="auto"
              {...form.getInputProps("fecha")}
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={6} lg="auto">
            <CenterHorizontal>
              <Radio.Group
                label="Selecciona una modalidad"
                withAsterisk
                {...form.getInputProps("modalidad")}
              >
                {terapeuta.nombre_del_consultorio !== "" &&
                  terapeuta.servicio_domicilio === 1 && (
                    <Group mt="xs">
                      <Radio
                        value={DOMICILIO}
                        label={capitalizeWord(DOMICILIO)}
                      />
                      <Radio
                        value={CONSULTORIO}
                        label={capitalizeWord(CONSULTORIO)}
                      />
                    </Group>
                  )}
              </Radio.Group>
            </CenterHorizontal>
          </Grid.Col>
        </Grid>
        <Stack>
          <Text>Domicilio: {form.values.domicilio || "Sin seleccionar"}</Text>
          {form.values.modalidad === DOMICILIO && (
            <MapaComponent
              setDatosLat={({ coords: { lat, lng }, direccion: domicilio }) => {
                console.log({ lat, lng, domicilio });
                form.setValues({
                  ...form.values,
                  lat,
                  lng,
                  domicilio,
                });
                return true;
              }}
            />
          )}
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
