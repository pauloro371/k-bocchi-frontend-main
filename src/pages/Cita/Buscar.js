import {
  Accordion,
  Box,
  ScrollArea,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Loader,
  NumberInput,
  Paper,
  Radio,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
  Rating,
  Tooltip,
  MediaQuery,
  rem,
  Group,
  Drawer,
  createStyles,
} from "@mantine/core";
import axios from "axios";
import { MdPersonSearch } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { BusquedaTerapeutaContext } from "../../Components/BusquedaTerapeutaContext";
import { useForm } from "@mantine/form";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import { abrirMapa } from "../../Components/Mapa";

import TerapeutaResultado from "../../Components/TerapeutaResultado";
import {
  useDebouncedState,
  useDebouncedValue,
  useDisclosure,
} from "@mantine/hooks";

export function serializarSearchParams(object) {
  const filteredEntries = Object.entries(object).filter(
    ([key, value]) => value !== undefined
  );
  let object_filtered = Object.fromEntries(filteredEntries);
  return new URLSearchParams(object_filtered);
}
export function BarraBusquedaTerapeuta() {
  const theme = useMantineTheme();
  const [value, setValue] = useDebouncedState("", 300);
  const { setResultados, parametrosBusqueda, setParametrosBusqueda } =
    useContext(BusquedaTerapeutaContext);
  let [searchParams, setSearchParams] = useSearchParams();
  let [buscando, setBuscando] = useState(false);
  const buscar = async () => {
    // alert(searchParams);
    setBuscando(true);
    try {
      let response = await axios.get(
        `/usuarios/fisioterapeutas/buscar?${searchParams}`
      );
      setResultados(response.data.resultados);
    } catch (err) {
      console.log(err);
      return;
    }
    setBuscando(false);
  };
  useEffect(
    () =>
      setParametrosBusqueda({
        ...parametrosBusqueda,
        nombre: value,
      }),
    [value]
  );
  return (
    <>
      {/* <Flex justify="center" align="center"> */}
      <TextInput
        placeholder="Nombre de terapeuta o consultorio ..."
        w="100%"
        radius={0}
        disabled={buscando}
        onChange={({ target }) => {
          setValue(target.value);
        }}
      />
      <Button
        radius={0}
        color="green-nature"
        variant="subtle"
        disabled={buscando}
        styles={{
          root: {
            border: `1px solid ${theme.colors.gray[4]}`,
            borderLeft: 0,
          },
        }}
        onClick={() => {
          buscar();
        }}
      >
        {buscando ? (
          <Loader color="green-nature" size="xs" />
        ) : (
          <MdPersonSearch />
        )}
      </Button>
      {/* </Flex> */}
    </>
  );
}

export default function Buscar() {
  const [resultados, setResultados] = useState([]);
  let [searchParams, setSearchParams] = useSearchParams();
  let [parametrosBusqueda, setParametrosBusqueda] = useState({});
  let navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    setSearchParams(serializarSearchParams(parametrosBusqueda));
  }, [parametrosBusqueda]);
  return (
    <Container h="100vh" mx={0} pt="sm" fluid>
      <BusquedaTerapeutaContext.Provider
        value={{ setResultados, parametrosBusqueda, setParametrosBusqueda }}
      >
        <Drawer
          opened={opened}
          onClose={close}
          title="Filtros"
          scrollAreaComponent={ScrollArea.Autosize}
          position="left"
        >
          <Filtros />
        </Drawer>
        <Flex direction="column" h="100%">
          <Flex
            direction="column"
            sx={{ justifyContent: "center", flex: "0 0 auto" }}
          >
            <Center miw="70%">
              <MediaQuery smallerThan="md">
                <BarraBusquedaTerapeuta />
              </MediaQuery>
            </Center>
            <Group>
              <Button
                variant="subtle"
                mt="md"
                compact
                color="green-nature"
                onClick={open}
              >
                Filtros
              </Button>
            </Group>
          </Flex>
          {/* <MediaQuery largerThan="md" styles={{ display: "none" }}>
            </MediaQuery> */}

          {resultados.length == 0 ? (
            <Text
              sx={{ justifyContent: "center", flex: "1 1 auto" }}
              display="block"
            >
              No hay resultados
            </Text>
          ) : (
            <MediaQuery
              smallerThan="md"
              sx={{ justifyContent: "center", flex: "1 1 auto" }}
            >
              <ScrollArea
                h="100%"
                w="100%"
                styles={{
                  viewport: {
                    paddingBottom: 0,
                  },
                }}
              >
                <Flex
                  justify="flex-start"
                  align="flex-start"
                  direction="row"
                  wrap="wrap"
                  gap="lg"
                >
                  {resultados.map((r) => (
                    <TerapeutaResultado
                      Button={
                        <Button
                          radius="sm"
                          style={{ flex: 1 }}
                          color="green-nature"
                          mah="30px"
                          mih="30px"
                          onClick={() => {
                            navigate(
                              `/app/cita/terapeuta/${r.terapeuta.id}`
                            );
                          }}
                        >
                          Mas información
                        </Button>
                      }
                      usuario={r}
                      key={r.id}
                    />
                  ))}
                </Flex>
              </ScrollArea>
            </MediaQuery>
          )}
        </Flex>
      </BusquedaTerapeutaContext.Provider>
    </Container>
  );
}

