import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { Box, Button, Container, Divider, Flex, Stack, Text } from "@mantine/core";
import NotaTituloTerapeuta from "./NotaTituloTerapeuta";
import ImagenAvatar from "../ImagenAvatar";
import ContenidoCompleto from "./ContenidoCompleto";
import NotaFechas from "./NotaFechas";
import { modals } from "@mantine/modals";

export default function NotaCompleta({ nota,setNotas,encabezado }) {
    const { cita } = nota;
    const { terapeuta_datos } = cita;
    const { usuario } = terapeuta_datos;

    return (
      <>
        <Stack pos="relative">
          {encabezado}
          <Flex align="center" gap="sm">
            <Box>
              <ImagenAvatar image={usuario.foto_perfil} />
            </Box>
            <Text>
              <Text span fw="bold">
                Autor:{" "}
              </Text>
              {usuario.nombre}
            </Text>
          </Flex>
          <Divider />
          <Container w="100%">
            <Text component={Stack} spacing="xs">
              <ContenidoCompleto
                label="Diagnostico"
                contenido={nota.diagnostico}
              />
              <ContenidoCompleto
                label="Observaciones"
                contenido={nota.observaciones}
              />
              <ContenidoCompleto
                label="Tratamiento"
                contenido={nota.tratamiento}
              />
              <ContenidoCompleto label="Evolución" contenido={nota.evolucion} />
            </Text>
          </Container>
          <Divider />
          <Stack spacing={0}>
            <NotaFechas nota={nota} />
          </Stack>
          <Divider />
          <Flex w="100%" justify="end">
            <Button
              onClick={() => {
                modals.closeAll();
              }}
              variant="cerrar"
            >
              Cerrar
            </Button>
          </Flex>
        </Stack>
      </>
    );
  }