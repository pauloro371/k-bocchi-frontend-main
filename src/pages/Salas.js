import { Container, Stack } from "@mantine/core";
import ListaSalas from "../Components/Videochat/ListaSalas";

export default function Salas() {
  return (
    <Container w="100vw" h="100vh" pos="relative">
      <Stack h="100%" w="100%">
        <ListaSalas />
      </Stack>
    </Container>
  );
}
