import { Text } from "@mantine/core";

export default function LabelNota({ label, ...props }) {
  return (
    <Text span fw="bold" c="gray" {...props}>
      {label}:
    </Text>
  );
}
