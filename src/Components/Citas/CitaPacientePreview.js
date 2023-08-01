import { Flex, Title, createStyles } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import PreviewCita from "./CitaPreview";
import { MenuOpciones } from "./MenuOpciones";
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
function EncabezadoCita({ cita, setCitas }) {
  const { classes, cx } = useStyles();
  //   const isAutor = id === cita.id_terapeuta;
  return (
    <Flex align="baseline" justify="space-between" pr="sm">
      <Flex align="baseline" gap="0.3em" w="100%">
        <Marcador className={classes.marcadorRegular} />
        <Title
          order={3}
          style={{ wordWrap: "break-word", width: "85%" }}
          lineClamp={3}
        >
          {cita.nombre}
        </Title>
      </Flex>
    </Flex>
  );
}

function Marcador({ className }) {
  const { classes, cx } = useStyles();
  return <div className={cx(classes.marcador, className)}></div>;
}
export default function PreviewCitaPaciente({ cita, setCitas, pacienteId }) {
  return (
    <PreviewCita
      encabezado={<EncabezadoCita cita={cita} setCitas={setCitas} />}
      cita={cita}
      setCitas={setCitas}
      pacienteId={pacienteId}
      onClick={(nota, setNotas) => {
        // mostrarNotaCompleta(
        //   nota,
        //   setNotas,
        //   <NotaTituloTerapeuta nota={nota} setNotas={setNotas} />
        // );
      }}
    />
  );
}
