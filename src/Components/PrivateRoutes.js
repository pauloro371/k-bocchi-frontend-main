import { useSelector } from "react-redux";
import { Outlet, Navigate, useLoaderData, useLocation } from "react-router-dom";
import useSesionExpiracion from "../utils/sesionHook";
import { useEffect } from "react";
import { useSessionStorage } from "@mantine/hooks";

const selectUsuario = (state) => state.usuario;
/**
 *
 * @param {authRol} string[]  Es un arreglo que contiene todos los roles que tienen acceso a la ruta
 * @param {redirect} string Es una ruta para redireccionar a los usuarios en caso de no tener un rol permitido
 *
 *
 *
 * @description Este componente funciona como una extension del componente "Route" de react-router. Permite añadir la funcionalidad para proteger
 * rutas
 *
 *
 * @returns {redirect} Retorna una instancia de PrivateRoutes
 */
export const PrivateRoutes = ({ authRol = [], redirect }) => {
  //Mediante el hook/funcion "useSelector" de react redux, podemos obtener los datos del usuario
  const usuario = useSelector(selectUsuario);
  const location = useLocation();

  console.log("USUARIO:", usuario);
  //Si el usuario no esta logeado, es decir que la propiedad "email" es undefined (Esto puede cambiar a otra propiedad de ser necesario)
  //Manda el usuario al inicio de la app
  if (!usuario.email) {
    console.log({ pathname: location.pathname });
    sessionStorage.setItem("urlGiven", location.pathname);
    return <Navigate to="/" />;
  }
  //Si el usuario si esta logeado pero no tiene el rol, se redirecciona al inicio de la app (login) si es que redirect es undefined
  //Si no, lo redirecciona a la ruta indicada en redirect
  if (!authRol.includes(usuario.rol)) {
    sessionStorage.setItem("urlGiven", "/app");
    return <Navigate to={redirect || "/"} />;
  }
  sessionStorage.setItem("urlGiven",location.pathname)
  

  //Una vez el usuario pasa todos los filtros, se renderiza el componente "Outlet".
  //"Outlet" es un componente que permite renderizar la propiedad "element" de "Route"
  return <Outlet />;
};
