import { TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect } from "react";

export default function BusquedaPacientes({ setPacientes = (nombre) => {} }) {
  const [nombre, setNombre] = useDebouncedState("", 300);
  useEffect(() => {
     setPacientes(nombre);
  }, [nombre]);
  return (
    <TextInput
      placeholder="Escribe un nombre..."
      onChange={({ currentTarget: { value } }) => {
        setNombre(value);
      }}
      style={{flex: "0"}}
    />
  );
}
