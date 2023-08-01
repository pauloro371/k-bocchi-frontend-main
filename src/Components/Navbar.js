import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  rem,
  Button,
  UnstyledButton,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineSell,
  MdDoorbell,
  MdNotifications,
} from "react-icons/md";
import { SlLogout } from "react-icons/sl";
import {
  FaBook,
  FaBookMedical,
  FaComment,
  FaMoneyBillWave,
  FaRobot,
  FaShippingFast,
  FaVideo,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { LinksGroup } from "./NavbarLinksGroup";

import { UserButton } from "./UserButton";
import ButtonLogout from "./ButtonLogout";
import { useSelector } from "react-redux";
import { selectUsuario } from "../utils/usuarioHooks";
import { capitalizeWord } from "../utils/capitalizeWord";
import { FISIOTERAPEUTA, PACIENTE } from "../roles";
import { useNavigate } from "react-router-dom";

const navbarItems = [
  { label: "Buscar terapeuta", icon: MdSearch, to: "/app/cita/buscar" },
  { label: "Notificaciones", icon: MdNotifications, to: "/app/notificaciones" },
  {
    label: "Cita",
    icon: FaRobot,
    initiallyOpened: true,
    links: [
      { label: "Agendar", link: "/app/paciente/chatbot" },
      { label: "Emergencia", link: "/app/paciente/citas" },
    ],
    rol: PACIENTE,
  },
  {
    label: "Marketplace",
    icon: FaMoneyBillWave,
    rol: PACIENTE,
    links: [
      { label: "Comprar", link: "/app/marketplace/resultados" },
      { label: "Mis pedidos", link: "/app/marketplace/envios/paciente" },
      { label: "Mis compras", link: "/app/marketplace/compras" },
    ],
  },
  {
    label: "Marketplace",
    icon: FaMoneyBillWave,
    rol: FISIOTERAPEUTA,
    links: [
      { label: "Buscar", link: "/app/marketplace/resultados" },
      { label: "Mi catalogo", link: "/app/marketplace/terapeuta/catalogo" },
      { label: "Mis envios", link: "/app/marketplace/envios/terapeuta" },
      { label: "Mis ventas", link: "/app/marketplace/terapeuta/reportes" },
      // { label: "Reportes", link: "" },
    ],
  },
  {
    label: "Bitácora",
    icon: FaBookMedical,
    rol: FISIOTERAPEUTA,
    to: "terapeuta/bitacora",
  },
  {
    label: "Bitácora",
    icon: FaBookMedical,
    rol: PACIENTE,
    to: "paciente/bitacora",
  },
  {
    label: "Chat",
    icon: FaComment,
    to: "/app/chat",
  },
  {
    label: "Salas",
    rol: FISIOTERAPEUTA,
    icon: FaVideo,
    to: "/app/terapeuta/salas",
  },
  {
    label: "Videollamada",
    rol: PACIENTE,
    icon: FaVideo,
    to: "/app/paciente/videollamada",
  },
  {
    label: "Agenda",
    rol: FISIOTERAPEUTA,
    icon: FaBook,
    to: "/app/terapeuta/agenda",
  },
  {
    label: "Agenda",
    rol: PACIENTE,
    icon: FaBook,
    to: "/app/paciente/agenda",
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    maxHeight: "100vh",
    minHeight: "100vh",
  },
  hidden: {
    // display:"none",
    width: "0 !important",
    flexBasis: 0,
    padding: "0 !important",
    minWidth: "0 !important",
    overflow: "hidden",
    transition: "width 0.3s, flex-basis 0.3s",
  },
  active: {
    // display:"none",
    width: 280,
    flexBasis: 0,
    padding: "0 !important",
    minWidth: "0 !important",
    overflow: "hidden",
    transition: "width 0.3s, flex-basis 0.3s",
  },
  buttonContainer: {
    position: "relative",
    backgroundColor: theme.colors.gray[3],
  },
  showButton: {
    position: "absolute",
    top: 0,
    left: -16,
    padding: "0",
    transform: "translate(0, 0)",
    zIndex: 100,
  },
  hiddenButton: {
    // right: -12,
  },
  box: {},
  boxTop: {
    backgroundColor: "transparent",
    height: "6px",
    width: "16px",
    borderBottomRightRadius: "0.4em",
  },
  boxBottom: {
    backgroundColor: "transparent",
    borderTopRightRadius: "0.4em",
    height: "6px",
    width: "16px",
  },
  something: {
    borderRadius: "38% 0 0 38%",
    backgroundColor: theme.colors.gray[3],
    height: "16px",
    width: "16px",
  },
  boxCenter: {
    backgroundColor: "transparent",
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  navbarContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: "0px",
    zIndex: 1000,
  },
}));

export default function BarraNavegacion() {
  const { classes, cx } = useStyles();
  let ref = useRef(null);
  const [width, setWidth] = useState(280);
  const [value, toggle] = useToggle();
  const usuario = useSelector(selectUsuario);
  const navigate = useNavigate();
  const links = navbarItems.map((item) =>
    item.rol === usuario.rol || item.rol === undefined ? (
      <LinksGroup {...item} key={item.label} />
    ) : null
  );
  useEffect(() => console.log({ value }), [value]);
  return (
    <div className={classes.navbarContainer}>
      <UnstyledButton
        className={cx(classes.showButton, {
          [classes.hiddenButton]: value === true,
        })}
        onClick={() => {
          console.log(ref.current.display);
          toggle();
        }}
      >
        <div className={classes.buttonContainer}>
          <div className={cx(classes.box, classes.boxTop)}></div>
          <div className={cx(classes.box, classes.boxCenter)}>
            <div className={classes.something}>
              {value ? <MdChevronLeft /> : <MdChevronRight />}
            </div>
          </div>
          <div className={cx(classes.boxBottom)}></div>
        </div>
      </UnstyledButton>
      <Navbar
        ref={ref}
        width={{ sm: 280 }}
        display=""
        p="md"
        className={cx(
          classes.navbar,
          { [classes.active]: value === false },
          { [classes.hidden]: value === true }
        )}
      >
        <Navbar.Section className={classes.header}>
          <Group position="right">
            {/* <Logo width={rem(120)} /> */}
            K-Bocchi
          </Group>
        </Navbar.Section>

        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
          <UserButton
            image={usuario.foto_perfil}
            name={usuario.nombre}
            email={capitalizeWord(usuario.rol)}
            onClick={() => navigate("/app/perfil")}
          />
          <ButtonLogout Child={<LinksGroup icon={SlLogout} label="Salir" />} />
        </Navbar.Section>
      </Navbar>
    </div>
  );
}
