import { Checkbox, Flex, Title, createStyles } from "@mantine/core";
import { mostrarNotaCompleta } from "./MostrarNotasModals";
import NotaPreview from "./NotaPreview";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import NotaTituloTerapeuta from "./NotaTituloTerapeuta";
import NotaTituloPaciente from "./NotaTituloPaciente";
import { useEffect, useState } from "react";
import { NINGUNO, TODOS } from "../../utils/ModoCompartir";
function EncabezadoPacienteModificar({
  nota,
  setNotas,
  terapeutaId,
  setGrafoCompartir,
  grafoCompartir,
  setModoCompartir,
  modoCompartir,
}) {
  const {
    paciente: { id },
  } = useSelector(selectUsuario);
  const { cita } = nota;
  const { terapeuta_datos } = cita;
  const { usuario } = terapeuta_datos;
  const isAutor = cita.id_terapeuta == terapeutaId;
  const [checked, setChecked] = useState(
    nota.isCompartida === 1 ? true : false
  );
  function handleClick(event) {
    event.stopPropagation();
  }
  useEffect(() => {
    console.log(checked);
    if (grafoCompartir) {
      setGrafoCompartir((grafo) => {
        console.log("object");
        let {
          terapeutas: [{ notas_compartidas }],
        } = grafo;
        let notas = [...notas_compartidas];
        if (checked === true) {
          //compartir stuff
          notas.push({ id: nota.id });
          console.log({ notas });
        } else {
          notas = notas.filter(({ id }) => id != nota.id);
          console.log({ notas });
          //no compartir stuff
        }

        return {
          ...grafo,
          terapeutas: [
            {
              id: grafo.terapeutas[0].id,
              notas_compartidas: notas,
            },
          ],
        };
      });
    }
  }, [checked]);
  useEffect(() => {
    if (modoCompartir === TODOS) setChecked(true);
    if (modoCompartir === NINGUNO) setChecked(false);
  }, [modoCompartir]);
  return (
    <Flex align="baseline" justify="space-between" pr="sm">
      <Flex align="baseline" gap="0.3em" w="100%">
        <Title
          order={3}
          style={{ wordWrap: "break-word", width: "85%" }}
          lineClamp={3}
        >
          {nota.titulo}
        </Title>
      </Flex>
      {isAutor === true ? (
        <></>
      ) : (
        <Checkbox
          checked={checked}
          onClick={handleClick}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
      )}
    </Flex>
  );
}

export default function NotaPreviewModificarAcceso({
  nota,
  setNotas,
  pacienteId,
  terapeutaId,
  setGrafoCompartir,
  grafoCompartir,
  setModoCompartir,
  modoCompartir,
}) {
  return (
    <NotaPreview
      encabezado={
        <EncabezadoPacienteModificar
          nota={nota}
          setNotas={setNotas}
          terapeutaId={terapeutaId}
          setGrafoCompartir={setGrafoCompartir}
          grafoCompartir={grafoCompartir}
          setModoCompartir={setModoCompartir}
          modoCompartir={modoCompartir}
        />
      }
      nota={nota}
      setNotas={setNotas}
      pacienteId={pacienteId}
      onClick={(nota, setNotas) => {
        mostrarNotaCompleta(
          nota,
          setNotas,
          <NotaTituloPaciente nota={nota} setNotas={setNotas} />
        );
      }}
    />
  );
}
