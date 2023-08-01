import { UnstyledButton, useMantineTheme } from "@mantine/core";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CarritoButton({}) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  return (
    <UnstyledButton
      mr="xl"
      onClick={() => {
        navigate("carrito");
      }}
    >
      <FaShoppingCart
        color={theme.colors["blue-empire"][5]}
        size={theme.fontSizes.lg}
      />
    </UnstyledButton>
  );
}
