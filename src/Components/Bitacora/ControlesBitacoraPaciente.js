import { Flex, Stack, Text, Title } from "@mantine/core";
import BotonModificarAcceso from "./BotonModificarAcceso";
import { modals } from "@mantine/modals";

export default function ControlesBitacoraPaciente() {
  
  return (
    <Flex justify="end" w="100%">
      <BotonModificarAcceso/>
    </Flex>
  );
}


