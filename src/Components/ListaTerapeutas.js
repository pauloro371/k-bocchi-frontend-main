import { Flex, Text } from "@mantine/core";

export default function ListaTerapeutas({ terapeutas, ...props }) {
  return (
    <>
      {terapeutas.length > 0 ? (
        terapeutas.map((t) => (
          <Flex>
            <Text>{t.nombre}</Text>
          </Flex>
        ))
      ) : (
        <Text>No hay resultados</Text>
      )}
    </>
  );
}
