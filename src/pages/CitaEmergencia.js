import {
  Button,
  Center,
  Container,
  Drawer,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  MediaQuery,
  Modal,
  Paper,
  Radio,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { BusquedaTerapeutaContext } from "../Components/BusquedaTerapeutaContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { MdPersonSearch } from "react-icons/md";
import TerapeutaResultado from "../Components/TerapeutaResultado";
import { modals } from "@mantine/modals";
import Vacio from "../Components/Vacio";
import { showNegativeFeedbackNotification } from "../utils/notificationTemplate";
import MapaComponent, { abrirMapa } from "../Components/Mapa";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { executeValidation } from "../utils/isFormInvalid";
import { isRequiredValidation } from "../utils/inputValidation";
import { FormatDate, FormatDateTime, FormatUTCDateTime } from "../utils/fechas";
import { serializarSearchParams } from "./Cita/Buscar";
import CitaEmergenciaCrear from "../Components/Citas/CitaEmergenciaCrear";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import CenterHorizontal from "../Components/CenterHorizontal";
// export function CitaEmergencia() {
//   const theme = useMantineTheme();
//   const [value, setValue] = useDebouncedState("", 300);
//   const { setResultados, parametrosBusqueda, setParametrosBusqueda } =
//     useContext(BusquedaTerapeutaContext);
//   let [searchParams, setSearchParams] = useSearchParams();
//   let [buscando, setBuscando] = useState(false);
//   const buscar = async () => {
//     // alert(searchParams);
//     setBuscando(true);
//     try {
//       let response = await axios.get(
//         `/usuarios/fisioterapeutas/buscar?${searchParams}`
//       );
//       setResultados(response.data.resultados);
//     } catch (err) {
//       console.log(err);
//       return;
//     }
//     setBuscando(false);
//   };
//   useEffect(
//     () =>
//       setParametrosBusqueda({
//         ...parametrosBusqueda,
//         nombre: value,
//       }),
//     [value]
//   );
//   return (
//     <>
//       {/* <Flex justify="center" align="center"> */}
//       <TextInput
//         placeholder="Nombre de terapeuta o consultorio ..."
//         w="100%"
//         radius={0}
//         disabled={buscando}
//         onChange={({ target }) => {
//           setValue(target.value);
//         }}
//       />
//       <Button
//         radius={0}
//         color="green-nature"
//         variant="subtle"
//         disabled={buscando}
//         styles={{
//           root: {
//             border: `1px solid ${theme.colors.gray[4]}`,
//             borderLeft: 0,
//           },
//         }}
//         onClick={() => {
//           buscar();
//         }}
//       >
//         {buscando ? (
//           <Loader color="green-nature" size="xs" />
//         ) : (
//           <MdPersonSearch />
//         )}
//       </Button>
//       {/* </Flex> */}
//     </>
//   );
// }
const libraries = ["places"];

export default function CitaEmergencia() {
  const [resultados, setResultados] = useState([]);
  const [ubicacion, setUbicacion] = useState({
    lat: undefined,
    lng: undefined,
  });
  const [rango, setRango] = useState(5);
  const [fecha, setFecha] = useState([]);
  const [showModal, { open: openModal, close: closeModal }] =
    useDisclosure(true);
  const [modalidad, setModalidad] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [domicilio, setDomicilio] = useState();
  const navigate = useNavigate();
  return (
    <Container h="100vh" mx={0} pt="sm" fluid>
      <Modal
        fullScreen
        title={<Title order={3}>Criterios de búsqueda</Title>}
        onClose={closeModal}
        opened={showModal}
        keepMounted={true}
      >
        <Filtros
          closeModal={closeModal}
          setResultados={setResultados}
          ubicacion={ubicacion}
          setUbicacion={setUbicacion}
          rango={rango}
          setRango={setRango}
          fecha={fecha}
          setFecha={setFecha}
          modalidad={modalidad}
          setModalidad={setModalidad}
          cargando={cargando}
          setCargando={setCargando}
          setDomicilio={setDomicilio}
          domicilio={domicilio}
        />
      </Modal>
      <Flex direction="column" h="100%" pos="relative">
        <Title>Citas de emergencia</Title>
        <Flex
          direction="column"
          sx={{ justifyContent: "center", flex: "0 0 auto" }}
        >
          <Text>Agrega filtros para realizar una búsqueda</Text>
          <Center miw="70%">
            {/* <MediaQuery smallerThan="md">
                  <BarraBusquedaTerapeuta />
                </MediaQuery> */}
          </Center>
          <Group>
            <Button mt="md" compact color="green-nature" onClick={openModal}>
              Filtros
            </Button>
          </Group>
        </Flex>
        {/* <MediaQuery largerThan="md" styles={{ display: "none" }}>
              </MediaQuery> */}

        <ScrollArea
          h="100%"
          w="100%"
          style={{ flex: "1 1 auto" }}
          styles={{
            viewport: {
              paddingBottom: 0,
            },
          }}
          pos="relative"
        >
          {resultados.length == 0 ? (
            <Vacio
              children={
                <Text ta="center" display="block">
                  No hay resultados
                </Text>
              }
            />
          ) : (
            <MediaQuery smallerThan="md">
              <Flex
                justify="flex-start"
                align="flex-start"
                direction="row"
                wrap="wrap"
                gap="lg"
              >
                {resultados.map(({ terapeuta, cita_disponible }) => (
                  <TerapeutaResultado
                    usuario={terapeuta}
                    key={terapeuta.id}
                    Button={
                      <Button
                        radius="sm"
                        style={{ flex: 1 }}
                        color="green-nature"
                        // mah="30px"

                        mih="30px"
                        onClick={() => {
                          modals.open({
                            title: <Title>Crear cita emergencia</Title>,
                            children: (
                              <CitaEmergenciaCrear
                                domicilio_elegido={{ ...ubicacion, domicilio }}
                                horario_elegido={cita_disponible}
                                setResultados={setResultados}
                                terapeuta_datos={terapeuta}
                              />
                            ),
                          });
                        }}
                      >
                        Agendar cita
                      </Button>
                    }
                  />
                ))}
              </Flex>
            </MediaQuery>
          )}
        </ScrollArea>
      </Flex>
    </Container>
  );
}
const MODALIDAD_DOMICILIO = "Domicilio";
const MODALIDAD_AMBOS = "Ambos";
const MODALIDAD_CONSULTORIO = "Consultorio";

const useStyles = createStyles((theme) => ({
  textoAgrandar: {
    color: theme.colors["green-nature"][7],
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
}));
function Filtros({
  setResultados,
  ubicacion,
  setUbicacion,
  rango,
  setRango,
  fecha,
  setFecha,
  modalidad,
  setModalidad,
  cargando,
  setCargando,
  closeModal,
  domicilio,
  setDomicilio,
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries,
  });
  const [showMapa, setShowMapa] = useState(false);
  const [showAgrandar, setShowAgrandar] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const { classes, cx } = useStyles();
  async function getUbicacionActual() {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setFetchingAddress(true);
          setUbicacion({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          let [{ formatted_address }] = await getGeocode({
            location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          setDomicilio(formatted_address);
          form.setFieldValue("ubicacion", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          console.log(pos);
        } catch (err) {
          console.log("Algo ha salido mal obteniendo tu ubicación");
        } finally {
          setShowMapa(false);
          setFetchingAddress(false);
        }
      },
      (err) => {
        showNegativeFeedbackNotification(
          "No se pudo obtener la posición actual"
        );
        console.log(err);
      }
    );
  }
  let timestamp = new Date();
  let fechaActual = new Date(timestamp.setMinutes(timestamp.getMinutes() + 10));
  const form = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      rango,
      fecha: fechaActual,
      modalidad,
      ubicacion,
    },
    validate: {
      fecha: (value) => executeValidation(value, [isRequiredValidation]),
      modalidad: (value) => executeValidation(value, [isRequiredValidation]),
      ubicacion: (value) => executeValidation(value, [isRequiredValidation]),
    },
  });

  async function handleBuscar(values) {
    setCargando(true);
    setShowAgrandar(true);
    let searchObject = {};
    if (values.modalidad === MODALIDAD_CONSULTORIO) {
      searchObject.con_consultorio = "true";
    }
    if (values.modalidad === MODALIDAD_DOMICILIO) {
      searchObject.servicio_domicilio = "true";
    }
    searchObject = { ...searchObject, ...ubicacion };
    searchObject.distancia = values.rango;
    values.fecha = new Date(values.fecha.setSeconds(0));
    searchObject.fecha = FormatDateTime(values.fecha);
    try {
      let { data } = await axios.get(
        `/citas/emergencia?${serializarSearchParams(searchObject)}`
      );
      closeModal();
      setResultados(data);
      setFecha(values.fecha);
      setModalidad(values.modalidad);
    } catch (error) {
      console.log(error);
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => {
    form.setFieldValue("rango", rango);
  }, [rango]);
  useEffect(() => {
    console.log({ domicilio });
  }, [domicilio]);
  if (!isLoaded || fetchingAddress)
    return <LoadingOverlay visible overlayBlur={3} />;

  return (
    <form onSubmit={form.onSubmit(handleBuscar)}>
      <Stack>
        <Paper shadow="sm" p="xl" pb="xs" pos="rel">
          <Center>Ubicacion</Center>
          <Stack my="xs">
            <Text fz="xs" ta="center" color="dimmed">
              <Text span>
                Mostrará terapeutas en un area de {rango}
                km.{" "}
              </Text>
              {showAgrandar && (
                <Text
                  span
                  className={classes.textoAgrandar}
                  onClick={() => {
                    setRango(15);
                  }}
                >
                  Aumentar el rango a 15km
                </Text>
              )}
            </Text>
            <Stack>
              <CenterHorizontal>
                <Text>Domicilio: {domicilio || "Sin seleccionar"}</Text>
              </CenterHorizontal>
              <CenterHorizontal>
                <Flex direction="column" gap="sm">
                  <Button color="green-nature" onClick={getUbicacionActual}>
                    Ubicación actual
                  </Button>
                  {!showMapa && (
                    <Button
                      color="green-nature"
                      onClick={() => setShowMapa(true)}
                    >
                      Seleccionar ubicación
                    </Button>
                  )}
                </Flex>
              </CenterHorizontal>
              {showMapa && (
                <MapaComponent
                  setDatosLat={({
                    coords: { lat, lng },
                    direccion: domicilio,
                  }) => {
                    setUbicacion({
                      lat,
                      lng,
                    });
                    setDomicilio(domicilio);
                    form.setFieldValue("ubicacion", {
                      lat,
                      lng,
                    });
                    return true;
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Paper>
        <Paper shadow="sm" p="xl" pb="xs" pos="rel">
          <Center>Fecha</Center>
          <Stack my="xs">
            <Text fz="xs" ta="center" color="dimmed">
              Mostrará los terapeutas con disponibilidad esa fecha
            </Text>
            <Stack>
              <DateTimePicker
                valueFormat="DD MMM YYYY HH:mm"
                minDate={new Date()}
                maw={400}
                miw={400}
                modalProps={{
                  zIndex: 1000,
                }}
                dropdownType="modal"
                mx="auto"
                {...form.getInputProps("fecha")}
              />
            </Stack>
          </Stack>
        </Paper>
        <Paper shadow="sm" p="xl" pb="xs" pos="rel">
          <Center>Modalidad</Center>
          <Stack my="xs">
            <Text fz="xs" ta="center" color="dimmed">
              Mostrará los terapeutas con esa modalidad de trabajo
            </Text>
            <Stack>
              <Radio.Group
                value={modalidad || null}
                my="xs"
                {...form.getInputProps("modalidad")}
              >
                <Flex justify="space-around" w="100%">
                  <Radio
                    value={MODALIDAD_DOMICILIO}
                    label={MODALIDAD_DOMICILIO}
                  />
                  <Radio
                    value={MODALIDAD_CONSULTORIO}
                    label={MODALIDAD_CONSULTORIO}
                  />
                  <Radio value={MODALIDAD_AMBOS} label={MODALIDAD_AMBOS} />
                </Flex>
              </Radio.Group>
            </Stack>
          </Stack>
        </Paper>
        <Flex justify="end">
          <Button
            type="submit"
            variant="siguiente"
            loading={cargando}
            disabled={!form.isValid()}
          >
            Buscar
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
