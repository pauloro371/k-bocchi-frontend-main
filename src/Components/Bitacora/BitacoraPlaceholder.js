import { Container, Flex, Group, Paper, Skeleton, Stack } from "@mantine/core";

export default function BitacoraPlaceholder() {
  const grupos = crearGrupos(2, 6);
  return (
    <Stack w="100%" h="100%" spacing="5em">
      {grupos}
    </Stack>
  );
}

function GrupoNotasPlaceHolder({ cantidad }) {
  let notas = crearNotas(cantidad);

  return (
    <Group w="100%">
      <Skeleton w="50%" h="1em" />
      <Flex w="100%" wrap="wrap" gap="xl" style={{ flex: "1 1 auto" }}>
        {notas}
      </Flex>
    </Group>
  );
}
function crearNotas(cantidad) {
  let notas = [];
  for (let numero = 1; numero <= cantidad; numero++) {
    notas.push(<NotaPlaceholder />);
  }
  return notas;
}

function NotaPlaceholder() {
  return (
    <Paper h="100%" miw="20%" maw="26%" shadow="lg" px="sm" py="xs">
      {/* titulo placeholder */}
      <Stack w="100%" spacing="xs" mb="3em">
        <Skeleton w="80%" h="1em" />
        <Skeleton w="60%" h="1em" />
        <Skeleton w="30%" h="1em" />
      </Stack>
      {/* fecha placeholder */}
      <Stack w="100%" spacing="xs">
        <Skeleton w="80%" h="1em" />
        <Skeleton w="50%" h="1em" />
      </Stack>
    </Paper>
  );
}

function crearGrupos(cantidadGrupos, cantidadNotas) {
  let grupos = [];
  for (let numero = 1; numero <= cantidadGrupos; numero++) {
    grupos.push(<GrupoNotasPlaceHolder cantidad={cantidadNotas} />);
  }
  return grupos;
}
