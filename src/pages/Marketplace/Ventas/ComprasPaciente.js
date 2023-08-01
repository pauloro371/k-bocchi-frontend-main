import { LoadingOverlay,Container, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import ListaCompras from "../../../Components/Marketplace/ListaCompras";
import { selectUsuario } from "../../../utils/usuarioHooks";

export default function ComprasPaciente() {
  const [compras, setCompras] = useState();
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  async function fetchCompras() {
    try {
      let { data } = await axios.get(`/ventas/paciente/${id_paciente}`);
      setCompras(data);
    } catch (error) {
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
  }
  useEffect(() => {
    fetchCompras();
  }, []);
  return (
    <>
      <Title order={3}>Tus compras</Title>
      <Container fluid>
        {compras === undefined ? (
          <LoadingOverlay visible overlayBlur={3} />
        ) : (
          <ListaCompras compras={compras} />
        )}
      </Container>
    </>
  );
}
