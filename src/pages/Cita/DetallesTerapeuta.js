import {
  Box,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Rating,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BadgeModalidadTrabajo,
  RangoPrecio,
} from "../../Components/TerapeutaResultado";
import ListaComentarios from "../../Components/ListaComentarios";
import { ResenaGeneral } from "../../Components/ResenaGeneral";
import BotonAgregarComentario from "../../Components/Comentarios/BotonAgregarComentario";
import ControlResena from "../../Components/Comentarios/ControlResena";
import { set } from "react-hook-form";
import { modals } from "@mantine/modals";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import Imagen from "../../Components/Imagen";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  section_descriptions: {
    paddingTop: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));
export default function DetallesTerapeuta() {
  const { id } = useParams();
  const [cargando, setCargando] = useState(true);
  const [encontrado, setEncontrado] = useState(false);
  const [terapeuta, setTerapeuta] = useState(null);
  const [comentarios, setComentarios] = useState(null);
  const [reload, setReload] = useState(true);
  const navigate = useNavigate();
  const { classes, theme } = useStyles();
  const usuario = useSelector(selectUsuario);
  const cargarDatos = async () => {
    setCargando(true);
    setTerapeuta(undefined);
    try {
      let { data } = await axios.get(`/usuarios/fisioterapeutas/${id}`);
      setTerapeuta(data);
      setComentarios(data.comentarios);
      setEncontrado(true);
    } catch (err) {
      if (!err) {
        return;
      }
      setEncontrado(false);
    }
    setCargando(false);
  };
  useEffect(() => {
    cargarDatos();
  }, [reload]);
  //
  if (!terapeuta && cargando) {
    return <LoadingOverlay visible={cargando} />;
  }
  if (!terapeuta && !cargando) {
    return <Title order={2}>No encontrado</Title>;
  }
  let promedio =
    terapeuta.resenas.length === 0 ? null : terapeuta.resenas[0].promedio;
  return (
    <>
      <Grid m={0} gutter="xl" w="100%" h="100vh">
        <Grid.Col md={4} h="100%">
          <ScrollArea h="100%">
            <Card>
              <Card.Section>
                <Imagen image={terapeuta.usuario.foto_perfil} height="40vh"/>
              </Card.Section>
              <Card.Section className={classes.section}>
                <Group p="xl" pt="md">
                  <Title ta="center" w="100%">
                    {terapeuta.usuario.nombre}
                  </Title>
                  <Flex w="100%" justify="center">
                    <ResenaGeneral estrellas={promedio} />
                  </Flex>
                  <Flex w="100%" justify="center">
                    <Text c="dimmed">Cédula: {terapeuta.numero_cedula}</Text>
                  </Flex>
                </Group>
              </Card.Section>
              <Card.Section
                className={`${classes.section} ${classes.section_descriptions}`}
              >
                <Title order={5} ta="center">
                  Consultorio
                </Title>
                <Flex w="100%" justify="center">
                  <InformacionConsultorio terapeuta={terapeuta} />
                </Flex>
              </Card.Section>
              <Card.Section
                className={`${classes.section} ${classes.section_descriptions}`}
              >
                <Title order={5} ta="center">
                  Área de trabajo
                </Title>
                <Flex w="100%" justify="center">
                  <Text>{terapeuta.domicilio}</Text>
                </Flex>
              </Card.Section>
              <Card.Section
                className={`${classes.section} ${classes.section_descriptions}`}
              >
                <Title order={5} ta="center">
                  Rango de precio
                </Title>
                <Center>
                  <RangoPrecio fz="md" terapeuta={terapeuta} ta="center" />
                </Center>
              </Card.Section>
              <Card.Section
                className={`${classes.section} ${classes.section_descriptions}`}
              >
                <Flex direction="column" align="center" gap="sm">
                  <Title order={5}>Modalidad de trabajo</Title>
                  <BadgeModalidadTrabajo size="lg" terapeuta={terapeuta} />
                </Flex>
              </Card.Section>
            </Card>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col md="auto" h="100%">
          <Stack h="100%">
            <Flex align="center">
              <Title order={3}>Comentarios</Title>
            </Flex>
            <Flex gap="md">
              {usuario.paciente && (
                <>
                  <ControlResena
                    id_terapeuta={id}
                    onClickCrear={function () {
                      setReload((rel) => !rel);
                      modals.closeAll();
                    }}
                    onClickEditar={function () {
                      setReload((rel) => !rel);
                      modals.closeAll();
                    }}
                  />
                  <BotonAgregarComentario
                    id_terapeuta={id}
                    setComentarios={setComentarios}
                    onClickCrear={function () {
                      setReload((rel) => !rel);
                      modals.closeAll();
                    }}
                  />
                </>
              )}
            </Flex>
            <ScrollArea h="100%">
              <ListaComentarios comentarios={comentarios} onClick={()=>{
                setReload((rel)=>!rel);
                modals.closeAll()
              }}/>
            </ScrollArea>
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  );
}

function InformacionConsultorio({ terapeuta }) {
  return (
    <Text>
      {terapeuta.nombre_del_consultorio !== ""
        ? terapeuta.nombre_del_consultorio
        : "Sin consultorio especificado"}
    </Text>
  );
}
