import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  CardSection,
  Flex,
  Group,
  Image,
  Rating,
  Stack,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { FaChair } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ResenaGeneral } from "./ResenaGeneral";
import Imagen from "./Imagen";
import { distanceFormatter, currencyFormatter } from "../utils/formatters";
const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export default function TerapeutaResultado({ usuario, Button }) {
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Render:", usuario);
  }, [usuario]);
  let { terapeuta } = usuario;
  let promedio =
    usuario.terapeuta.resenas.length === 0
      ? null
      : usuario.terapeuta.resenas[0].promedio;
  return (
    <Card
      w="300px"
      shadow="sm"
      padding="lg"
      withBorder
      radius="md"
      p="md"
      className={classes.card}
    >
      <Card.Section>
        <Imagen height="40vh" image={usuario.foto_perfil} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Stack>
          <Text fz="lg" fw={500}>
            {usuario.nombre}
          </Text>
          <ResenaGeneral estrellas={promedio} />
        </Stack>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Stack spacing={7} mt={5}>
          {usuario.dist !== undefined && (
            <Text style={{ flex: "1" }}>
              A{" "}
              <Text fw="bold" span>
                {distanceFormatter.format(usuario.dist)}
              </Text>{" "}
              aprox
            </Text>
          )}
          <BadgeModalidadTrabajo
            size="md"
            terapeuta={usuario.terapeuta}
            
          />
          <RangoPrecio terapeuta={usuario.terapeuta} style={{ flex: "1" }} />
          {Button}
        </Stack>
      </Card.Section>
    </Card>
  );
}

export function RangoPrecio({ terapeuta, ...props }) {
  return (
    <Text color="dark" fw="bold" {...props}>
      {`${currencyFormatter.format(
        terapeuta.pago_minimo
      )} - ${currencyFormatter.format(terapeuta.pago_maximo)}`}
    </Text>
  );
}
export function BadgeModalidadTrabajo({ terapeuta, propsContainer, ...props }) {
  return (
    <Flex w="100%" gap="md" justify="center" {...propsContainer}>
      {terapeuta.servicio_domicilio == 1 ? (
        <Badge {...props} c="green-nature">
          Domicilio
        </Badge>
      ) : (
        <></>
      )}
      {terapeuta.nombre_del_consultorio && (
        <Badge {...props} c="blue-calm">
          Consultorio
        </Badge>
      )}
    </Flex>
  );
}
