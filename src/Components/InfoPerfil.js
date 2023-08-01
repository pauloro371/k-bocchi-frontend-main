import { createStyles, ThemeIcon, Text, Box, SimpleGrid } from "@mantine/core";
import TextWrap from "./TextWrap";

const useStyles = createStyles((theme, { variant }) => ({
  wrapper: {
    gridTemplateColumns:
      "40px minmax(0, 1fr)" /* Primera columna de 40px y las demás ocupan el espacio restante */,
  },

  icon: {
    marginRight: theme.spacing.md,
    backgroundImage:
      variant === "gradient"
        ? `linear-gradient(135deg, ${theme.colors["blue-calm"][2]} 0%, ${theme.colors["blue-calm"][6]} 100%)`
        : "none",
    backgroundColor: "transparent",
  },

  title: {
    color:
      variant === "gradient"
        ? theme.colors.gray[6]
        : theme.colors[theme.primaryColor][0],
  },

  description: {
    color: variant === "gradient" ? theme.black : theme.white,
  },
}));

export default function ContactIcon({
  icon: Icon,
  title,
  description,
  variant = "gradient",
  className,
  child,
  ...others
}) {
  const { classes, cx } = useStyles({ variant });
  return (
    <SimpleGrid
      cols={2}
      className={classes.wrapper}
      spacing="sm"
      verticalSpacing={5}
    >
      <Box>
        {variant === "gradient" ? (
          <ThemeIcon size={40} radius="md" className={classes.icon}>
            <Icon size="1.5rem" />
          </ThemeIcon>
        ) : (
          <Box mr="md">
            <Icon size="1.5rem" />
          </Box>
        )}
      </Box>

      <div>
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        <TextWrap className={classes.description}>
          {description}
        </TextWrap>
      </div>
      <div></div>
      <div style={{ display: "block" }}>{child}</div>
    </SimpleGrid>
  );
}
