import { Textarea, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
export default function ComentarioInput({ form, max, inputName }) {
  return (
    <>
      <Stack spacing="sm">
        <Textarea {...form.getInputProps(inputName)} maxLength={max}/>
        <Text>
          {form.values[inputName].length}/{max}
        </Text>
      </Stack>
    </>
  );
}
