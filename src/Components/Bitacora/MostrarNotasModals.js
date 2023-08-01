import { modals } from "@mantine/modals";
import NotaCompleta from "./NotaCompleta";
import NotaEditar from "./NotaEditar";
import NotaCrear from "./NotaCrear";
import { ScrollArea, Title } from "@mantine/core";
import NotaEliminar from "./NotaEliminar";

export function mostrarNotaCompleta(nota, setNotas, encabezado) {
  modals.open({
    children: (
      <NotaCompleta nota={nota} setNotas={setNotas} encabezado={encabezado} />
    ),
    withCloseButton: false,
  });
}

export function mostrarNotaEditar(nota, setNotas) {
  modals.open({
    title: <Title order={3}>Editar nota</Title>,
    children: <NotaEditar nota={nota} setNotas={setNotas} />,
  });
}
export function mostrarNotaEliminar(nota, setNotas) {
  modals.open({
    title: <Title order={3}>Eliminar nota</Title>,
    children: <NotaEliminar nota={nota} setNotas={setNotas} />,
  });
}

export function mostrarNotaCrear(setNotas, pacienteId) {
  modals.open({
    title: <Title order={3}>Crear nota</Title>,
    children: <NotaCrear setNotas={setNotas} pacienteId={pacienteId} />,
    scrollAreaComponent: ScrollArea.Autosize,
  });
}
