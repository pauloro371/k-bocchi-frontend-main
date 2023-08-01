import "../../css/BotonCustom.css";
import { ReactComponent as FisioSvg } from "../../resources/svg/fisioSvg.svg";
import { ReactComponent as PacienteSvg } from "../../resources/svg/pacienteSvg.svg";

import {
  Button,
  Stack,
  Title,
  Center,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PACIENTE_REGISTRO = "paciente/credenciales";
const FISIOTERAPEUTA_REGISTRO = "fisioterapeuta/credenciales";

export default function RegistroDesicion() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    console.log(url);
  }, [url]);
  return (
    <Center pos="relative">
      <Stack align="center">
        <Stack
          mah={"10vh"}
          align="center"
          justify="center"
          mih="100vh"
          spacing="xl"
        >
          <Title>¿Qué eres?</Title>
          <UnstyledButton
            value={PACIENTE_REGISTRO}
            px="6em"
            py="1em"
            w={"50vh"}
            onClick={(value) => {
              setUrl(value.currentTarget.value);
            }}
            className={
              url == PACIENTE_REGISTRO
                ? "botonRegistroPaciente botonRegistroActivoPaciente"
                : "botonRegistroPaciente"
            }
          >
            <Stack align="center">
              <PacienteSvg width="20vh" height={"20vh"} />
              <Title order={3}>Paciente</Title>
            </Stack>
          </UnstyledButton>
          <UnstyledButton
            value={FISIOTERAPEUTA_REGISTRO}
            px="6em"
            py="1em"
            w={"50vh"}
            onClick={(value) => {
              setUrl(value.currentTarget.value);
            }}
            className={
              url == FISIOTERAPEUTA_REGISTRO
                ? "botonRegistroFisio botonRegistroActivoFisio"
                : "botonRegistroFisio"
            }
          >
            <Stack align="center">
              <FisioSvg width="20vh" height={"20vh"} />
              <Title order={3}>Fisioterapueta</Title>
            </Stack>
          </UnstyledButton>
        </Stack>
        <Button
          disabled={!url}
          pos="absolute"
          style={{ transform: "translate(-50%, -50%)" }}
          left="50%"
          top="95vh"
          onClick={() => navigate(url)}
          color="green-nature"
        >
          Siguiente
        </Button>
      </Stack>
    </Center>
  );
}
