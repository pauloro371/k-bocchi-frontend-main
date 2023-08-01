import { Container, Flex, Stack, Title } from "@mantine/core";
import Pacientes from "../../Components/Bitacora/Pacientes";

export default function BitacoraGeneral() {
  return (
    <Container h="100vh" w="100vw" px="xs" py={0} fluid>
      <Stack h="100%" w="100%">
        <Title>Bitacora</Title>
        <Pacientes />
      </Stack>
    </Container>
  );
}
