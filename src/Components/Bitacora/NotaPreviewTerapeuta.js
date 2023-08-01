import { Flex, Title, createStyles } from "@mantine/core";
import { mostrarNotaCompleta } from "./MostrarNotasModals";
import NotaPreview from "./NotaPreview";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { MenuOpciones } from "./MenuOpciones";
import NotaTituloTerapeuta from "./NotaTituloTerapeuta";
const useStyles = createStyles((theme) => ({
  marcadorAutor: {
    backgroundColor: theme.colors["cyan-opaque"],
  },
  marcadorNueva: {
    backgroundColor: theme.colors["green-nature"],
  },
  marcadorRegular: {
    backgroundColor: theme.colors["blue-empire"][4],
  },
  marcador: {
    borderRadius: "50%",
    height: "0.8em",
    width: "0.8em",
  },
}));
function EncabezadoTerapeuta({ nota, setNotas }) {
  const { classes, cx } = useStyles();
  const {
    terapeuta: { id },
  } = useSelector(selectUsuario);
  const { cita } = nota;
  const { terapeuta_datos } = cita;
  const { usuario } = terapeuta_datos;
  const isAutor = id === cita.id_terapeuta;
  return (
    <Flex align="baseline" justify="space-between" pr="sm">
      <Flex align="baseline" gap="0.3em" w="100%">
        <Marcador
          className={isAutor ? classes.marcadorAutor : classes.marcadorRegular}
        />
        <Title
          order={3}
          style={{ wordWrap: "break-word", width: "85%" }}
          lineClamp={3}
        >
          {nota.titulo}
        </Title>
      </Flex>

      {<MenuOpciones nota={nota} setNotas={setNotas} />}
    </Flex>
  );
}

function Marcador({ className }) {
  const { classes, cx } = useStyles();
  return <div className={cx(classes.marcador, className)}></div>;
}
export default function NotaPreviewTerapeuta({ nota, setNotas, pacienteId }) {
  return (
    <NotaPreview
      encabezado={<EncabezadoTerapeuta nota={nota} setNotas={setNotas} />}
      nota={nota}
      setNotas={setNotas}
      pacienteId={pacienteId}
      onClick={(nota, setNotas) => {
        mostrarNotaCompleta(
          nota,
          setNotas,
          <NotaTituloTerapeuta nota={nota} setNotas={setNotas} />
        );
      }}
    />
  );
}
