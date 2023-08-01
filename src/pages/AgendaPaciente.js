import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import { useEffect, useState } from "react";
import { Button, Container, Flex } from "@mantine/core";
import Bitacora from "../Components/Bitacora/Bitacora";
import { useNavigate, useParams } from "react-router-dom";
import { FormatDate, formatearFecha } from "../utils/fechas";
import GrupoNotas from "../Components/Bitacora/GrupoNotas";
import PreviewCitaTerapeuta from "../Components/Citas/CitaTerapeutaPreview";
import { mostrarCitaCrear } from "../Components/Citas/MostrarCitasModals";
import CitaPreview from "../Components/Citas/CitaPreview";
import PreviewCitaPaciente from "../Components/Citas/CitaPacientePreview";

export default function AgendaPaciente() {
  const [citas, setCitas] = useState();
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();
  const usuario = useSelector(selectUsuario);
  async function fetchNotas() {
    let {
      paciente: { id },
    } = usuario;
    try {
      let { data } = await axios.get(`/citas/agendaPaciente/${id}`);
      console.log({ mydata: data });
      setCitas(data.citas);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchNotas();
  }, []);
  return (
    <Container h="100vh" py="lg" fluid>
      <Bitacora
        notas={citas}
        crearGrupos={(n) => {
          return n.map(({ citas, header }) => (
            <GrupoNotas
              grupo={citas}
              header={formatearFecha(header)}
              crearNotas={crearNotas}
            />
          ));
        }}
        controles={
          <Flex justify="end">
            <Button variant="siguiente" onClick={()=>{navigate("/app/paciente/chatbot")}}>Crear cita</Button>
          </Flex>
        }
      />
    </Container>
  );

  //Esta función permite crear las notas de preview para la bitacora de terapeuta
  function crearNotas(encabezado, grupo) {
    let citasCreadas = grupo.map((cita) => (
      <PreviewCitaPaciente
        cita={cita}
        setCitas={setCitas}
        pacienteId={pacienteId}
      />
    ));
    return citasCreadas;
  }
}
