import { Flex, Title, createStyles } from "@mantine/core";
import { mostrarNotaCompleta } from "./MostrarNotasModals";
import NotaPreview from "./NotaPreview";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import NotaTituloTerapeuta from "./NotaTituloTerapeuta";
import NotaTituloPaciente from "./NotaTituloPaciente";
function EncabezadoPaciente({ nota, setNotas }) {
  const {
    paciente: { id },
  } = useSelector(selectUsuario);
  const { cita } = nota;
  const { terapeuta_datos } = cita;
  const { usuario } = terapeuta_datos;
  return (
    <Flex align="baseline" justify="space-between" pr="sm">
      <Flex align="baseline" gap="0.3em" w="100%">
        <Title
          order={3}
          style={{ wordWrap: "break-word", width: "85%" }}
          lineClamp={3}
        >
          {nota.titulo}
        </Title>
      </Flex>
    </Flex>
  );
}


export default function NotaPreviewPaciente({ nota, setNotas, pacienteId }) {
  return (
    <NotaPreview
      encabezado={<EncabezadoPaciente nota={nota} setNotas={setNotas} />}
      nota={nota}
      setNotas={setNotas}
      pacienteId={pacienteId}
      onClick={(nota, setNotas) => {
        mostrarNotaCompleta(
          nota,
          setNotas,
          <NotaTituloPaciente nota={nota} setNotas={setNotas} />
        );
      }}
    />
  );
}