export function FiltrosDropdown() {
  return (
    <Accordion defaultValue="Filtros">
      <Accordion.Item value="Filtros">
        <Accordion.Control>Filtros</Accordion.Control>
        <Accordion.Panel>
          <ScrollArea.Autosize mah="63vh" scrollbarSize={6}>
            <Filtros />
          </ScrollArea.Autosize>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

function Filtros() {
  return (
    <Stack>
      <FiltroServicioDomicilio />
      <FiltroServicioConsultorio />
      <FiltroPrecio />
      <FiltroEstrellas />
      <FiltroUbicacion />
    </Stack>
  );
}

function BorrarFiltro(setParametrosBusqueda, filtros) {
  setParametrosBusqueda((parametrosActuales) => {
    let parametros = { ...parametrosActuales };
    filtros.forEach((f) => {
      delete parametros[f];
    });
    return { ...parametros };
  });
}

function FiltroServicioDomicilio() {
  const { parametrosBusqueda, setParametrosBusqueda } = useContext(
    BusquedaTerapeutaContext
  );
  return (
    <>
      <Paper shadow="sm" p="xl" pb="xs" pos="rel">
        <Center>Servicio a domicilio</Center>
        <Radio.Group
          value={parametrosBusqueda.servicio_domicilio || null}
          my="xs"
          onChange={(servicio_domicilio) =>
            setParametrosBusqueda({
              ...parametrosBusqueda,
              servicio_domicilio,
            })
          }
        >
          <Flex justify="space-around" w="100%">
            <Radio value="true" label="Si" />
            <Radio value="false" label="No" />
          </Flex>
        </Radio.Group>
        <BotonBorrarFiltro filtros={["servicio_domicilio"]} />
      </Paper>
    </>
  );
}

function FiltroServicioConsultorio() {
  const { parametrosBusqueda, setParametrosBusqueda } = useContext(
    BusquedaTerapeutaContext
  );
  return (
    <>
      <Paper shadow="sm" p="xl" pb="xs" pos="rel">
        <Center>Servicio en consultorio</Center>
        <Radio.Group
          value={parametrosBusqueda.con_consultorio || null}
          my="xs"
          onChange={(con_consultorio) =>
            setParametrosBusqueda({
              ...parametrosBusqueda,
              con_consultorio,
            })
          }
        >
          <Flex justify="space-around" w="100%">
            <Radio value="true" label="Si" />
            <Radio value="false" label="No" />
          </Flex>
        </Radio.Group>
        <BotonBorrarFiltro filtros={["con_consultorio"]} />
      </Paper>
    </>
  );
}

function FiltroPrecio() {
  const { parametrosBusqueda, setParametrosBusqueda } = useContext(
    BusquedaTerapeutaContext
  );
  const { pago_maximo, pago_minimo } = parametrosBusqueda;
  const [input1, setInput1] = useState(pago_minimo);
  const [input2, setInput2] = useState(pago_maximo);
  // const [mayor, setMayor] = useState(pago_maximo);
  // const [menor, setMenor] = useState(pago_minimo);
  const [rango, setRango] = useState({
    menor: pago_minimo,
    mayor: pago_maximo,
  });
  function setMinimoMaximo(value1, value2) {
    if (Number(value1) >= Number(value2)) {
      setRango({
        mayor: Number(value1),
        menor: Number(value2),
      });
    } else {
      setRango({
        mayor: Number(value2),
        menor: Number(value1),
      });
    }
  }
  // useEffect(() => {
  //   if (!parametrosBusqueda.pago_maximo && !parametrosBusqueda.pago_minimo) {
  //     setInput1("");
  //     setInput2("");
  //   }
  // }, [parametrosBusqueda]);
  useEffect(() => {
    if (
      (input1 === "" || input1 === undefined) &&
      (input2 === "" || input2 === undefined)
    ) {
      setRango({
        menor: undefined,
        mayor: undefined,
      });
      return;
    }
    if (input1 !== "" && (input2 === undefined || input2 === "")) {
      // setMenor(input1);
      // setMayor(undefined);
      setRango({
        menor: input1,
        mayor: undefined,
      });
      return;
    }
    if (input2 !== "" && (input1 === undefined || input1 === "")) {
      setRango({
        mayor: input2,
        menor: undefined,
      });
      // setMayor(input2);
      // setMenor(undefined);
      return;
    }

    setMinimoMaximo(input2, input1);
  }, [input2, input1]);
  useEffect(() => {
    setParametrosBusqueda((p) => {
      return { ...p, pago_maximo: rango.mayor, pago_minimo: rango.menor };
    });

    // BorrarFiltro(setParametrosBusqueda, ["pago_maximo"]);
  }, [rango]);

  return (
    <>
      <Paper shadow="sm" p="xl" pb="xs" pos="rel">
        <Center>Rango de precio</Center>
        <Grid align="center" justify="center" my="xs">
          <Grid.Col span="auto">
            <NumberInput
              hideControls
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={input1}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                  : "$ "
              }
              onChange={(value) => {
                console.log("i1:", value);
                setInput1(value);
                // setMinimoMaximo(value, input2);
              }}
            />
          </Grid.Col>
          <Grid.Col p={0} span={1}>
            <Text ta="center">-</Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <NumberInput
              hideControls
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              value={input2}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                  : "$ "
              }
              onChange={(value) => {
                console.log("i2:", value);
                setInput2(value);
              }}
            />
          </Grid.Col>
        </Grid>
        <BotonBorrarFiltro filtros={["pago_maximo", "pago_minimo"]} />
      </Paper>
    </>
  );
}

