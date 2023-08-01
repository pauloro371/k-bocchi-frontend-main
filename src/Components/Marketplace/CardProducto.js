import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  createStyles,
  rem,
  Flex,
  Stack,
} from "@mantine/core";
import Imagen from "../Imagen";
import BadgeNuevo from "./BadgeNuevo";
import ImagenAvatar from "../ImagenAvatar";
import DisponibilidadProducto from "./DisponibilidadProducto";
import CategoriaProducto from "./CategoriaProducto";
import { currencyFormatter } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import Vendedor from "./Vendedor";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 5,
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

export default function CardProducto({
  id,
  imagen,
  nombre,
  caracteristicas,
  precio,
  stock,
  isNuevo,
  stock_carrito,
  imagen_vendedor,
  nombre_vendedor,
  categoria,
}) {
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  // const features = badges.map((badge) => (
  //   <Badge
  //     color={theme.colorScheme === "dark" ? "dark" : "gray"}
  //     key={badge.label}
  //     leftSection={badge.emoji}
  //   >
  //     {badge.label}
  //   </Badge>
  // ));

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      className={classes.card}
      w={{
        xl: "14% !important",
        xml: "19% !important",
        lg: "24% !important",
        md: "30% !important",
        sm: "46% !important",
        xsm: "80% !important",
      }}
      miw={{
        xl: "14% !important",
        xml: "19% !important",
        lg: "24% !important",
        md: "30% !important",
        sm: "46% !important",
        xsm: "80% !important",
      }}
    >
      <Card.Section>
        <Imagen image={imagen} height={180} fit="contain" />
        <div className={classes.badge}>
          <BadgeNuevo isNuevo={isNuevo} />
        </div>
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text
            fz="lg"
            fw={500}
            style={{ wordWrap: "break-word", width: "90%" }}
          >
            {nombre}
          </Text>
          {/* <Badge size="sm">{country}</Badge> */}
        </Group>
        <CategoriaProducto categoria={categoria} />
        <Text fz="sm" mt="xs" lineClamp={2}>
          {caracteristicas}
        </Text>
      </Card.Section>
      <Card.Section className={classes.section}>
        <Vendedor
          imagen_vendedor={imagen_vendedor}
          nombre_vendedor={nombre_vendedor}
        />
      </Card.Section>
      <Card.Section className={classes.section}>
        <Flex align="center" gap="md">
          <div>
            <Text className={classes.label} c="dimmed">
              Disponible:
            </Text>
            <DisponibilidadProducto stock={stock_carrito} />
          </div>
          <div>
            <Text className={classes.label} c="dimmed">
              Precio:
            </Text>
            <Text>{currencyFormatter.format(precio)}</Text>
          </div>
        </Flex>
      </Card.Section>
      <Group mt="xs">
        <Button
          radius="md"
          style={{ flex: 1 }}
          variant="siguiente"
          onClick={() => {
            navigate(`../detalles/${id}`);
          }}
        >
          Más detalles
        </Button>
      </Group>
    </Card>
  );
}
