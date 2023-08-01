import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { MdChevronRight } from "react-icons/md";
import ImagenAvatar, { ImagenAvatarActual } from "./ImagenAvatar";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
  avatarObject: {
    border: `0.1em solid ${theme.colors["blue-calm"][0]}`,
  },
}));

export function UserButton({ image, name, email, icon, ...others }) {
  const { classes } = useStyles();
  console.log({image});
  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <ImagenAvatarActual  image={image} classes={classes}/>

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <MdChevronRight />}
      </Group>
    </UnstyledButton>
  );
}
