import {
  Button,
  Flex,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import PaypalCheckoutButton from "../Paypal/PaypalCheckoutButton";
import { useForm } from "@mantine/form";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  isCodigoPostal,
  isPhoneValidation,
  isRequiredValidation,
} from "../../utils/inputValidation";
import { showNegativeFeedbackNotification } from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";
import { useEffect, useState } from "react";
import { currencyFormatter } from "../../utils/formatters";

export default function Checkout({ carrito }) {
  let {
    nombre,
    paciente: { id: id_paciente },
  } = useSelector(selectUsuario);
  let [cargando, setCargando] = useState(false);
  let [addressId, setAdressId] = useState();
  let [subtotal, setSubtotal] = useState();
  let [costoEnvio, setCostoEnvio] = useState();
  console.log({ carrito });
  const form = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {},
    validate: {
      estado: (value) => executeValidation(value, [isRequiredValidation]),
      ciudad: (value) => executeValidation(value, [isRequiredValidation]),
      direccion: (value) => executeValidation(value, [isRequiredValidation]),
      numero_exterior: (value) =>
        executeValidation(value, [isRequiredValidation]),
      codigo_postal: (value) =>
        executeValidation(value, [isRequiredValidation, isCodigoPostal]),
      telefono: (value) =>
        executeValidation(value, [isRequiredValidation, isPhoneValidation]),
    },
  });
  useEffect(() => {
    let subtotal = carrito.reduce(
      (acc, { cantidad, ...resto }) => acc + cantidad * resto.producto.precio,
      0
    );

    setSubtotal(subtotal);
  }, [carrito]);
  async function onSubmit({
    estado,
    ciudad,
    direccion,
    numero_exterior,
    codigo_postal,
    telefono,
  }) {
    setCargando(true);
    setCostoEnvio();
    setAdressId();
    try {
      let { data } = await axios.post("/envios/verify-address", {
        id_paciente,
        direccion: {
          street1: `${numero_exterior} ${direccion}`,
          city: `${ciudad}`,
          state: `${estado}`,
          zip: `${codigo_postal}`,
          country: "MX",
          phone: `${telefono}`,
          name: nombre,
        },
      });
      console.log({ data });
      setCostoEnvio(data.precio.cajas.pago_total);
      setAdressId(data.fromAddress.id);
    } catch (err) {
      console.log(err);
      setCargando(false);
      if (!err) return;
      if (err.response.status === 400) {
        showNegativeFeedbackNotification(
          "No hemos podido validar tu dirección. Revisa que esten bien los datos ingresados"
        );
        return;
      }
      if (err.response.status === 401) {
        showNegativeFeedbackNotification(
          "FedEx no cubre la dirección ingresada"
        );
        return;
      }
      showNegativeFeedbackNotification("No hemos podido validar tu dirección.");
    }
    setCargando(false);
  }
  useEffect(() => {
    console.log(addressId);
  }, [addressId]);
  useEffect(() => {
    setCostoEnvio();
    setAdressId();
  }, [form.values, carrito]);
  return (
    <>
      <Stack h="100px">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Estado"
              placeholder="Jalisco"
              {...form.getInputProps("estado")}
            />
            <TextInput
              label="Ciudad"
              placeholder="Zapopan"
              {...form.getInputProps("ciudad")}
            />
            <TextInput
              label="Direccion"
              placeholder="Nueva Escocia"
              {...form.getInputProps("direccion")}
            />
            <NumberInput
              hideControls
              label="Numero exterior"
              placeholder="1885"
              {...form.getInputProps("numero_exterior")}
            />
            <NumberInput
              hideControls
              label="Codigo Postal"
              {...form.getInputProps("codigo_postal")}
            />
            <NumberInput
              hideControls
              label="Telefóno"
              placeholder="Introduce tu telefóno..."
              withAsterisk
              {...form.getInputProps("telefono")}
            />
            <Button
              variant="guardar"
              type="submit"
              disabled={!form.isValid()}
              loading={cargando}
              s
            >
              Obtener costos de envío
            </Button>
          </Stack>
        </form>
        <Stack align="end">
          <Text>
            <Text>Subtotal: {currencyFormatter.format(subtotal)}</Text>
          </Text>
          {costoEnvio && (
            <Text>
              <Text>Envio: {currencyFormatter.format(costoEnvio)}</Text>
            </Text>
          )}
          {costoEnvio && (
            <Text>
              <Text>
                Total: {currencyFormatter.format(costoEnvio + subtotal)}
              </Text>
            </Text>
          )}
        </Stack>
        {costoEnvio && addressId && (
          <PaypalCheckoutButton
            carrito={carrito}
            disabled={!form.isValid() || cargando || !addressId}
            addressId={addressId}
            costoEnvio={costoEnvio}
          />
        )}
      </Stack>
    </>
  );
}
