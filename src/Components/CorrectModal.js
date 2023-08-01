import { Center, Modal, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";

import { FaCheck } from "react-icons/fa";

export default function CorrectModal({ opened, close, ...props }) {
  let theme = useMantineTheme()

  return (
    <Modal
      opened={opened}
      onClose={close}
      
      {...props}
      
      title={
        <Center>
          <FaCheck size="30px" color={theme.colors["green"][5]} />
          <Title mx="sm" order={3}>
            ¡Bien!
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
