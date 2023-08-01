import { Box, Divider, Flex, Group, Stack, Title } from "@mantine/core";
import NotaPreview from "./NotaPreview";
import CrearNotaButton from "./CrearNotaButton";
import NotaPreviewTerapeuta from "./NotaPreviewTerapeuta";

export default function GrupoNotas({
  grupo,
  header,
  crearNotas
}) {
  if (grupo.length === 0 && header != "Hoy") return <></>;
  let notas = crearNotas(header,grupo);
  
  return (
    <Stack w="100%">
      <Title order={2} p={0}>
        {header}
      </Title>
      <Divider />
      <Flex w="100%" wrap="wrap" gap="xl" style={{ flex: "1 1 auto" }} direction="row">
        {notas}
      </Flex>
    </Stack>
  );
}

