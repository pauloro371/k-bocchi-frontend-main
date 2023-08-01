import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import {
  Badge,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ReactComponent as PaypalSvg } from "../../resources/svg/paypalSvg.svg";

const ACTIVO = "Activo";
const INACTIVO = "Inactivo";
export default function OnboardPaypal() {
  const { terapeuta } = useSelector(selectUsuario);
  const [links, setLinks] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [showVincular, setShowVincular] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [status, setStatus] = useState();
  const [merchantId, setMerchantId] = useState();
  const getOnboardLinks = async () => {
    if (!terapeuta) return;
    let { id: id_terapeuta } = terapeuta;
    let errorResponse;
    try {
      let { data: onboardStatus } = await axios.get(
        `/pagos/onboard-status/${id_terapeuta}`
      );
      setStatus(ACTIVO);
      setMerchantId(onboardStatus.merchant_id);
      console.log(onboardStatus);
      return;
    } catch (err) {
      errorResponse = err;
    }
    try {
      if (!errorResponse) return;
      let { response } = errorResponse;
      let { data: onboardLinks } = await axios.get(
        `/pagos/create-onboard-seller/${id_terapeuta}`
      );
      setLinks(onboardLinks.links);
      console.log(onboardLinks.links);
      setStatus(INACTIVO);
      if (response.status === 400) {
        setMerchantId(response.data.merchant_id);
      }
      setShowVincular(true);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(links);
    if (links) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js";

      const handleScriptLoad = () => {
        // Aquí puedes realizar cualquier acción necesaria después de que el script se haya cargado
        console.log("Script de PayPal cargado correctamente");
        setScriptLoaded(true);
      };

      script.onload = handleScriptLoad;

      document.getElementsByTagName("head")[0].appendChild(script);

      return () => {
        document.getElementsByTagName("head")[0].removeChild(script);
      };
    }
  }, [links]);
  useEffect(() => {
    getOnboardLinks();
  }, []);
  if (!terapeuta) return;
  // if (!showStatus) return;
  return (
    <div>
      <Title order={4} mb="sm">
        Método de pago
      </Title>
      <PaypalSvg width="15vh" height="auto" />
      <Stack spacing="md" w="fit-content">
        {merchantId && (
          <Group align="center">
            <Text>merchant_id:</Text>
            <Text>{merchantId}</Text>
          </Group>
        )}
        {status && (
          <Group align="center">
            <Text>Status:</Text>
            {status === ACTIVO ? (
              <Badge color="green-nature.9">Activo</Badge>
            ) : (
              <Badge>Inactivo</Badge>
            )}
          </Group>
        )}
        {scriptLoaded &&
          (!showVincular ? (
            <Skeleton w="10em" h="2em" />
          ) : (
            <div>
              <Button
                component="a"
                variant="siguiente"
                data-paypal-button="true"
                href={`${links[1].href}&displayMode=minibrowser`}
                target="PPFrame"
              >
                Vincular paypal
              </Button>
            </div>
          ))}
      </Stack>
    </div>
  );
}
