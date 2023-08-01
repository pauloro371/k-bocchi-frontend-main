import {
  Button,
  Container,
  Drawer,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  TextInput,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useMd } from "../../utils/mediaQueryHooks";
import { AiOutlineSearch } from "react-icons/ai";
import { Filtros } from "../../Components/Marketplace/Filtros";
import { useEffect, useState } from "react";
import axios from "axios";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import BarraBusqueda from "../../Components/Marketplace/BarraBusqueda";
import { useDisclosure } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { PACIENTE } from "../../roles";
import CarritoButton from "../../Components/Marketplace/CarritoButton";

export default function MarketplaceLayout() {
  const theme = useMantineTheme();
  const md = useMd();
  const [opened, { open, close }] = useDisclosure(false);
  const { rol } = useSelector(selectUsuario);
  return (
    <Stack h="100vh" w="100vw">
      <Drawer
        opened={opened}
        onClose={close}
        title="Filtros"
        scrollAreaComponent={ScrollArea.Autosize}
        position="left"
        keepMounted
      >
        <Filtros />
      </Drawer>
      <Stack spacing={0}>
        <Flex
          justify="space-between"
          align={md ? "center" : "baseline"}
          py="sm"
          gap={0}
          style={{
            backgroundColor: theme.colors["blue-calmer"][3],
          }}
        >
          {md && (
            <Stack spacing={0} align="center">
              <Title order={5}>Marketplace</Title>
              <Title order={6}>Kbocchi</Title>
            </Stack>
          )}
          <Grid
            style={{
              flex: md ? "0.8" : "1",
              paddingLeft: theme.spacing.md,
              paddingRight: theme.spacing.md,
              flexDirection: md ? "row" : "column",
            }}
          >
            <Grid.Col sm={12} md={10}>
              <div style={{ flex: "1" }}>
                <BarraBusqueda />
              </div>
            </Grid.Col>
            <Grid.Col sm={12} md={2}>
              <Button
                variant="siguiente"
                onClick={() => {
                  open();
                }}
              >
                Filtros
              </Button>
            </Grid.Col>
          </Grid>

          {rol === PACIENTE ? <CarritoButton /> : <div></div>}
        </Flex>
      </Stack>
      <ScrollArea style={{ flex: "1" }} w="100vw">
        <Outlet />
      </ScrollArea>
    </Stack>
  );
}
