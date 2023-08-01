import {
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showNegativeFeedbackNotification } from "../../../utils/notificationTemplate";
import axios from "axios";
import { useEffect, useState } from "react";
import Vacio from "../../../Components/Vacio";
import { useMd } from "../../../utils/mediaQueryHooks";
import { colocarFecha } from "../../../utils/fechas";
import BadgeEstadoPaquete from "../../../Components/Marketplace/BadgesPaquete/BadgeEstadoPaquete";
import { ESTADO_SIN_MANDAR } from "../../../utils/paquetesEstados";
import { modals } from "@mantine/modals";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../../utils/usuarioHooks";
import { FISIOTERAPEUTA } from "../../../roles";

export default function EnvioEspecifico() {
  let { id } = useParams();
  const [paquete, setPaquete] = useState();
  const [seguimiento, setSeguimiento] = useState();
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const md = useMd();
  const { rol } = useSelector(selectUsuario);
  async function fetchPaquete() {
    try {
      let { data } = await axios.get(`/paquetes/${id}`);
      setPaquete(data.paquete);
      setSeguimiento(data.public_url);
    } catch (error) {
      setNoEncontrado(true);
      if (!error) return;
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
  }
  async function handleEnviarPaquete() {
    setCargando(true);
    try {
      await axios.post(`/envios/buy-shipment/${id}`);
      modals.open({
        title: <Title>Paquete recibido</Title>,
        children: <PaqueteEnviado />,
        withCloseButton: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
      });
    } catch (error) {
      if (!error) return;
      console.log(error);
      let {
        response: { data },
      } = error;
      showNegativeFeedbackNotification(data);
    }
    setCargando(false);
  }
  useEffect(() => {
    fetchPaquete();
  }, []);
  if (noEncontrado)
    return <Vacio children={<Title>No se encontro el paquete</Title>} />;
  if (!paquete) return <LoadingOverlay overlayBlur={3} visible />;
  return (
    <Container fluid>
      <Title>Paquete</Title>
      <Title order={4} fw="bold" color="dark.3">
        {id}
      </Title>
      <Paper
        key={id}
        w={md ? "70%" : "90"}
        shadow="xs"
        p="md"
        withBorder
        spacing="lg"
        mx="auto"
      >
        <Stack>
          <Info label="Envia" value={paquete.terapeuta.usuario.nombre} />
          <Info label="Recibe" value={paquete.ticket.paciente.usuario.nombre} />
          <Info label="Ciudad" value={paquete.ciudad_destino} />
          <Info label="Código postal" value={paquete.codigo_postal_destino} />
          <Info
            label="Dirección postal"
            value={`${paquete.numero_exterior_destino} ${paquete.direccion_destino}`}
          />
          <Info label="Estado" value={paquete.estado_destino} />
          <Info
            label="Fecha pedido"
            value={colocarFecha(paquete.fecha_creacion)}
          />
          {paquete.fecha_entrega && (
            <Info
              label="Fecha entrega"
              value={colocarFecha(paquete.fecha_entrega)}
            />
          )}
          <Info
            label="Numero exterior"
            value={paquete.numero_exterior_destino}
          />
          <Info label="Telefono" value={paquete.numero_telefono_destino} />
          <Info
            label="Status"
            value={<BadgeEstadoPaquete estado={paquete.estatus} />}
          />
          <Text
            fw="lighter"
            color="blue-calm.4"
            underline
            component={Link}
            to={`/app/marketplace/ticket/${paquete.ticket.id}`}
          >
            Ver detalles del paquete
          </Text>
          {seguimiento && (
            <Flex justify="end" w="100%">
              <Button component="a" href={seguimiento} target="_blank">
                Seguir paquete
              </Button>
            </Flex>
          )}
          {paquete.estatus === ESTADO_SIN_MANDAR &&
            paquete.codigo_rastreo === "" &&
            rol === FISIOTERAPEUTA && (
              <Flex justify="end" w="100%">
                <Button
                  variant="siguiente"
                  onClick={handleEnviarPaquete}
                  loading={cargando}
                >
                  Enviar paquete
                </Button>
              </Flex>
            )}
        </Stack>
      </Paper>
    </Container>
  );
}

function Info({ label, value }) {
  return (
    <Text>
      <Text span fw="bold" color="dark.4">
        {label}:{" "}
      </Text>
      <Text span>{value}</Text>
    </Text>
  );
}

function PaqueteEnviado() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/app/marketplace/envios/terapeuta");
    modals.closeAll();
  }
  return (
    <>
      <Stack fluid>
        <Text>Se ha marcado como recibido tu paquete en la paquetería</Text>
        <Text>
          El status de tu paquete en Kbocchi puede tardar unos minutos en
          actualizarse. ¡Gracias!
        </Text>
        <Flex w="100%" justify="end">
          <Button variant="siguiente" onClick={handleClick}>
            Ok
          </Button>
        </Flex>
      </Stack>
    </>
  );
}
