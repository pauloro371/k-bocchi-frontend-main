import { Text } from "@mantine/core";
export default function Info({ label, value }) {
  return (
    <Text>
      <Text span fw="bold" color="dark.4">
        {label}:{" "}
      </Text>
      <Text span>{value}</Text>
    </Text>
  );
}
