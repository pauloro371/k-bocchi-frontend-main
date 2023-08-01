import { Text } from "@mantine/core";
import { Resena } from "./Resena";

export function ResenaGeneral({ estrellas, ...props }) {
  return (
    <>
      {estrellas ? (
        <Resena value={estrellas} {...props} />
      ) : (
        <Text>Sin reseñas</Text>
      )}
    </>
  );
}
