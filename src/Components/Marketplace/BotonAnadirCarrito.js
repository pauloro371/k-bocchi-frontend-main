import { Box, Button, rem } from "@mantine/core";
import ControlCantidad from "./ControlCantidad";
import { useEffect, useState } from "react";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";

export default function BotonAnadirCarrito({
  stock,
  setStock,
  setHasStock,
  id_producto,
}) {
  const [cantidad, setCantidad] = useState(1);
  const [guardar, setGuardar] = useState(false);
  const {
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  useEffect(() => {
    console.log({ cantidad });
  }, [cantidad]);
  useEffect(() => {
    setCantidad(1);
  }, [stock]);
  async function handleAnadir() {
    setGuardar(true);
    try {
      let { data } = await axios.post("/carrito", {
        id_paciente,
        cantidad,
        id_producto,
      });
      showPositiveFeedbackNotification(
        "Se ha añadido el producto al carrito 🤑"
      );
      setGuardar(false);
      setStock(data.stock_carrito);
      return;
    } catch (err) {
      setGuardar(false);
      if (!err) return;

      if (err.response.status === 500) {
        showNegativeFeedbackNotification(
          "Lo lamentamos, algo ha salido mal 😥"
        );
        return;
      }
      let mensaje;
      let {
        response: { data },
      } = err;

      if (err.response.status === 420) {
        //Ya no hay stock para este producto
        setStock(0);
        mensaje = "Este producto se encuentra agotado";
      }
      if (err.response.status === 421) {
        //No hay stock suficiente para la cantidad requerida
        mensaje = "No hay stock suficiente";
        setStock(data.stock_carrito);
      }
      showNegativeFeedbackNotification(mensaje);
      return;
    }
  }
  return (
    <Box w="fit-content">
      <ControlCantidad
        mb="sm"
        max={stock}
        onChange={(value) => {
          setCantidad(value);
        }}
        disabled={guardar || stock === 0}
        initialValue={cantidad}
        size={42}
        heightInput={42}
        widthInput={rem(54)}
        min={1}
      />
      <Button
        variant="seleccionar"
        disabled={stock === 0}
        w="100%"
        loading={guardar}
        onClick={handleAnadir}
      >
        Añadir al carrito
      </Button>
    </Box>
  );
}
