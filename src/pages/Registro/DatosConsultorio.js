import { useEffect, useState } from "react";
import {
  isLongitudMinima,
  isNumber,
  isRequiredValidation,
  password_validation,
} from "../../utils/inputValidation";
import { executeValidation } from "../../utils/isFormInvalid";

import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Center,
  Flex,
  LoadingOverlay,
  TextInput,
  ThemeIcon,
  Title,
  Text,
  Button,
  Group,
  Switch,
  useMantineTheme,
  Stack,
  NumberInput,
  Grid,
} from "@mantine/core";
import { FaCheck, FaLock } from "react-icons/fa";
import { DisabledButton, EnabledButton } from "../../Components/DynamicButtons";
import { useForm } from "@mantine/form";
import { ImCross } from "react-icons/im";
import { modals } from "@mantine/modals";
import { abrirMapa } from "../../Components/Mapa";
import { useSetState } from "@mantine/hooks";

function validacionNombreConsultorio(value) {
  return value.length < 3
    ? "El nombre del consultorio tiene que tener minimo 3 caracteres"
    : null;
}

export function DatosConsultorio({ anterior, siguiente }) {
  const { datos, setDatos } = useOutletContext();
  const navigate = useNavigate();
  //Obtenemos los datos necesarios para esta interfaz
  const {
    nombre_del_consultorio,
    direccion,
    servicio_domicilio,
    servicio_consultorio,
    coords,
    pago_maximo,
    pago_minimo,
  } = datos;
  //Estado para habilitar boton siguiente
  const [disabled, setDisabled] = useState(true);
  //Estado para indicar estado de carga
  const [isLoading, setIsLoading] = useState(false);
  //Estado para saber si el usuario ofrece servicio a domicilio
  const [isDomicilio, setIsDomicilio] = useState(servicio_domicilio);
  //Estado para saber si el usuario ofrece servicio a consultorio
  const [isConsultorio, setIsConsultorio] = useState(servicio_consultorio);
  //Estado para saber si el rango introducido por el usuario es valido
  const [isRangoCorrecto, setIsRangoCorrecto] = useState(false);
  //Estado para saber si los datos del consultorio introducido por el usuario son validos
  const [isConsultorioCorrecto, setIsConsultorioCorrecto] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    let isModalidadSeleccionada = isDomicilio || isConsultorio;
    //Cada vez que cambien los datos se realiza una revision
    //Si el usuario ofrece a domicilio, su rango es correcto al igual que su direccion, y no ofrece servicio a consultorio activamos el boton de siguiente
    if (isDomicilio && isRangoCorrecto && !isConsultorio && direccion) {
      setDisabled(false);
      return;
    }
    //Si el usuario ofrece a consultorio, su rango es correcto y no ofrece servicio a domicilio activamos el boton de siguiente
    if (
      isConsultorio &&
      !isDomicilio &&
      isRangoCorrecto &&
      isConsultorioCorrecto
    ) {
      setDisabled(false);
      return;
    }
    //Si el usuario ofrece a domicilio y consultrio, además su rango es correcto, activamos el boton de siguiente
    if (
      isDomicilio &&
      isConsultorio &&
      isRangoCorrecto &&
      isConsultorioCorrecto
    ) {
      setDisabled(false);
      return;
    }
    setDisabled(true);
  }, [datos]);
  const onSubmitSuccess = async (data) => {
    console.log("DATOS: ", datos);

    navigate(siguiente);
  };

  const onSubmitError = (data) => {
    alert(JSON.stringify(datos));
    navigate(siguiente);
  };
  const irSiguiente = () => {
    navigate(siguiente);
  };
  const irAnterior = () => {
    navigate(anterior);
  };

  return (
    <>
      <Box mx="auto" pos={"relative"}>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <Center>
          <ThemeIcon radius="xl" size="xl" color="green-nature">
            <FaLock color="green-nature" />
          </ThemeIcon>
        </Center>
        <Title align="center" order={3}>
          ¡Continuemos!
        </Title>

        <Text order={5} mt="lg" size="lg" color="dimmed" align="center">
          Ahora, cuentamos acerca de como ofrecerás tus servicios en K-Bocchi
        </Text>
        <Stack mt="lg">
          {/* Se renderiza el componente de los rangos de precio y se le pasa el setter para rangoCorrecto */}
          <RegistroRangoPrecios
            datos={datos}
            setDatos={setDatos}
            setIsCorrecto={setIsRangoCorrecto}
          />
          {/* Componente check para servicio a domicilio*/}
          <SwitchWithIcon
            checked={isDomicilio}
            setChecked={(value) => {
              setIsDomicilio(value);
              setDatos({ ...datos, servicio_domicilio: value });
            }}
            label={"Servicio a domicilio"}
          />
          {/* Componente check para servicio a consultorio*/}
          <SwitchWithIcon
            checked={isConsultorio}
            setChecked={(value) => {
              setIsConsultorio(value);
              setDatos({ ...datos, servicio_consultorio: value });
            }}
            label={"Servicio en consultorio"}
          />
          <Text color="dimmed">
            Agrega una referencia de la zona en que sueles trabajar, para que
            sea más sencillo que tus pacientes te encuentren
          </Text>
          {/* Si el usuario solo ofrece servicio a domicilio, se le muestra la opcion de ingresar su domicilio */}
          {!isConsultorio && isDomicilio && (
            <>
              <Text color={!direccion ? "red.4" : "green-nature"}>
                Dirección: {direccion || "Aún no se ha seleccionado"}
              </Text>
              <Button
                color="green-nature"
                onClick={() =>
                  //Abrir mapa es la función que se encarga de mostrar el mapa de google maps
                  abrirMapa({
                    setDatosLat: ({ coords, direccion }) => {
                      //Se guardan las coordenadas y dirección obtenidas
                      setDatos({
                        ...datos,
                        coords: { ...coords },
                        direccion: direccion,
                      });
                    },
                  })
                }
              >
                {" "}
                Añadir dirección
              </Button>
            </>
          )}
          {/* Si el terapeuta ofrece servicio en consultorio se muestra el componente para capturar datos de consultorio */}
          {isConsultorio && (
            <ConsultorioInformacion
              datos={datos}
              setDatos={setDatos}
              setIsCorrecto={setIsConsultorioCorrecto}
            />
          )}
        </Stack>
        <Flex justify="space-between" mt="lg">
          <Button color="green-nature" onClick={irAnterior}>
            Atrás
          </Button>
          {disabled ? (
            <DisabledButton color="green-nature">Siguiente</DisabledButton>
          ) : (
            <EnabledButton color="green-nature" onClick={irSiguiente}>
              Siguiente
            </EnabledButton>
          )}
        </Flex>
      </Box>
    </>
  );
}

