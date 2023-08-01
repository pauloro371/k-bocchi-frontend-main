import {
  Container,
  Paper,
  Text,
  Title,
  Divider,
  Stack,
  createStyles,
  Flex,
  Badge,
} from "@mantine/core";
import { FormatUTCTime } from "../../utils/fechas";
import React, { useEffect, useRef } from "react";
import ImagenAvatar from "../ImagenAvatar";
import LabelNota from "../Bitacora/LabelNota";
import { CONSULTORIO, DOMICILIO } from "../../utils/modalidad";

export default function CitaPreview({
  cita,
  setCitas,
  pacienteId,
  encabezado,
  onClick = (cita, setCitas) => {},
}) {
  const ref = useRef();
  useEffect(() => {
    ref.current.loadFotoPerfil();
  }, [cita]);
  return (
    <Container
      p={0}
      m={0}
      className="ayuda"
      w={{
        xl: "14% !important",
        xml: "19% !important",
        lg: "24% !important",
        md: "30% !important",
        sm: "46% !important",
        xsm: "100% !important",
      }}
      miw={{
        xl: "14% !important",
        xml: "19% !important",
        lg: "24% !important",
        md: "30% !important",
        sm: "46% !important",
        xsm: "100% !important",
      }}
    >
      <Paper
        w="100%"
        shadow="md"
        withBorder
        px="sm"
        py="xs"
        onClick={({ stopPropagation }) => {
          onClick(cita, setCitas);
        }}
      >
        <Stack spacing="sm">
          {encabezado}
          <Container w="100%">
            <Text component={Stack} spacing="xs">
              <ContenidoPreview label="Domicilio" contenido={cita.domicilio} />
              <ContenidoPreview
                label="Modalidad"
                contenido={<Modalidad modalidad={cita.modalidad} />}
              />
            </Text>
          </Container>
          <Divider mb={0} />

          <Flex justify="space-between" align="center">
            <ImagenAvatar image={cita.foto_perfil} ref={ref} />
            <Title m={0} order={4} ta="end" style={{ flex: "1 1 auto" }}>
              {FormatUTCTime(cita.fecha)}
            </Title>
          </Flex>
        </Stack>
      </Paper>
    </Container>
  );
}

function ContenidoPreview({ label, contenido }) {
  return (
    <Text style={{ wordWrap: "break-word", width: "90%" }}>
      <LabelNota label={label} />
      <Text>{contenido}</Text>
    </Text>
  );
}

function Modalidad({ modalidad, ...props }) {
  return (
    <Flex w="100%" gap="md">
      {modalidad == DOMICILIO ? (
        <Badge {...props} c="green-nature">
          Domicilio
        </Badge>
      ) : (
        <></>
      )}
      {modalidad == CONSULTORIO && (
        <Badge {...props} c="blue-calm">
          Consultorio
        </Badge>
      )}
    </Flex>
  );
}
