import {
  Title,
  Box,
  LoadingOverlay,
  Text,
  ThemeIcon,
  Center,
  Stack,
  Image,
  Flex,
  Button,
  TextInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useEffect, useState } from "react";
import { FaCheck, FaUserAlt } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { DisabledButton, EnabledButton } from "../../Components/DynamicButtons";
import { useForm } from "@mantine/form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { executeValidation } from "../../utils/isFormInvalid";
import { isRequiredValidation } from "../../utils/inputValidation";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { ImCross } from "react-icons/im";
import {
  showErrorConexionNotification,
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../../utils/notificationTemplate";

export function DatosValidarCedula({ anterior, siguiente }) {
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setIsDisabled] = useState(true);
  //Permite guardar la url de la imagen de la cedula
  const [urlImagen, setUrlImagen] = useState();
  //Permite guardar la imagen de la cedula
  const [file, setFile] = useState();
  //Se obtienen los datos y su stter por medio de useOutletContext
  const { datos, setDatos } = useOutletContext();
  //Se obtienen los datos que se van a modificar en esta pantalla del registro
  const { numero_cedula, nombre, apellidos } = datos;
  const navigate = useNavigate();
  //Permite habilitar los componentes para subir la foto de la cedula
  const [isDisabledCedulaFoto, setIsDisabledCedulaFoto] = useState(true);
  //Permite mostrar un estado de carga cuando se esta validando un numero de cedula
  const [isValidandoNumCedula, setIsValidandoNumCedula] = useState(false);
  //Permite mostrar un estado de carga cuando se esta validando una foto
  const [isValidandoCedulaFoto, setIsValidandoCedulaFoto] = useState(false);
  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: {
      numero_cedula: numero_cedula,
    },
    validate: {
      numero_cedula: (value) =>
        executeValidation(value, [isRequiredValidation]),
    },
  });

  const validarCedulaOCR = async () => {
    //Se habilita la bandera de validación de foto
    setIsValidandoCedulaFoto(true);
    //Para pasar imagenes a la api se necesita usar un objeto FormData
    const formData = new FormData();
    //Se agregan al formData los datos de la imagen de la cedula, nombre del usuario y numero de cedula
    let nombreCompleto = `${nombre.trim()} ${apellidos.trim()}`;
    formData.append("imagenCedula", file);
    formData.append("nombre", nombreCompleto);
    formData.append("numeroCedula", numero_cedula);
    try {
      //Se mandan a la api
      let result = await axios.post(`/utilidades/validarCedulaOCR`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //Si se recibe un codigo exitoso habilitamos los botones y se habilita el boton siguiente
      showPositiveFeedbackNotification(
        "Se ha validado correctamente todos tus datos"
      );
      setIsValidandoCedulaFoto(false);
      setIsDisabled(false);
    } catch (err) {
      //Si algo sale mal se muestra en pantalla
      setIsValidandoCedulaFoto(false);
      console.log(err);
      if (!err) {
        return;
      }
      let mensaje = err.response.data;
      showNegativeFeedbackNotification(mensaje);
      setIsDisabled(true);
    }
  };
  useEffect(() => {
    //Cada vez que se cambia el numero de cedula, se resetea al estado inicial
    setIsDisabledCedulaFoto(true);
    setIsDisabled(true);
    setUrlImagen(null);
  }, [numero_cedula]);
  const irAtras = () => {
    navigate(anterior);
  };
  const irSiguiente = () => {
    navigate(siguiente);
  };
  const buscarCedula = async () => {
    try {
      let response = await axios.post(`/utilidades/validarCedula`, {
        cedula: form.values.numero_cedula,
      });
      notifications.show({
        message: "Se ha encontrado tu cedula!",
        autoClose: 3500,
        icon: <FaCheck />,
        color: "green-nature",
      });
      setIsDisabledCedulaFoto(false);
    } catch (err) {
      if (!err) {
        return;
      }
      setIsDisabledCedulaFoto(true);
      let mensaje = err.response.data;
      if (err.response.status == 500) showNegativeFeedbackNotification(mensaje);
      else form.setErrors({ numero_cedula: mensaje });
    }
    setIsValidandoNumCedula(false);
  };
  useEffect(() => {
    //Cada vez que se cambian los datos del formulario, se guardan en la variable de datos.
    setDatos({ ...datos, ...form.values });
  }, [form.values]);
  return (
    <Stack pos="relative">
      <Box mx="auto" pos={"relative"}>
        <Center>
          <ThemeIcon radius="xl" size="xl" color="green-nature">
            <MdOutlineVerified />
          </ThemeIcon>
        </Center>

        <Title order={3} align="center">
          ¡Perfecto!
        </Title>
        <Text order={5} align="center" mt="lg" size="lg" color="dimmed">
          Ahora tenemos que validar tu información profesional
        </Text>
        <Stack mt="lg">
          <TextInput
            description="Tenemos que validar la existencia de tu cedula"
            label="Numero de cedula"
            placeholder="00000000"
            mt="lg"
            disabled={isValidandoNumCedula}
            withAsterisk
            {...form.getInputProps("numero_cedula")}
          />
          {/* Boton para validar el numero de cedula */}
          <Button
            loading={isValidandoNumCedula}
            onClick={() => {
              setIsValidandoNumCedula(true);
              buscarCedula();
            }}
            color="green-nature"
          >
            Buscar
          </Button>
          
          {!isDisabledCedulaFoto && (
            
            <>
            {/* Si ya se valido el numero de cedula, se muestra esto  */}
              <Text color="dimmed">
                Sube una foto de tu cedula para poder validarla con los datos
                que has ingresado
              </Text>
              {/* Este componente permite subir la foto de la cedula */}
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={([file]) => {
                  console.log(file);
                  setFile(file);
                  setUrlImagen(URL.createObjectURL(file));
                }}
                maxFiles={1}
              >
                {urlImagen ? (
                  <Image
                    src={urlImagen}
                    imageProps={{
                      onLoad: () => URL.revokeObjectURL(urlImagen),
                    }}
                  />
                ) : (
                  <Text align="center">Sube una foto de tu cedula</Text>
                )}
              </Dropzone>
              <Button
                loading={isValidandoCedulaFoto}
                onClick={validarCedulaOCR}
                color="green-nature"
                disabled={!urlImagen}
              >
                Validar
              </Button>
            </>
          )}
        </Stack>
        <Flex justify="space-between" mt="lg">
          <Button onClick={irAtras} color="cyan-opaque.9">
            Atrás
          </Button>
          {disabled ? (
            <DisabledButton color="green-nature">Siguiente</DisabledButton>
          ) : (
            <EnabledButton color="green-nature" onClick={irSiguiente}>
              Siguiente
            </EnabledButton>
          )}
        </Flex>
      </Box>
    </Stack>
  );
}
