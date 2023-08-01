import { Rating } from "@mantine/core";
export function Resena({ value, ...props }) {
  return (
    <Rating
      value={value}
      readOnly
      fractions={3}
      count={10}
      color="green-nature"
      {...props}
    />
  );
}
