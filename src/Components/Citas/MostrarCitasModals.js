import { modals } from "@mantine/modals";
import { ScrollArea, Title } from "@mantine/core";
import CitaCompleta from "./CitaCompleta";
import CitaEditar from "./CitaEditar";
import CitaEliminar from "./CitaEliminar";
import CitaCrear from "./CitaCrear";

export function mostrarCitaCompleta(cita, setNotas, encabezado) {
  modals.open({
    children: (
      <CitaCompleta cita={cita} setNotas={setNotas} encabezado={encabezado} />
    ),
    withCloseButton: false,
  });
}

export function mostrarCitaEditar(cita, setCitas) {
  modals.open({
    title: <Title order={3}>Editar cita</Title>,
    children: <CitaEditar cita={cita} setCitas={setCitas} />,
    fullScreen: true,
  });
}
export function mostrarCitaEliminar(cita, setCitas) {
  modals.open({
    title: <Title order={3}>Eliminar cita</Title>,
    children: <CitaEliminar cita={cita} setCitas={setCitas} />,
  });
}

export function mostrarCitaCrear(setCitas) {
  modals.open({
    title: <Title order={3}>Crear cita</Title>,
    children: <CitaCrear setCitas={setCitas} />,
    // scrollAreaComponent: ScrollArea.Autosize,
    fullScreen: true,
  });
}
