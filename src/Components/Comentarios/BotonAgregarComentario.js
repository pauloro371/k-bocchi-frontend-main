import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import { Button, Skeleton } from "@mantine/core";
import { mostrarModalCrearComentario } from "./Modals";
import axios from "axios";

export default function BotonAgregarComentario({
  id_terapeuta,
  setComentarios,
  onClickCrear,
  children,
}) {
  const usuario = useSelector(selectUsuario);
  const [habilitar, setHabilitar] = useState();
  useEffect(() => {
    if (usuario.paciente) fetchPermisos();
  }, []);
  if (!usuario.paciente) return;
  const {
    paciente: { id },
  } = usuario;
  async function fetchPermisos() {
    try {
      let { data: permisos } = await axios.get(
        `/usuarios/pacientes/${id}/permisos/terapeutas/${id_terapeuta}`
      );
      if (permisos.crearComentario === 1) {
        setHabilitar(true);
      } else {
        setHabilitar(false);
      }
      return;
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
      console.log(error);
    }
    setHabilitar(null);
  }
  const handleClick = () => {
    mostrarModalCrearComentario(setComentarios, id_terapeuta, onClickCrear);
  };
  if (habilitar === undefined) return <Skeleton h="1em" w="3em" />;
  if (!habilitar) return <>{children}</>;
  return <Button onClick={handleClick}>Agregar comentario</Button>;
}
