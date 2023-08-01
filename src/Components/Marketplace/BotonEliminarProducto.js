import { UnstyledButton } from "@mantine/core";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";

export default function ButtonEliminarCarrito({
  setProductos,
  producto,
  setCargando,
  ...props
}) {
  const usuario = useSelector(selectUsuario);
  const { id: id_producto } = producto;
  async function handleClick() {
    // setCargando(true);
    let {
      paciente: { id: id_paciente },
    } = usuario;
    try {
      await axios.delete(`/carrito/${id_paciente}/${id_producto}`);
      showPositiveFeedbackNotification(
        "Se ha eliminado el producto del carrito"
      );
    } catch (err) {
      console.log(err);
      if (!err) return;
      if (err.response.status === 500) {
        showNegativeFeedbackNotification("Algo ha salido mal 😥");
        return;
      } else {
        let {
          response: { data },
        } = err;
        showNegativeFeedbackNotification(data);
      }
    }
    borrarProducto();
    // setCargando(false);
  }
  function borrarProducto() {
    setProductos((productos) =>
      productos.filter(({ id_producto: id }) => id != id_producto)
    );
  }
  return (
    <UnstyledButton
      onClick={() => {
        console.log(`Eliminando del carrito ${producto.nombre}`);
        handleClick();
      }}
    >
      {props.children}
    </UnstyledButton>
  );
}
