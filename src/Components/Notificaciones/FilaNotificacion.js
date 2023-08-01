import {
  ActionIcon,
  Center,
  Flex,
  Group,
  Menu,
  Overlay,
  PasswordInput,
  Spoiler,
  Stack,
  Text,
  Title,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import Imagen from "../Imagen";
import MenuElipse from "../MenuElipse";
import { MdEdit, MdOutlineDelete, MdVideoChat } from "react-icons/md";
import CenterHorizontal from "../CenterHorizontal";
import { modals } from "@mantine/modals";
import { useDisclosure, useShallowEffect } from "@mantine/hooks";
import { useRef, useState } from "react";
import ImagenAvatar from "../ImagenAvatar";
import {
  FormatUTCDateTime,
  FormatUTCTime,
  formatearFecha,
} from "../../utils/fechas";
import { IoEyeOutline } from "react-icons/io";
import {
  HiEye,
  HiEyeSlash,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";

const useStyles = createStyles((theme) => ({
  base: {
    ":hover":{
        cursor:"pointer",
        backgroundColor:"#e0e0e0"
    }
  },
  activo: {
    backgroundColor: "#eaeaea",
  },
}));

export default function FilaNotificacion({
  notificacion,
  onEditar,
  onEliminar,
}) {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const { classes, cx } = useStyles();
  async function handleLeido() {
    setCargando(true);
    try {
      let { data } = await axios.patch("/notificaciones", {
        id: notificacion.id,
        leida: 1,
      });
      onEditar(data);
    } catch (error) {
      if (!error) return;
      console.log(error);
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    } finally {
      setCargando(false);
    }
  }
  async function handleEliminar() {
    setCargando(true);
    try {
      await axios.delete("/notificaciones", {
        data: { id: notificacion.id },
      });
      onEliminar(notificacion.id);
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
      console.log(error);
    } finally {
      setCargando(false);
    }
  }
  return (
    <tr
      onClick={() => {
        // alert(`Navegar a ${notificacion.contexto_web}`);
        if (cargando) return;
        navigate(notificacion.contexto_web);
      }}
      style={{
        position: "relative",
      }}
      className={cx({ [classes.activo]: notificacion.leida == 0 },classes.base)}

    >
      <td
        width="90%"
        // className={cx({ [classes.activo]: notificacion.leida == 0 })}
      >
        {cargando && <Overlay blur={0.5} color="#f5f5f5" />}
        <Stack spacing={5}>
          <div>
            <Text color="dark" fw="bold" mb="xs">
              {notificacion.titulo}|{notificacion.leida}
            </Text>
            <Text>{notificacion.descripcion}</Text>
          </div>
          <div>
            <Text color="gray" fz="sm">{`${formatearFecha(
              notificacion.fecha
            )} ${FormatUTCTime(notificacion.fecha)}`}</Text>
          </div>
        </Stack>
      </td>
      <td
        width="10%"
        // className={cx({ [classes.activo]: notificacion.leida == 0 })}
      >
        <Flex w="100%" justify="center">
          <MenuElipse>
            <Menu.Item color="blue" icon={<MdEdit />} onClick={handleLeido}>
              Marcar como leido
            </Menu.Item>
            <Menu.Item
              color="red"
              icon={<MdOutlineDelete />}
              onClick={handleEliminar}
            >
              Eliminar
            </Menu.Item>
          </MenuElipse>
        </Flex>
      </td>
    </tr>
  );
}
