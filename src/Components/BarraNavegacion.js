import { Link } from "react-router-dom";
import "../css/navbar.css";
import { NavLink, Navbar } from "@mantine/core";

export default function BarraNavegacion({}) {
  return (
    <Navbar className="Navbarbar" width={{ base: 300 }} height="100vh">
      <Link to="perfil">
        <Navbar.Section className="link" to="">
          <NavLink label={<Link to="/registro">Registro</Link>} />
        </Navbar.Section>
      </Link>
      <Link to="perfil">
        <Navbar.Section className="link" to="">
          <NavLink label={<Link to="/registro">Registro</Link>} />
        </Navbar.Section>
      </Link>
      <Link to="perfil">
        <Navbar.Section className="link" to="">
          <NavLink label={<Link to="/registro">Registro</Link>} />
        </Navbar.Section>
      </Link>
    </Navbar>
  );
}