function FiltroEstrellas() {
  const { parametrosBusqueda, setParametrosBusqueda } = useContext(
    BusquedaTerapeutaContext
  );
  return (
    <>
      <Paper shadow="sm" p="xl" pb="xs" pos="rel">
        <Center>Estrellas</Center>
        <Stack my="xs">
          <Text fz="xs" ta="center" color="dimmed">
            Mostrará solo terapeutas con la misma o más cantidad de estrellas
          </Text>
          <Center>
            <Rating
              value={parametrosBusqueda.estrellas || null}
              onChange={(estrellas) => {
                setParametrosBusqueda({ ...parametrosBusqueda, estrellas });
              }}
              count={10}
              color="green-nature"
              size="xs"
            />
          </Center>
        </Stack>
        <BotonBorrarFiltro filtros={["estrellas"]} />
      </Paper>
    </>
  );
}

function FiltroUbicacion() {
  const { parametrosBusqueda, setParametrosBusqueda } = useContext(
    BusquedaTerapeutaContext
  );

  function getUbicacionActual() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setParametrosBusqueda({
          ...parametrosBusqueda,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        console.log(pos);
      },
      (err) => {
        showNegativeFeedbackNotification(
          "No se pudo obtener la posición actual"
        );
        console.log(err);
      }
    );
  }
  return (
    <>
      <Paper shadow="sm" p="xl" pb="xs" pos="rel">
        <Center>Ubicacion</Center>
        <Stack my="xs">
          <Text fz="xs" ta="center" color="dimmed">
            Mostrará terapeutas en un area de{" "}
            {parametrosBusqueda.distancia || 15}km
          </Text>
          <Stack>
            <Button color="green-nature" onClick={getUbicacionActual}>
              Ubicación actual
            </Button>
            <Button
              color="green-nature"
              onClick={() =>
                abrirMapa({
                  setDatosLat: ({ coords, direccion }) => {
                    setParametrosBusqueda({
                      ...parametrosBusqueda,
                      ...coords,
                    });
                  },
                })
              }
            >
              Seleccionar ubicación
            </Button>
            <NumberInput
              hideControls
              disabled={!parametrosBusqueda.lat && !parametrosBusqueda.lng}
              parser={(value) => value.replace(/km\s?|(,*)/g, "")}
              value={parametrosBusqueda.distancia || 15}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? ` ${value} km`.replace(
                      /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                      ","
                    )
                  : "km "
              }
              onChange={(distancia) => {
                if (distancia === "" || distancia === 0) {
                  setParametrosBusqueda({
                    ...parametrosBusqueda,
                    distancia: undefined,
                  });
                  return;
                }
                setParametrosBusqueda({
                  ...parametrosBusqueda,
                  distancia,
                });
                // setMinimoMaximo(value, input2);
              }}
            />
          </Stack>
        </Stack>
        <BotonBorrarFiltro filtros={["distancia", "lat", "lng"]} />
      </Paper>
    </>
  );
}

function BotonBorrarFiltro({ filtros }) {
  const { setParametrosBusqueda } = useContext(BusquedaTerapeutaContext);
  return (
    <Button
      compact
      variant="subtle"
      onClick={() => {
        BorrarFiltro(setParametrosBusqueda, filtros);
      }}
    >
      Limpiar filtros
    </Button>
  );
}
