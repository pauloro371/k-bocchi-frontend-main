import { ScrollArea, Skeleton, Table, Text, Title } from "@mantine/core";
import PacienteFila from "./PacienteFila";
import { useXs, useMd, useSm } from "../../utils/mediaQueryHooks";

export default function TablaPacientes({ pacientes }) {
  const mid = useMd();
  const sm = useSm();
  function selectWidth() {
    if (mid && sm) return "100%";
    if (!mid && sm) return "150%";
    if (!mid && !sm) return "200%";
  }
  return (
    <ScrollArea style={{ flex: "1" }}>
      <Table
        w={selectWidth()}
        // h={"100%"}
        striped
        fontSize="md"
        withBorder
        highlightOnHover
        // withColumnBorders
        pos="relative"
      >
        <thead>
          <TablaEncabezado />
        </thead>
        <tbody>
          {pacientes !== undefined ? (
            <TablaCuerpo pacientes={pacientes} />
          ) : (
            <TablaCuerpoPlaceholder />
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

function TablaCuerpo({ pacientes }) {
  const filas = pacientes.map((p) => <PacienteFila paciente={p} key={p.id} />);
  return <>{pacientes.length > 0 ? filas : <Vacio />}</>;
}

function TablaEncabezado() {
  return (
    <tr>
      <th></th>
      <th>Nombre</th>
      <th>Ultima Cita</th>
      <th>Tel</th>
    </tr>
  );
}
const placeHolderAmount = 5;
function TablaCuerpoPlaceholder() {
  const filas = [];
  for (let index = 1; index <= placeHolderAmount; index++) {
    filas.push(<FilaPlaceholder key={index} />);
  }
  return <>{filas}</>;
}

function FilaPlaceholder() {
  return (
    <tr>
      <td height={"50px"} width={"50px"}>
        <Skeleton radius="xl" circle height="50px" m={0} p={0} />
      </td>
      <td height={"50px"}>
        <Skeleton radius="xl" height="80%" />
      </td>
      <td height={"50px"}>
        <Skeleton radius="xl" height="80%" />
      </td>
      <td height={"50px"}>
        <Skeleton radius="xl" height="80%" />
      </td>
    </tr>
  );
}
function Vacio() {
  return (
    <Title ta="center" color="dimmed" pos="absolute" w="100%">
      No tienes pacientes
    </Title>
  );
}
