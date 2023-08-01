import {
  Button,
  Container,
  Flex,
  Group,
  Image,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { FaFileUpload, FaImage } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";
import {
  CATEGORIA_DISPOSITIVO,
  CATEGORIA_MEDICAMENTO,
} from "../../utils/categorias";
import { executeValidation } from "../../utils/isFormInvalid";
import {
  isLongitudMaxima,
  isLongitudMinima,
  isMaximoNumero,
  isMinimoNumero,
  isRequired,
  isRequiredValidation,
} from "../../utils/inputValidation";
import {
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../../utils/usuarioHooks";

export default function CrearProducto({ onCrear }) {
  const theme = useMantineTheme();
  const [urlImagen, setUrlImagen] = useState();
  const [guardando, setGuardando] = useState(false);
  const {
    terapeuta: { id: id_terapeuta },
  } = useSelector(selectUsuario);
  const form = useForm({
    initialValues: {
      nombre: "",
      caracteristicas: "",
      precio: undefined,
      stock: undefined,
      imagen: undefined,
      categoria: undefined,
      id_terapeuta,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: {
      nombre: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMaxima(value, 30, "caracteres"),
          (value) => isLongitudMinima(value, 4, "caracteres"),
        ]),
      caracteristicas: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isLongitudMaxima(value, 255, "caracteres"),
          (value) => isLongitudMinima(value, 10, "caracteres"),
        ]),
      precio: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isMinimoNumero(value, 1, "peso"),
          (value) => isMaximoNumero(value, 100000, "pesos"),
        ]),
      ancho: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isMinimoNumero(value, 1, "cm"),
          (value) => isMaximoNumero(value, 150, "cm"),
        ]),
      largo: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isMinimoNumero(value, 1, "cm"),
          (value) => isMaximoNumero(value, 150, "cm"),
        ]),
      altura: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isMinimoNumero(value, 1, "cm"),
          (value) => isMaximoNumero(value, 150, "cm"),
        ]),
      peso: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isMinimoNumero(value, 1, "gr"),
          (value) => isMaximoNumero(value, 5000, "gr"),
        ]),
      stock: (value) =>
        executeValidation(value, [
          isRequiredValidation,
          (value) => isMinimoNumero(value, 1, "producto"),
          (value) => isMaximoNumero(value, 100000, "productos"),
        ]),
      imagen: (value) => executeValidation(value, [isRequiredValidation]),
      categoria: (value) => executeValidation(value, [isRequiredValidation]),
    },
  });
  async function handleGuardar(value) {
    setGuardando(true);
    const formData = new FormData();
    const prodData = {};
    Object.keys(value).forEach((k) => {
      if (k !== "imagen") prodData[k] = value[k];
    });
    formData.append("imagen", value.imagen);
    formData.append("producto", JSON.stringify(prodData));
    try {
      let { data: producto } = await axios.post(`/productos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onCrear(producto);
      showPositiveFeedbackNotification(
        "Se ha creado correctamente tu producto"
      );
    } catch (err) {
      if (!err) {
        return;
      }
      let {
        response: { data },
      } = err;
      showNegativeFeedbackNotification(data);
      console.log(err);
    }
    setGuardando(false);
  }
  return (
    <Container fluid>
      <form onSubmit={form.onSubmit(handleGuardar)}>
        <Stack>
          <TextInput
            withAsterisk
            label="Nombre"
            description="Es el nombre del producto, tal cual como quieres que tus clientes lo encuentren"
            {...form.getInputProps("nombre")}
          />
          <Dropzone
            maxSize={3 * 1024 ** 2}
            accept={["image/png", "image/jpg", "image/jpeg"]}
            maxFiles={1}
            onDrop={([file]) => {
              console.log(file);
              form.setValues((v) => ({ ...v, imagen: file }));
              setUrlImagen(URL.createObjectURL(file));
            }}
            sx={(theme) => ({
              "&[data-accept]": {
                color: theme.colors.dark[8],
                backgroundColor: theme.colors["green-calm"][3],
              },
            })}
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: rem(220), pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <FaFileUpload
                  size="3.2rem"
                  stroke={1.5}
                  color={
                    theme.colors["green-nature"][
                      theme.colorScheme === "dark" ? 4 : 6
                    ]
                  }
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <ImCross
                  size="3.2rem"
                  stroke={1.5}
                  color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
                />
              </Dropzone.Reject>
              {urlImagen ? (
                <Image
                  src={urlImagen}
                  imageProps={{
                    onLoad: () => URL.revokeObjectURL(urlImagen),
                  }}
                />
              ) : (
                <>
                  <Dropzone.Idle>
                    <RiImageAddFill size="3.2rem" stroke={1.5} />
                  </Dropzone.Idle>
                  <div>
                    <Text size="xl" inline>
                      Arrastra o selecciona para subir una imagen
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      El archivo debe ser formato png,jpg/jpeg
                    </Text>
                  </div>
                </>
              )}
            </Group>
          </Dropzone>
          <Textarea
            withAsterisk
            label="Caracteristicas"
            description="Proporciona los detalles del producto. Puedes incluir peso, forma de uso, cantidad por empaque, recomendaciones etc."
            autosize
            {...form.getInputProps("caracteristicas")}
          />
          <NumberInput
            withAsterisk
            label="Peso (gr)"
            description="Es el peso de tu producto en gramos"
            precision={2}
            {...form.getInputProps("peso")}
          />
          <NumberInput
            withAsterisk
            label="Altura (cm)"
            description="Es la altura de tu producto en centimetros"
            precision={2}
            {...form.getInputProps("altura")}
          />
          <NumberInput
            withAsterisk
            label="Ancho (cm)"
            description="Es el ancho de tu producto en centimetros"
            precision={2}
            {...form.getInputProps("ancho")}
          />
          <NumberInput
            withAsterisk
            label="Largo (cm)"
            description="Es el largo de tu producto en centimetros"
            precision={2}
            {...form.getInputProps("largo")}
          />
          <NumberInput
            withAsterisk
            label="Precio"
            description="Es el precio unitario de tu producto. Es el precio que verán los clientes"
            precision={2}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
            {...form.getInputProps("precio")}
          />
          <NumberInput
            label="Stock"
            description="Es la cantidad de producto con el que cuentas para vender actualmente"
            withAsterisk
            {...form.getInputProps("stock")}
          />
          <Radio.Group
            label="Selecciona una categoría"
            withAsterisk
            {...form.getInputProps("categoria")}
          >
            <Group mt="xs">
              <Radio value={CATEGORIA_DISPOSITIVO} label="Dispositivo" />
              <Radio value={CATEGORIA_MEDICAMENTO} label="Medicamento" />
            </Group>
          </Radio.Group>
          <Flex justify="end" w="100%">
            <Button
              variant="guardar"
              disabled={!form.isValid()}
              loading={guardando}
              type="submit"
            >
              Guardar
            </Button>
          </Flex>
        </Stack>
      </form>
    </Container>
  );
}
