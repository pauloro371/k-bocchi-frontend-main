import {
  Avatar,
  Indicator,
  Skeleton,
  ThemeIcon,
  UnstyledButton,
  createStyles,
  useMantineTheme,
  FileButton,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { MdPhotoCamera } from "react-icons/md";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import axios from "axios";
import { USUARIO_ACTUALIZAR } from "../Actions/actionsUsuario";
import ImagenAvatar, { ImagenAvatarActual } from "./ImagenAvatar";
import { useForceUpdate } from "@mantine/hooks";
import { showNegativeFeedbackNotification } from "../utils/notificationTemplate";

const useStyles = createStyles((theme) => ({
  avatarObject: {
    border: `0.25em solid ${theme.colors["blue-calm"][0]}`,
  },
  buttonCambiar: {
    position: "absolute",
    left: "70%",
    bottom: "5%",
    ":disabled": {
      cursor: "progress",
    },
  },
  contenedorFoto: {
    position: "relative",
  },
}));

export default function FotoPerfil({ height, width, className }) {
  const theme = useMantineTheme();
  const usuario = useSelector(selectUsuario);
  const dispatch = useDispatch();
  const { classes, cx } = useStyles();
  const [loaded, setLoaded] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const imagenAvatarRef = useRef(null);
  useEffect(() => {
    setGuardando(false);
    console.log("CAMBIE", usuario.foto_perfil);
  }, [usuario]);
  async function handleUpdate(file) {
    if (!file) return;
    let pathFirebase;
    let { id } = usuario;
    try {
      setGuardando(true);
      let ext = file.name.split(".").pop();
      let filename = `${id}.${ext}`;
      let path = ref(storage, filename);
      let {
        ref: { fullPath },
      } = await uploadBytes(path, file);
      pathFirebase = fullPath;
    } catch (error) {
      setGuardando(false);
      console.log(error);
      showNegativeFeedbackNotification(
        "No se ha podido subir tu imagen. Recuerda que solo se pueden subir archivos png, jpeg y jpg menores a 10mb 🙃"
      );
      return;
    }
    try {
      let datosActualizados = await axios.patch("/usuarios/datos", {
        id,
        foto_perfil: pathFirebase,
      });
      dispatch({ type: USUARIO_ACTUALIZAR, payload: datosActualizados.data });
    } catch (err) {
      showNegativeFeedbackNotification(
        "No hemos podido actualizar tu imagen de perfil"
      );
      setGuardando(false);
      console.log(err);
      return;
    }
  }
  return (
    <>
      <div id="foto" className={classes.contenedorFoto}>
        <LoadingOverlay overlayBlur={1} visible={guardando} />
        <ImagenAvatarActual
          height={height}
          width={width}
          onLoaded={() => {
            setLoaded(true);
          }}
          ref={imagenAvatarRef}
          classes={classes}
        />
        <FileButton onChange={handleUpdate} accept="image/png,image/jpeg">
          {(props) => (
            <UnstyledButton
              className={classes.buttonCambiar}
              {...props}
              disabled={guardando || !loaded}
              display={!loaded || guardando ? "none" : "inline-block"}
            >
              <ThemeIcon
                variant="gradient"
                radius="50%"
                size="lg"
                gradient={{
                  from: theme.colors["blue-calm"][0],
                  to: theme.colors["blue-calm"][7],
                }}
              >
                <MdPhotoCamera size="1.5em" />
              </ThemeIcon>
            </UnstyledButton>
          )}
        </FileButton>
      </div>
    </>
  );
}
