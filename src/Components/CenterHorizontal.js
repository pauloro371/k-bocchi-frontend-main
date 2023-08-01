import { Flex } from "@mantine/core";

export default function CenterHorizontal({ ...props }) {
  return (
    <Flex w="100%" justify="center">
      {{ ...props.children }}
    </Flex>
  );
}
