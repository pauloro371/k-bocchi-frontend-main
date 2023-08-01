import { Card, Center } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function RegistroPaciente() {
  //React moderno se basa en hooks
  /**
   * Los hooks son funciones que permiten añadir comportamientos o funcionalidades a los componentes de react
   */
  //Aqui usamos el hook de useSelector de React Redux
  //Este hook nos permite obtener datos del estado de React Redux mediante una funcion de seleccion
  //En este caso definimos una función que permite obtener el objeto "usuario" del estado
  const usuario = useSelector((state) => state.usuario);
  console.log(usuario);
  //Ahora usamos el hook useState
  /**
   * Este state permite crear variables en los componentes de react
   * El useState nos regresa dos variables, datos y setDatos. datos es la variable que contiene el estado
   * y setDatos permite cambiar el valor de datos (es un setter)
   * useState también recibe un parametro, el cual es el valor inicial de la variable
   */
  const [datos, setDatos] = useState({
    email: usuario.email,
    contrasena: "",
    nombre: "",
    apellidos: "",
    edad: 0,
    telefono: "",
  });

  return (
    <>
      {/* Estos son componentes de mantine */}
      <Center mx="center" mih="100vh">
        <Card
          shadow="xl"
          padding="lg"
          radius="md"
          maw="30%"
          miw="320px"
          mx="auto"
          style={{ borderRadius: 0 }}
        >
          {/**
           * Outlet es un componente de react-router que es la librería que nos permite crear el routeo de la app
           * Outlet permite renderizar los componentes que se definen en la propiedad "element" de Route en el componente App
           * Ahora, context es una propiedad que permite pasarle propiedades al componente renderizado en element
           */}
          <Outlet context={{ setDatos: setDatos, datos: datos }} />
        </Card>
      </Center>
    </>
  );
}

export default RegistroPaciente;
