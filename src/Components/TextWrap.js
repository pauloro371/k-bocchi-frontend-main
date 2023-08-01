import { Text } from "@mantine/core";

export default function TextWrap({ ...props }) {
  return (
    <Text {...props} style={{ wordWrap: "break-word", width: "90%" }}>
      {props.children}
    </Text>
  );
}
