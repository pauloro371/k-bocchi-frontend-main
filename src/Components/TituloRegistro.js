import { Center, Text, Title } from "@mantine/core";

export function TituloRegistro({ Icono, titulo, descripcion }) {
  return (
    <>
      <Center>
        <Icono/>
      </Center>
      <Title align="center" order={3}>
        {titulo}
      </Title>

      <Text order={5} mt="lg" size="lg" color="dimmed" align="center">
        {descripcion}
      </Text>
    </>
  );
}
