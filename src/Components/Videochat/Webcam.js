import { useEffect, useRef, useState } from "react";
import Videostream from "./Videostream";
import { modals } from "@mantine/modals";
import { Text, Title } from "@mantine/core";

//onLoad se ejecuta una vez se hayan obtenido los recursos (webcam) del usuario
export default function Webcam({ onLoad = (data) => {} }) {
  //En stream guardamos los recursos del usuario
  const [stream, setStream] = useState();

  //Obtenemos los recursos del usuario con esta función
  async function getStream() {
    try {
      //Mediante getUserMedia obtenemos el stream indicando que constraints/recursos requrimos
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      //Guardamos el stream
      setStream(stream);
    } catch (error) {
      //Si algo sale mal notificamos al usuario
      console.log(error);
      modals.open({
        title: <Title>No se ha logrado obtener tu audio y video</Title>,
        children: <Text>Prueba de nuevo</Text>,
      });
    }
  }
  //Este hook se ejecuta en el mount
  useEffect(() => {
    getStream();
  }, []);
  //Este hook se ejecuta en el mount y en el cambio de stream
  useEffect(() => {
    //Si ya se cargo algo en stream, ejecutamos la funcion onLoad con el payload del stream
    if (stream) onLoad(stream);
  }, [stream]);
  return <Videostream srcObject={stream} />;
}
