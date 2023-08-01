import { Box, Flex } from "@mantine/core";

export default function UsuarioMensaje({ contenido, children }) {
  return (
    <Flex justify="end">
      <Box
        display="inline-block"
        py="xs"
        px="sm"
        bg="blue-empire.2"
        sx={(theme) => ({
          borderRadius: "6px",
        })}
      >
        {children}
      </Box>
    </Flex>
  );
}
