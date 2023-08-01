import { useEffect, useRef } from "react";
//srcObject es un stream de video/audio
export default function Videostream({ srcObject, ...props }) {
  const ref = useRef(null);
  //Hook para asignar el stream al elemento <video/>
  useEffect(() => {
    //Asignamos una referencia para el stream de manera local
    let streamRef = srcObject;
    //Si no existe una referencia actual retornamos
    if (!ref.current) return;
    //Si existe entonces asignamos el stream
    ref.current.srcObject = srcObject;
    ref.current
      .play()
      .then((c) => {
        console.log({ c });
      })
      .catch((c) => {
        console.log({c});
      });
    //Cleanup function para unmount
    return () => {
      //Si existe una referencia en streamRef entonces liberamos los recursos del stream
      if (streamRef) streamRef.getTracks().forEach((track) => track.stop());
    };
  }, [srcObject]);

  return <video {...props} ref={ref} muted />;
}
