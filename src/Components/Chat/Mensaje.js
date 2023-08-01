import { Text, createStyles } from "@mantine/core";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import {
  FormatUTCDate,
  FormatUTCDateTime,
  FormatUTCTime,
  formatearFecha,
} from "../../utils/fechas";
const YOURS = "blue-calm";
const YOURS_SHADE = 2;
const OTHER = "green-nature";
const OTHER_SHADE = 5;
const useStyles = createStyles((theme) => ({
  yours: {
    background: theme.colors[YOURS][YOURS_SHADE],
    borderRadius: "10px 0px 10px 10px",
  },
  other: {
    background: theme.colors[OTHER][OTHER_SHADE],
    borderRadius: "0px 10px 10px 10px",
  },
  base: {
    // border: "1px solid black",
    maxWidth: "40%",
    minWidth: "25%",
    padding: `${theme.spacing.sm} ${theme.spacing.xs} 0 ${theme.spacing.xs}`,
    width: "fit-content",
  },
  container: {
    width: "100%",

    display: "flex",
    position: "relative",
  },
  containerOther: {
    width: "100%",
    justifyContent: "start",
    position: "relative",
    "&:before": {
      position: "absolute",
      content: '" "',
      left: `-${theme.fontSizes.xs}`,
      top: `0`,

      width: 0,
      height: 0,
      borderBottom: `${theme.fontSizes.xs} solid ${theme.colors[OTHER][OTHER_SHADE]}`,
      borderLeft: `${theme.fontSizes.xs} solid transparent`,
      //   borderRight: `${theme.fontSizes.xs} solid transparent`,
      transform: "rotate(-90deg)",
    },
  },
  texto: {
    wordWrap: "break-word",
    width: "100%",
    fontSize: theme.fontSizes.sm,
    color: theme.colors.dark[5],
  },
  fecha: {
    wordWrap: "break-word",
    width: "100%",
    fontSize: `${theme.fontSizes.xs} !important`,
    color: `${theme.colors.gray[7]} !important`,
  },
  containerYours: {
    width: "100%",
    justifyContent: "end",
    position: "relative",

    "&:before": {
      position: "absolute",

      content: '" "',
      right: `-${theme.fontSizes.xs}`,
      top: `0`,
      width: 0,
      height: 0,
      borderBottom: `${theme.fontSizes.xs} solid ${theme.colors[YOURS][YOURS_SHADE]}`,
      //   borderLeft: `${theme.fontSizes.xs} solid transparent`,
      borderRight: `${theme.fontSizes.xs} solid transparent`,
      transform: "rotate(90deg)",
    },
  },
  mensaje: {
    position: "relative",
    margin: `${theme.fontSizes.xs} ${theme.fontSizes.xs} 0 ${theme.fontSizes.xs}`,
  },
}));
export default function Mensaje({ mensaje }) {
  const { classes, cx } = useStyles();
  const { id } = useSelector(selectUsuario);
  const isAutor = mensaje.id_from == id;
  return (
    <div className={cx(classes.mensaje)}>
      <div
        className={cx(
          classes.container,
          { [classes.containerYours]: isAutor },
          { [classes.containerOther]: !isAutor }
        )}
      >
        <div
          className={cx(
            classes.base,
            { [classes.yours]: isAutor },
            { [classes.other]: !isAutor }
          )}
        >
          <Text className={classes.texto}>
            {mensaje.contenido.split("\n").map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
          </Text>
          <Text className={cx(classes.fecha, classes.texto)} ta="end">
            {FormatUTCDateTime(mensaje.fecha)}
          </Text>
        </div>
      </div>
    </div>
  );
}
