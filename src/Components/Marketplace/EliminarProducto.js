import {
  Button,
  Flex,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useState } from "react";


export default function EliminarProducto({ onEliminar, producto }) {
  const textoVerificacion = `Kbocchi/Borrar/${producto.id}`;
  const [borrando, setBorrando] = useState(false);
  const usuario = useSelector(selectUsuario);
  const theme = useMantineTheme();
  const form = useForm({
    validate: {
      textoVerificacion: (value) => (value !== textoVerificacion ? "" : null),
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });
  const handleBorrar = async () => {
    setBorrando(true);
    try {
      let { id: id_producto } = producto;
      await axios.delete(`/productos/${id_producto}`);
      showPositiveFeedbackNotification("¡Se ha borrado el producto! 😀");
      onEliminar(id_producto);
    } catch (error) {
      if (error) {
        let {
          response: { data },
        } = error;
        showNegativeFeedbackNotification(data);
      }
    }
    setBorrando(false);
  };
  return (
    <Stack>
      <Text fz="lg">
        <Text>Borrar un producto una acción sin retorno.</Text>
        <Text>
          Una vez eliminado{" "}
          <Text span fw="bold" c={theme.colors.red[8]}>
            no podrás recuperarlo
          </Text>
        </Text>
      </Text>
      <Text fz="lg">
        Escribe{" "}
        <Text span fw="bold" c={theme.colors["blue-calm"][9]}>
          {textoVerificacion}
        </Text>{" "}
        para eliminar el producto
      </Text>
      <TextInput
        placeholder={textoVerificacion}
        fz="lg"
        {...form.getInputProps("textoVerificacion")}
      />
      <Flex justify="end">
        <Button
          variant="danger"
          disabled={!form.isValid()}
          loading={borrando}
          onClick={handleBorrar}
        >
          Borrar
        </Button>
      </Flex>
    </Stack>
  );
}
