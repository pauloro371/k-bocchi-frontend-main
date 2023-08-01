import {
  ScrollArea,
  Text,
  Checkbox,
  Center,
  Table,
  Button,
  Alert,
  Title,
  Avatar,
} from "@mantine/core";

import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import {
  SimpleGrid,
  Skeleton,
  Container,
  Stack,
  useMantineTheme,
  px,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import ContactIcon from "../Components/InfoPerfil";
import { MdAlternateEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import useMantenerSesion from "../utils/mantenerSesionHook";
import {
  useDebouncedValue,
  useMediaQuery,
  randomId,
  useShallowEffect,
  useForceUpdate,
} from "@mantine/hooks";
import { FISIOTERAPEUTA, PACIENTE } from "../roles";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../utils/notificationTemplate";
import { ResenaGeneral } from "../Components/ResenaGeneral";
import axios from "axios";
import { useRef } from "react";
import HoraInput from "../Components/Inputs/HoraInput";
import { useFormContext } from "react-hook-form";
import {
  isRequired,
  isRequiredValidation,
  isTiempo,
} from "../utils/inputValidation";
import { executeValidation } from "../utils/isFormInvalid";
import getValueFromPath from "../Components/GetValueFromPath";
import FotoPerfil from "../Components/FotoPerfil";
import { useXs } from "../utils/mediaQueryHooks";
import OnboardPaypal from "../Components/Paypal/OnboardPaypal";

export default function Perfil() {
  const theme = useMantineTheme();
  const usuario = useSelector(selectUsuario);
  const big = useXs();
  return (
    <Container h="100vh" fluid>
      <SimpleGrid h="100%" cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
        <Stack spacing="md" my="auto" h="100%" align="center" justify="center">
          <FotoPerfil
            height={big ? "40vh" : "35vh"}
            width={big ? "40vh" : "35vh"}
          />
          <Title order={4} ta="center">
            {usuario.nombre}
          </Title>
          <EstrellasUsuario />
        </Stack>
        <ScrollArea h="100%" py="md">
          <Stack spacing="md" my="auto" justify="center" h="100%">
            <ContactIcon
              title="Correo"
              description={usuario.email}
              icon={MdAlternateEmail}
            />
            <ContactIcon
              title="Telefono"
              description={usuario.telefono}
              icon={BsFillTelephoneFill}
            />
            <PaypalStatus />
            <CheckboxMantenerSesion />
            <HorarioUsuario />
          </Stack>
        </ScrollArea>
      </SimpleGrid>
    </Container>
  );
}
function PaypalStatus() {
  return <OnboardPaypal />;
}

function EstrellasUsuario() {
  const usuario = useSelector(selectUsuario);
  const [estrellas, setEstrellas] = useState(undefined);
  useEffect(() => {
    async function fetchEstrellas() {
      if (usuario.rol !== FISIOTERAPEUTA) return;
      try {
        let {
          terapeuta: { id },
        } = usuario;
        let { promedio } = (
          await axios.get(`/usuarios/fisioterapeutas/resenas/${id}`)
        ).data;

        console.log(promedio);
        setEstrellas(promedio);
      } catch (err) {
        if (err) {
          showNegativeFeedbackNotification(
            "No hemos podido cargar tus estrellas 😫"
          );
        }
      }
    }
    fetchEstrellas();
  }, []);
  useEffect(() => {
    console.log(estrellas);
  }, [estrellas]);
  if (usuario.rol === PACIENTE) return null;
  return estrellas === undefined ? (
    <Skeleton //Estrellas
      height="5%"
      width="70%"
      mx="auto"
      radius="md"
      animate={true}
    />
  ) : (
    <Center>
      <ResenaGeneral estrellas={estrellas} />
    </Center>
  );
}
function HorarioUsuario() {
  const usuario = useSelector(selectUsuario);
  const [horario, setHorario] = useState(undefined);
  const [forceRender, setForceRender] = useState({ render: false });

  useEffect(() => {
    async function fetchHorario() {
      if (usuario.rol !== FISIOTERAPEUTA) return;
      try {
        let {
          terapeuta: { id },
        } = usuario;
        let { horario } = (
          await axios.get(`/usuarios/fisioterapeutas/horario/${id}`)
        ).data;

        console.log(horario);
        setHorario(horario);
      } catch (err) {
        if (err) {
          showNegativeFeedbackNotification(
            "No hemos podido cargar tu horario 😫"
          );
        }
      }
    }
    fetchHorario();
  }, [forceRender]);
  function forceUpdate() {
    setHorario(undefined);
    setForceRender({ render: true });
  }
  useEffect(() => {
    console.log(horario);
  }, [horario]);
  if (usuario.rol === PACIENTE) return null;
  return horario === undefined ? (
    <Skeleton //Horario
      height="65vh"
      width="70vh"
      mx="auto"
      radius="md"
      animate={true}
    />
  ) : (
    <Center>
      <TablaHorario horario={horario} forceUpdate={forceUpdate} />
    </Center>
  );
}

function getDiasOrdenados(horario) {
  const dias = [
    { dia: "domingo", output: "Domingo" },
    { dia: "lunes", output: "Lunes" },
    { dia: "martes", output: "Martes" },
    { dia: "miercoles", output: "Miércoles" },
    { dia: "jueves", output: "Jueves" },
    { dia: "viernes", output: "Viernes" },
    { dia: "sabado", output: "Sábado" },
  ];
  const diasOrdenados = dias.map((d, index) => {
    let dia = horario.find((h) => h.dia === d.dia);
    if (!dia) {
      dia = {
        ...dia,
        dia: d.dia,
        isTrabajado: false,
        hora_inicio: "",
        hora_fin: "",
      };
    } else {
      dia = {
        ...dia,
        dia: d.dia,
        hora_inicio: formatFecha(dia.hora_inicio),
        hora_fin: formatFecha(dia.hora_fin),
        isTrabajado: true,
      };
    }
    return { dia, output: d.output };
  });
  return diasOrdenados;
}

function TablaHorario({ horario, forceUpdate }) {
  const theme = useMantineTheme();
  const usuario = useSelector(selectUsuario);
  const big = useXs();
  const diasOrdenados = getDiasOrdenados(horario);
  const dias = diasOrdenados.map(({ dia }) => dia);
  const [errorNumeroDias, setErrorNumeroDias] = useState();
  const [isGuardando, setIsGuardando] = useState(false);
  console.log({ dias });
  const form = useForm({
    validateInputOnChange: false,
    validateInputOnBlur: false,
    initialValues: {
      horarios: [...dias],
      numeroDias: horario.length,
    },
    validate: {
      horarios: {
        hora_inicio: (value, values, path) =>
          !values.horarios[path.split(".")[1]].isTrabajado
            ? null
            : executeValidation(value, [
                isRequiredValidation,
                isTiempo,
                (value) => {
                  //[horarios,index,prop]
                  let pathSplit = path.split(".");
                  let index = pathSplit[1];
                  let hora_inicio = crearFechaFromTiempo(value);
                  let { hora_fin } = values.horarios[index];
                  hora_fin = crearFechaFromTiempo(hora_fin);
                  // if (
                  //   form.validateField(`${pathSplit[0]}.${pathSplit[1]}.hora_fin`)
                  //     .hasError
                  // )
                  //   return null;
                  if (hora_inicio >= hora_fin)
                    return "La fecha de inicio tiene que ser menor";

                  return null;
                },
              ]),
        hora_fin: (value, values, path) =>
          !values.horarios[path.split(".")[1]].isTrabajado
            ? null
            : executeValidation(value, [
                isRequiredValidation,
                isTiempo,
                (value) => {
                  //[horarios,index,prop]
                  let pathSplit = path.split(".");
                  let index = pathSplit[1];
                  let hora_fin = crearFechaFromTiempo(value);
                  let { hora_inicio } = values.horarios[index];
                  hora_inicio = crearFechaFromTiempo(hora_inicio);
                  // if (
                  //   form.validateField(`${pathSplit[0]}.${pathSplit[1]}.hora_inicio`)
                  //     .hasError
                  // )
                  //   return null;
                  if (hora_fin <= hora_inicio)
                    return "La fecha de fin tiene que ser mayor";

                  return null;
                },
              ]),
      },
      numeroDias: (value, values) => {
        if (value <= 0)
          return "Por lo menos agrega un día a tu horario. Si no lo haces, ¡tus pacientes no podrán agendar citas contigo! ¿O a caso no quieres chambear?🤨";
        return null;
      },
    },
    transformValues: (values) => ({
      ...values,
      horarios: values.horarios
        .filter((d) => d.isTrabajado === true)
        .map((d) => {
          let dia = { ...d };
          delete dia.isTrabajado;
          return {
            ...dia,
            hora_inicio: `${dia.hora_inicio}:00`,
            hora_fin: `${dia.hora_fin}:00`,
          };
        }),
    }),
  });
  useEffect(() => {
    console.log({ values: form.values });
  }, [form.values]);
  // useEffect(() => {
  //   console.log({ errors: form.errors });
  //   // return () => form.clearErrors()
  //   setErrorNumeroDias(form.errors.numeroDias);
  // }, [form.errors]);
  useShallowEffect(() => {
    // return () => form.clearErrors()
    setErrorNumeroDias(form.validateField("numeroDias").error);
  }, [form.values.numeroDias]);
  const handleSubmit = async (value) => {
    setIsGuardando(true);
    console.log({ final: value });
    let { horarios: horario } = value;
    try {
      // console.log(usuario);
      let {
        terapeuta: { id: id_terapeuta },
      } = usuario;
      let body = {
        id_terapeuta,
        horario,
      };
      await axios.patch("/usuarios/fisioterapeutas/horario", body);
      showPositiveFeedbackNotification(
        "Perfecto. ¡Se ha modificado tu horario! 😊"
      );
      forceUpdate();
      console.log({ body });
    } catch (err) {
      console.log(err);
      if (err) showNegativeFeedbackNotification(err.response.data);
    }
    setIsGuardando(false);
  };
  const handleError = (value) => {
    console.log({ error: value });
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Stack align="end" w="100%">
        <Title order={3} ta="center" w="100%">
          Tu horario
        </Title>
        {errorNumeroDias && (
          <Alert
            icon={<FiAlertCircle size="1rem" />}
            title="¡Atención!"
            color="blue-calm.3"
            w="100%"
          >
            {errorNumeroDias}
          </Alert>
        )}
        <ScrollArea w={"100%"}>
          <Table w={big ? "100%" : "125%"}>
            <thead>
              <tr>
                <th></th>
                <th>Dia</th>
                <th>Inicio</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              {diasOrdenados.map(({ dia, output }, index) => (
                <FilaTablaHorario
                  dia={dia}
                  output={output}
                  form={form}
                  index={index}
                  key={index}
                  disabled={isGuardando}
                />
              ))}
            </tbody>
          </Table>
        </ScrollArea>
        <div>
          <Button
            variant="guardar"
            type="submit"
            disabled={!form.isValid() || !form.isDirty()}
            loading={isGuardando}
          >
            Guardar
          </Button>
        </div>
      </Stack>
    </form>
  );
}
function FilaTablaHorario({ dia, output, form, index, disabled }) {
  // console.log({ dia });
  const horario_inicio = `horarios.${index}.hora_inicio`;
  const horario_fin = `horarios.${index}.hora_fin`;
  const isTrabajado = `horarios.${index}.isTrabajado`;
  const horario = `horarios.${index}`;
  const [{ error: errorInicio, hasError: hasErrorInicio }, setErrorInicio] =
    useState({ error: null, hasError: null });
  const [{ error: errorFin, hasError: hasErrorFin }, setErrorFin] = useState({
    error: null,
    hasError: null,
  });
  useShallowEffect(() => {
    // console.log(inputName, getValueFromPath(form.values, inputName));
    setErrorInicio(form.validateField(horario_inicio));
    setErrorFin(form.validateField(horario_fin));
    // console.log({ error_inicio, error_fin });
    // return () => {
    //   form.clearFieldError(horario_fin);
    //   form.clearFieldError(horario_inicio);
    // };
  }, [getValueFromPath(form.values, horario)]);
  useShallowEffect(() => {
    let numeroDias = form.values.horarios.filter(
      (d) => d.isTrabajado === true
    ).length;
    form.setFieldValue("numeroDias", numeroDias);
  }, [getValueFromPath(form.values, isTrabajado)]);

  return (
    <tr key={output}>
      <td width="10%">
        {
          <Checkbox
            {...form.getInputProps(isTrabajado, {
              type: "checkbox",
            })}
          />
        }
      </td>
      <td width="30%">{output}</td>
      <td width="30%">
        <HoraInput
          label=""
          disabled={!getValueFromPath(form.values, isTrabajado) || disabled}
          inputName={horario_inicio}
          propName={`horarios.${index}`}
          form={form}
          error={errorInicio}
        />
      </td>
      <td width="30%">
        <HoraInput
          label=""
          disabled={!getValueFromPath(form.values, isTrabajado) || disabled}
          inputName={horario_fin}
          propName={`horarios.${index}`}
          form={form}
          error={errorFin}
        />
      </td>
    </tr>
  );
}
function formatFecha(fecha = "") {
  return fecha.substring(0, 5);
}
function CheckboxMantenerSesion() {
  const { isSesionAbierta, toggleSesionMantener, mantenerSesion } =
    useMantenerSesion();
  const [value, setValue] = useState(isSesionAbierta());
  const [debounced] = useDebouncedValue(value, 200);
  useEffect(() => {
    toggleSesionMantener(debounced);
  }, [debounced]);
  return (
    <Checkbox
      checked={value}
      onChange={({ currentTarget: { checked: value } }) => {
        setValue(value);
      }}
      label="Mantener sesión iniciada"
    />
  );
}

function crearFechaFromTiempo(tiempo, fecha = new Date()) {
  let hora = new Date(`${fecha.toDateString()} ${tiempo}:00`);
  return hora;
}
