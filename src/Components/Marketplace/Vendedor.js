import { Group, Text, createStyles, rem } from "@mantine/core";
import ImagenAvatar from "../ImagenAvatar";
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
export default function Vendedor({imagen_vendedor,nombre_vendedor}) {
  const { classes, theme } = useStyles();
  return (
    <>
      <Text mt="md" className={classes.label} c="dimmed">
        Publicado por:
      </Text>
      <Group>
        <ImagenAvatar image={imagen_vendedor} mx={0} />
        <Text>{nombre_vendedor}</Text>
      </Group>
    </>
  );
}