function SwitchWithIcon({ checked, setChecked, label }) {
  const theme = useMantineTheme();
  return (
    <Group position="center">
      <Switch
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
        color="teal"
        size="md"
        label={label}
        thumbIcon={
          checked ? (
            <FaCheck
              size="0.8rem"
              color={theme.colors.teal[theme.fn.primaryShade()]}
              stroke={3}
            />
          ) : (
            <ImCross
              size="0.6rem"
              color={theme.colors.red[theme.fn.primaryShade()]}
              stroke={3}
            />
          )
        }
      />
    </Group>
  );
}

//Componente que recibe los datos, el setter para cambiar los datos y el de correcto
function ConsultorioInformacion({ datos, setDatos, setIsCorrecto }) {
  //obtenemos los datos que requerimos
  const { nombre_del_consultorio, direccion } = datos;
  const form = useForm({
    initialValues: {
      nombre_del_consultorio: nombre_del_consultorio,
    },
    validateInputOnChange: true,
    validate: {
      nombre_del_consultorio: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          validacionNombreConsultorio,
        ]),
    },
  });
  useEffect(() => {
    //cada vez que cambie direccion o el formulario se actualizan los datos
    console.log(form.isValid());
    setDatos({
      ...datos,
      ...form.values,
    });
    //Si no es valido este formulario seteamos como incorrecto mediante el setter de los parametros
    if (!form.isValid()) {
      setIsCorrecto(false);
      return;
    }
    //Si la dirección esta vacia o nula igual marcamos como incorrecto
    if (direccion == "" || direccion == null) {
      setIsCorrecto(false);
      // form.setErrors({
      //   ...form.errors,
      //   nombre_del_consultorio: "Falta seleccionar la direccion",
      // });
      return;
    }
    //si pasa todas las pruebas marca como correcto
    setIsCorrecto(true);
    form.setErrors({});
  }, [form.values, direccion]);
  return (
    <>
      <TextInput
        label="Nombre del consultorio"
        value={nombre_del_consultorio}
        onChange={(e) => {}}
        {...form.getInputProps("nombre_del_consultorio")}
      />
      <Text color={!direccion ? "red.4" : "green-nature"}>
        Dirección del consultorio: {direccion || "Aún no se ha seleccionado"}
      </Text>
      <Button
        color="green-nature"
        onClick={() =>
          abrirMapa({
            setDatosLat: ({ coords, direccion }) => {
              setDatos({
                ...datos,
                coords: { ...coords },
                direccion: direccion,
              });
            },
          })
        }
      >
        Añadir dirección
      </Button>
    </>
  );
}

//Componente que permite obtener los rangos de precio
function RegistroRangoPrecios({ datos, setDatos, setIsCorrecto }) {
  //Se obtiene los datos necesarios
  let { pago_maximo, pago_minimo } = datos;
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      pago_maximo: pago_maximo,
      pago_minimo: pago_minimo,
    },
    validate: {
      pago_minimo: (value, values) =>
        executeValidation(value, [
          isRequiredValidation,
          isNumber,
          (value) => {
            if (value >= values.pago_maximo)
              return "El pago minimo no puede ser mayor o igual al pago maximo";
            return null;
          },
        ]),
      pago_maximo: (value, values) =>
        executeValidation(value, [
          isRequiredValidation,
          isNumber,
          (value) => {
            if (value <= values.pago_minimo)
              return "El pago maximo no puede ser menor o igual al pago minimo";
            return null;
          },
        ]),
    },
  });
  useEffect(() => {
    //Cada que cambia un valor se valida el formulario
    setIsCorrecto(form.isValid());
    //isDirty permite saber si el formulario tiene valores distintos a los iniciales
    if (form.isDirty()) {
      //Si es así, actualiza los datos y vuelve a validar el formulario
      setDatos({ ...datos, ...form.values });
      setIsCorrecto(!form.validate().hasErrors);
    }
  }, [form.values, datos]);
  return (
    <Center>
      <Grid>
        <Grid.Col span="auto">
          {/* Componente de input numerico de mantine */}
          <NumberInput
            label="Pago minimo"
            description="Lo minimo que cobrarías por una cita"
            hideControls
            //Parser permite quitar los simbolos agregados por el formatter mediante regex(expresion regular)
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            //formatter permite agregar simbolos al input, en este caso un signo $
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
            {...form.getInputProps("pago_minimo")}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <NumberInput
            label="Pago maximo"
            description="Lo maximo que cobrarías por una cita"
            hideControls
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
            {...form.getInputProps("pago_maximo")}
          />
        </Grid.Col>
      </Grid>
    </Center>
  );
}

//registro
//chatbot
//chat
//marketplace
//bitacora
//videollamada
