import { Box, Text } from "@mantine/core";
export default function BotMensaje({ contenido, children }) {
  return (
    <Box my="sm">
      <Box
        display="inline-block"
        py="xs"
        px="sm"
        bg="green-nature.2"
        sx={(theme) => ({
          borderRadius: "6px",
        })}
      >
        {children}
      </Box>
    </Box>
  );
}
