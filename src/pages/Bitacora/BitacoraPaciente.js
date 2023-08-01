import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useEffect, useState } from "react";
import { Container } from "@mantine/core";
import Bitacora from "../../Components/Bitacora/Bitacora";
import { useParams } from "react-router-dom";
import { FormatDate, formatearFecha } from "../../utils/fechas";
import GrupoNotas from "../../Components/Bitacora/GrupoNotas";
import NotaPreviewTerapeuta from "../../Components/Bitacora/NotaPreviewTerapeuta";
import CrearNotaButton from "../../Components/Bitacora/CrearNotaButton";
import NotaPreviewPaciente from "../../Components/Bitacora/NotaPreviewPaciente";
import ControlesBitacoraPaciente from "../../Components/Bitacora/ControlesBitacoraPaciente";

export default function BitacoraPaciente() {
  const [notas, setNotas] = useState();
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  async function fetchNotas() {
    try {
      let { data: notas } = await axios.get(`/notas/paciente/${id_paciente}`);
      console.log({ notas });
      setNotas(notas);
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
        notas={notas}
        controles={<ControlesBitacoraPaciente/>}
        crearGrupos={(notas) => {
          return notas.map(({notas,header}) => (
            <GrupoNotas
              grupo={notas}
              header={formatearFecha(header)}
              crearNotas={crearNotas}
            />
          ));
        }}
      />
    </Container>
  );

  //Esta función permite crear las notas de preview para la bitacora de terapeuta
  function crearNotas(encabezado, grupo) {
    let notasCreadas = grupo.map((nota) => (
      <NotaPreviewPaciente
        nota={nota}
        setNotas={setNotas}
        pacienteId={id_paciente}
      />
    ));
    return notasCreadas;
  }
}
