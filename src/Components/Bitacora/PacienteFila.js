import { createStyles } from "@mantine/core";
import { formatearFecha } from "../../utils/fechas";
import ImagenAvatar from "../ImagenAvatar";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  filaConCitaHoy: {
    backgroundColor: theme.colors["blue-calmer"][1],
  },
  filaRegular: {
    // paddingTop: `${theme.spacing.xl} !important`,
    // paddingBottom: `${theme.spacing.xl} !important`,

    height: "5em",
  },
  avatarObject: {
    width: "60px",
    height: "60px",
  },
}));
export default function PacienteFila({ paciente }) {
  const navigate = useNavigate();
  const {
    ultima_cita: [cita],
    has_cita_hoy,
  } = paciente;
  const { classes, cx } = useStyles();
  return (
    <tr
      onClick={() => {
        // alert(JSON.stringify(paciente));
        console.log({paciente});
        navigate(`${paciente.id}`);
      }}
    >
      <td
        className={cx(classes.filaRegular, classes.avatarObject, {
          [classes.filaConCitaHoy]: has_cita_hoy,
        })}
      >
        <ImagenAvatar image={paciente.foto_perfil} classes={classes} />
      </td>
      <td
        className={cx(classes.filaRegular, {
          [classes.filaConCitaHoy]: has_cita_hoy,
        })}
      >
        {paciente.nombre}
      </td>
      <td
        className={cx(classes.filaRegular, {
          [classes.filaConCitaHoy]: has_cita_hoy,
        })}
      >
        {fecha(cita.fecha, has_cita_hoy)}
      </td>
      <td
        className={cx(classes.filaRegular, {
          [classes.filaConCitaHoy]: has_cita_hoy,
        })}
      >
        {paciente.telefono}
      </td>
    </tr>
  );
}

function fecha(fecha, fecha_hoy) {
  let texto = formatearFecha(fecha);
  if (fecha_hoy && texto !== "Hoy") {
    texto = `${texto} (Tiene cita hoy)`;
  }
  return texto;
}
