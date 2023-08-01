import { Center, Modal, Title, useMantineTheme } from "@mantine/core";

import { BiError } from "react-icons/bi";

export default function ErrorModal({ opened, close, ...props }) {
  let theme = useMantineTheme()
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Center>
          <BiError size="40px" color={theme.colors["red"][6]} />
          <Title mx="sm" order={3}>
            ¡Atención!
          </Title>
        </Center>
      }
      centered
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <Center mih="15vh">{props.children}</Center>
    </Modal>
  );
}
