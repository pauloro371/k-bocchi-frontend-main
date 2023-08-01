import useMantenerSesion from "../utils/mantenerSesionHook";
import useSesionExpiracion from "../utils/sesionHook";
import { messaging } from "../firebase";
import { deleteToken } from "firebase/messaging";
export default function ButtonLogout({ Child }) {
  const { setNull } = useSesionExpiracion();
  const { deleteSesion } = useMantenerSesion();
  return (
    <div
      onClick={() => {
        console.log("Adios");
        setNull();
        deleteSesion();
        try {
          deleteToken(messaging);
        } catch (err) {}
      }}
    >
      {Child}
    </div>
  );
}
