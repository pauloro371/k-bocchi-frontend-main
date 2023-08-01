import {
  Button,
  Flex,
  LoadingOverlay,
  PasswordInput,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useSm } from "../../utils/mediaQueryHooks";
import { modals } from "@mantine/modals";
import CenterHorizontal from "../CenterHorizontal";
import Vacio from "../Vacio";
import { BsGraphDownArrow } from "react-icons/bs";
import CrearSala from "./CrearSala";
import FilaSala from "./FilaSala";

export default function ListaSalas() {
  const [salas, setSalas] = useState();
  let { terapeuta } = useSelector(selectUsuario);
  const sm = useSm();

  async function fetchSalas() {
    try {
      let { id: id_terapeuta } = terapeuta;
      let { data } = await axios.get(`/salas/${id_terapeuta}`);
      console.log({ data });
      setSalas(data);
    } catch (err) {
      console.log(err);
      if (err) {
        let {
          response: { data },
        } = err;
        showNegativeFeedbackNotification(data);
      }
    }
  }
  useEffect(() => {
    fetchSalas();
  }, []);
  useEffect(() => {
    console.log({ salas });
  }, [salas]);
  function mostrarModalCrearSala() {
    modals.open({
      title: <Title order={3}>Crear sala</Title>,
      children: (
        <CrearSala
          onCrear={(producto) => {
            setSalas((s) => [{ ...producto }, ...s]);
            modals.closeAll();
          }}
        />
      ),
    });
  }
  if (salas === undefined) return <LoadingOverlay visible overlayBlur={2} />;
  return salas.length === 0 ? (
    <Vacio
      children={
        <Stack align="center" fz="xl">
          <Text color="dimmed">No hay salas activas</Text>
          <BsGraphDownArrow color="gray" />
          <Button onClick={mostrarModalCrearSala} variant="siguiente">
            ¡Crea una sala!
          </Button>
        </Stack>
      }
    />
  ) : (
    <>
      <Flex justify="end" pr="sm">
        <Button onClick={mostrarModalCrearSala} variant="siguiente">
          Crear sala
        </Button>
      </Flex>
      <ScrollArea style={{ flex: "1" }}>
        <Table w={sm ? "100%" : "130%"}>
          <thead>
            <tr>
              <th></th>
              <th>
                <CenterHorizontal>
                  <Text>Paciente</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Hora inicio</Text>
                </CenterHorizontal>
              </th>
              <th>
                <CenterHorizontal>
                  <Text>Código</Text>
                </CenterHorizontal>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {salas.map((sala) => (
              <FilaSala
                sala={sala}
                key={sala.id}
                onEditar={(sala) => {
                  setSalas((ss) =>
                    ss.map((s) => (s.id === sala.id ? sala : s))
                  );
                  modals.closeAll();
                }}
                onEliminar={(id_sala) => {
                  setSalas((ss) => ss.filter((s) => s.id !== id_sala));
                  modals.closeAll();
                }}
              />
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
