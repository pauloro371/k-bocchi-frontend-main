import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import { Button, Skeleton } from "@mantine/core";
import {
  mostrarModalCrearComentario,
  mostrarModalCrearResena,
  mostrarModalEditarResena,
} from "./Modals";
import EditarResena from "./EditarResena";
import CrearResena from "./CrearResena";
import axios from "axios";

const EDITAR = "editar";
const CREAR = "crear";
export default function ControlResena({
  id_terapeuta,
  children,
  onClickEditar = function(){},
  onClickCrear = function(){},
}) {
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  const usuario = useSelector(selectUsuario);
  const [habilitar, setHabilitar] = useState();
  const [resena, setResena] = useState();
  useEffect(() => {
    if (usuario.paciente) fetchPermisos();
  }, []);
  if (!usuario.paciente) return;
  async function fetchPermisos() {
    try {
      let { data: permisos } = await axios.get(
        `/usuarios/pacientes/${id_paciente}/permisos/terapeutas/${id_terapeuta}`
      );
      if (permisos.crearResena === 1) {
        setHabilitar(CREAR);
        return;
      } else if (permisos.editarResena === 1) {
        setResena(permisos.resena);
        setHabilitar(EDITAR);
        return;
      }
      setHabilitar(null);
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
      console.log(error);
    }
  }
  const handleClickEditar = () => {
    mostrarModalEditarResena(
      resena,
      setResena,
      id_terapeuta,
      onClickEditar,
    );
  };
  const handleClickCrear = () => {
    mostrarModalCrearResena(id_terapeuta, setResena, onClickCrear);
  };
  if (habilitar === undefined) return <Skeleton h="1em" w="3em" />;
  if (habilitar === CREAR)
    return (
      <Button onClick={handleClickCrear} variant="seleccionar">
        Añadir reseña
      </Button>
    );
  if (habilitar === EDITAR)
    return (
      <Button onClick={handleClickEditar} variant="seleccionar">
        Editar reseña
      </Button>
    );
  return <>{children}</>;
}
