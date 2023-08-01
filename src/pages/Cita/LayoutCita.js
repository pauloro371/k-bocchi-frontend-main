import { Box, Center, Flex, Stack } from "@mantine/core";
import { useState } from "react";
import { BarraBusquedaTerapeuta } from "./Buscar";
import { Outlet } from "react-router-dom";

export default function LayoutCita() {
  const [resultados, setResultados] = useState([]);
  return (
    <>
      <Outlet />
    </>
  );
}
