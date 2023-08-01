import {
  Container,
  Grid,
  LoadingOverlay,
  ScrollArea,
  Title,
} from "@mantine/core";
import ListaPaquetes from "../../../Components/Marketplace/ListaPaquetes";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../../utils/usuarioHooks";
import EstadisticaPaquetes from "../../../Components/Marketplace/EstadisticaPaquetes";

export default function EnviosTerapeuta() {
  const [cargando, setCargando] = useState();
  const [paquetes, setPaquetes] = useState();
  const [estadisticas, setEstadisticas] = useState();
  const {
    terapeuta: { id: id_terapeuta },
  } = useSelector(selectUsuario);
  async function fetchPaquetes() {
    setCargando(true);
    try {
      let { data } = await axios.get(`/paquetes/terapeuta/${id_terapeuta}`);
      console.log(data);
      setPaquetes(data.paquetes);
      let { entregados, sinEntregar, total } = data;
      setEstadisticas({ entregados, sinEntregar, total });
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
      setPaquetes([]);
    }
    setCargando(false);
  }
  useEffect(() => {
    fetchPaquetes();
  }, []);
  if (!paquetes) return <LoadingOverlay visible overlayBlur={2} />;
  return (
    <>
      <Title mb="md">Tus envios</Title>
      <Container fluid>
        <Grid>
          <Grid.Col sm={12} md={6} orderMd={1} order={2} pos="relative">
            <ListaPaquetes paquetes={paquetes} />
          </Grid.Col>
          <Grid.Col sm={12} md={6} orderMd={2} order={1}>
            <ScrollArea>
              <EstadisticaPaquetes
                entregados={estadisticas.entregados}
                sinEntregar={estadisticas.sinEntregar}
                total={estadisticas.total}
              />
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
