import {
  Avatar,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Menu,
  Paper,
  ScrollArea,
  Text,
  Title,
  TypographyStylesProvider,
  createStyles,
  rem,
} from "@mantine/core";
import { Resena } from "./Resena";
import { FormatUTCDateTime } from "../utils/fechas";
import { Icono } from "./Opciones";
import { mostrarModalEditarcomentario } from "./Comentarios/Modals";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import axios from "axios";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../utils/notificationTemplate";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  },

  body: {
    paddingLeft: rem(54),
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));
export default function Comentario({ comentario, onClick }) {
  const { classes, theme } = useStyles();
  const usuario = useSelector(selectUsuario);
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group>
        <Avatar
          src={comentario.comentario_paciente.usuario.foto_perfil || ""}
          alt={comentario.comentario_paciente.usuario.nombre}
          radius="xl"
        />
        <div style={{ flex: "1" }}>
          <Flex justify="space-between" w="100%">
            <Text fz="sm">{comentario.comentario_paciente.usuario.nombre}</Text>
            {usuario.paciente &&
              usuario.paciente.id === comentario.id_paciente && (
                <Opciones comentario={comentario} onClick={onClick} />
              )}
          </Flex>
          <Text fz="xs" c="dimmed">
            Creado: {FormatUTCDateTime(comentario.fecha_creacion)}
          </Text>
          {comentario.fecha_edicion && (
            <Text fz="xs" c="dimmed">
              Editado: {FormatUTCDateTime(comentario.fecha_edicion)}
            </Text>
          )}
          {comentario.comentario_paciente.resenas.length > 0 ? (
            <Resena
              value={comentario.comentario_paciente.resenas[0].estrellas}
            />
          ) : (
            <></>
          )}
        </div>
      </Group>
      <TypographyStylesProvider className={classes.body}>
        <div
          className={classes.content}
          dangerouslySetInnerHTML={{ __html: comentario.contenido }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
function Opciones({ comentario, onClick }) {
  const usuario = useSelector(selectUsuario);
  const handleClick = (event) => {
    event.stopPropagation();
  };
  const handleEditar = (event) => {
    event.stopPropagation();
    mostrarModalEditarcomentario(comentario, onClick);
  };
  const handleEliminar = async (event) => {
    let { id } = comentario;
    let {
      paciente: { id: id_paciente },
    } = usuario;
    try {
      await axios.delete("/comentarios", {
        data: {
          id,
          id_paciente,
        },
      });
      onClick();
      showPositiveFeedbackNotification("Se ha eliminado tu comentario");
    } catch (error) {
      console.log(error);
      if (error) {
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      }
    }
    event.stopPropagation();
  };
  return (
    <Group position="center" onClick={handleClick}>
      <Menu withArrow>
        <Menu.Target>
          <Icono />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item color="blue" icon={<MdEdit />} onClick={handleEditar}>
            Editar
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<MdOutlineDelete />}
            onClick={handleEliminar}
          >
            Eliminar
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
