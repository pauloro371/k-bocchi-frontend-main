import { Container, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import TablaProductos from "../../../Components/Marketplace/TablaProductos";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../../utils/usuarioHooks";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import Vacio from "../../../Components/Vacio";
import axios from "axios";

export default function Catalogo() {
  const { terapeuta } = useSelector(selectUsuario);
  const [activo, setActivo] = useState();
  const [cargando, setCargando] = useState(true);
  const getOnboardLinks = async () => {
    if (!terapeuta) return;
    setCargando(true);
    let { id: id_terapeuta } = terapeuta;
    try {
      let { data: onboardStatus } = await axios.get(
        `/pagos/onboard-status/${id_terapeuta}`
      );
      setActivo(true);
      console.log(onboardStatus);
    } catch (err) {
      if (err) {
        setActivo(false);
        showNegativeFeedbackNotification(
          "Algo ha salido mal validando tu cuenta"
        );
        console.log(err);
      }
    }
    setCargando(false);
  };

  useEffect(() => {
    getOnboardLinks();
  }, []);
  if (cargando) {
    return <LoadingOverlay overlayBlur={2} />;
  }
  return (
    <Container w="100vw" h="100vh" pos="relative">
      {activo ? (
        <Stack h="100%" w="100%">
          <Title order={3}>Mi catalogo</Title>
          <TablaProductos />
        </Stack>
      ) : (
        <Vacio
          children={
            <Stack>
              <Title>¡Hola!</Title>
              <Text>Aún no haz vinculado tu cuenta de PayPal</Text>
              <Text>
                Para poder crear productos necesitas vincular tu cuenta
              </Text>
            </Stack>
          }
        />
      )}
    </Container>
  );
}
