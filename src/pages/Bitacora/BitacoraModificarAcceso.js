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
import NotaPreviewModificarAcceso from "../../Components/Bitacora/NotaPreviewModificarAcceso";
import ControlesModificarAcceso from "../../Components/Bitacora/ControlesModificarAcceso";
import { NINGUNO, TODOS, VARIOS } from "../../utils/ModoCompartir";

export default function BitacoraModificarAcceso() {
  const [notas, setNotas] = useState();
  const [grafoCompartir, setGrafoCompartir] = useState();
  const [modoCompartir, setModoCompartir] = useState(VARIOS);
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  const { id: id_terapeuta } = useParams();
  async function fetchNotas() {
    try {
      let { data: notasObtenidas } = await axios.get(
        `/notas/paciente/${id_paciente}/permisos/${id_terapeuta}`
      );
      console.log({ notasObtenidas });
      setNotas(notasObtenidas);
      //   setGrafoCompartir({
      //     id: id_terapeuta,
      //     terapeutas: [
      //       {
      //         id: id_terapeuta,
      //         notas_compartidas: [
      //           {
      //             id: 0,
      //           },
      //         ],
      //       },
      //     ],
      //   });
      // let array = Object.keys(notasObtenidas).map((value) => [
      //   ...notasObtenidas[value],
      // ]);
      // array = fusionarArreglos(...array);
      let array = notasObtenidas.map(({notas})=>notas).filter(({isCompartida})=>isCompartida).map(({id})=>({id}))
      setGrafoCompartir({
        id: id_paciente,
        terapeutas: [
          {
            id: id_terapeuta,
            notas_compartidas: array,
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchNotas();
  }, []);

  useEffect(() => {
    console.log({ grafoCompartir });
  }, [grafoCompartir]);

  return (
    <Container h="100vh" py="lg" fluid>
      <Bitacora
        notas={notas}
        controles={
          <ControlesModificarAcceso
            grafo={grafoCompartir}
            modoCompartir={modoCompartir}
            setModoCompartir={setModoCompartir}
          />
        }
        crearGrupos={(notas) => {
          return notas.map(({header,notas}) => (
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
      <NotaPreviewModificarAcceso
        nota={nota}
        setNotas={setNotas}
        pacienteId={id_paciente}
        terapeutaId={id_terapeuta}
        setGrafoCompartir={setGrafoCompartir}
        grafoCompartir={grafoCompartir}
        setModoCompartir={setModoCompartir}
        modoCompartir={modoCompartir}
      />
    ));
    return notasCreadas;
  }
}

function fusionarArreglos(...arreglos) {
  let fusion = [].concat(...arreglos);
  return fusion;
}
