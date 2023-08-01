import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle, auth, messaging } from "../firebase";
import { getRedirectResult } from "firebase/auth";
import { useEffect, useState } from "react";
import { BsExclamationLg } from "react-icons/bs";
import { RiSignalWifiErrorLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { USUARIO_AUTORIZADO } from "../Actions/actionsUsuario";
import axios from "axios";
import { BACKEND_SERVER } from "../server";
import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  List,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { executeValidation } from "../utils/isFormInvalid";
import {
  email_validation,
  isEmailAvailable,
  isRequiredValidation,
  password_validation,
} from "../utils/inputValidation";
import {
  useDisclosure,
  useLocalStorage,
  useMediaQuery,
  useSessionStorage,
} from "@mantine/hooks";
import { DisabledButton, EnabledButton } from "../Components/DynamicButtons";
import { Notifications, notifications } from "@mantine/notifications";
import {
  showErrorConexionNotification,
  showInfoNotification,
  showNegativeFeedbackNotification,
  showPositiveFeedbackNotification,
} from "../utils/notificationTemplate";
import { modals } from "@mantine/modals";
import Layout from "../Components/Layout";
import useSesionExpiracion from "../utils/sesionHook";
import { selectUsuario } from "../utils/usuarioHooks";
import { checkToken } from "../utils/FirebaseMessaging/checkToken";
import { deleteToken } from "firebase/messaging";

async function mandarCorreoRestablecer(email) {
  try {
    await axios.post("/usuarios/solicitarReestablecerContrasena", {
      email: email,
    });
    showPositiveFeedbackNotification("¡Listo! Se ha enviado el correo 📩");
    return null;
  } catch (err) {
    if (!err) {
      showNegativeFeedbackNotification(
        "Estamos teniendo dificultades para mandar el correo, intenta de nuevo"
      );
    }
  }
}

function RecuperarContrasena({ email, onCorrect }) {
  const [enviando, setEnviando] = useState(false);

  const form = useForm({
    validateInputOnBlur: true,
    validateInputOnChange: true,
    initialValues: { email },
    validate: {
      email: (value) =>
        executeValidation(value, [isRequiredValidation, email_validation]),
    },
  });
  const handleSubmit = async () => {
    setEnviando(true);
    try {
      await axios.post(`/usuarios/datos/email`, {
        email: email,
      });
      form.setErrors({ email: "Este correo no se encuentra registrado" });
    } catch (error) {
      if (error) {
        await mandarCorreoRestablecer(form.values.email);
        onCorrect();
      }
    }
    setEnviando(false);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Stack spacing="xl">
        <TextInput
          label="Correo"
          withAsterisk
          {...form.getInputProps("email")}
        />
        <Flex justify="end">
          <Button color="green-nature" loading={enviando} type="submit">
            Enviar
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

function AvisoSeguridad() {
  return (
    <Stack mb="lg">
      <Text>
        Hemos deshabilitado los intentos de acceso a tu cuenta por seguridad.
      </Text>
      <Text>
        Para habilitar el acceso a tu cuenta, tenemos que enviar un correo para
        validar que tu haz hecho los intentos de acceso
      </Text>
      <Text>El correo contiene dos formas para reactivar tu cuenta: </Text>
      <List>
        <List.Item>
          Tendrás un hipervínculo que permite reactivar tu cuenta
        </List.Item>
        <List.Item>
          Tendrás un hipervínculo que permite cambiar tu contraseña
        </List.Item>
      </List>
      <Text>
        Cualquiera de los dos métodos reactivara el acceso a tu cuenta
      </Text>
    </Stack>
  );
}
export const fetchUsuario = async ({ uid }) =>
  await axios.get(`/usuarios/datos/${uid}`);
export default function Inicio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [urlGiven, setUrlGiven] = useSessionStorage({
    key: "urlGiven",
    defaultValue: "/app",
  });
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.sm})`);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoadingGoogleAuth, setIsLoadingGoogleAuth] = useState(false);
  const [isBloqueada, setIsBloqueada] = useState(false);
  const [isValidandoCredenciales, setIsValidandoCredenciales] = useState(false);
  const { isExpirado, sesionExpiracion, init, getId } = useSesionExpiracion();
  const usuario = useSelector(selectUsuario);
  const form = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      contrasena: "",
    },
    validate: {
      contrasena: (value) =>
        executeValidation(value, [isRequiredValidation, password_validation]),
      email: (value) =>
        executeValidation(value, [isRequiredValidation, email_validation]),
    },
  });

  const abrirModalSeguridad = () => {
    modals.open({
      title: <Title order={2}>Aviso de seguridad</Title>,
      children: (
        <>
          <AvisoSeguridad />
          <RecuperarContrasena
            email={form.values.email}
            onCorrect={() => modals.closeAll()}
          />
        </>
      ),
      size: "auto",
    });
  };
  const handleRespuestaLogin = (errorResponse) => {
    if (!errorResponse) {
      return;
    }
    let message = errorResponse.response.data;
    if (errorResponse.response.status == 451) {
      console.log("usuario registrado con google");
    }
    if (errorResponse.response.status == 401) {
      console.log("contraseña incorrecta");
    }
    if (errorResponse.response.status == 403) {
      console.log("Cuenta bloqueada");
      setIsBloqueada(true);
      form.setValues({
        ...form.values,
        contrasena: "",
      });
      abrirModalSeguridad();
      return;
    }
    if (errorResponse.response.status == 404) {
      console.log("Usuario no encontrado");
      message = (
        <Text>
          {errorResponse.response.data}. Crea una cuenta{" "}
          <Anchor onClick={() => navigate("/registro")}>aquí</Anchor>{" "}
        </Text>
      );
    }
    notifications.clean();
    notifications.show({
      message: message,
      autoClose: 8000,
      icon: <BsExclamationLg />,
      color: "orange.5",
    });
  };
  useEffect(() => {
    if (usuario.id) {
      init();
    }
  }, [usuario]);
  async function goToInicio() {
    try {
      await deleteToken(messaging);
    } catch (err) {
      console.log(err);
    }
    try {
      await checkToken(usuario.id);
      navigate(urlGiven);
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    if (usuario.id) {
      goToInicio();
    }
  }, [sesionExpiracion]);
  useEffect(() => {
    async function checkLogin() {
      try {
        setIsLoadingGoogleAuth(true);
        const result = await getRedirectResult(auth);
        console.log(result);
        if (result) {
          // This is the signed-in user
          const firebaseUser = result.user;

          try {
            setIsLoadingGoogleAuth(true);
            const response = (await fetchUsuario(firebaseUser)).data;
            const user = { ...response, ...firebaseUser };

            dispatch({ type: USUARIO_AUTORIZADO, payload: user });
          } catch (err) {
            console.log(err);
            navigate("/registro");

            dispatch({
              type: USUARIO_AUTORIZADO,
              payload: { isGmail: true, ...firebaseUser },
            });
          }

          // This gives you a Facebook Access Token.
          // const credential = GoogleAuthProvider.credentialFromResult(auth, result);
          // const token = credential.accessToken;
        } else {
          setIsLoadingGoogleAuth(false);
          if (isExpirado()) {
            // alert("Logeate porfavor");
          } else {
            // alert("Tas logeado carnal");

            let id = getId();
            const response = (await fetchUsuario({ uid: id })).data;
            const user = { ...response };

            dispatch({ type: USUARIO_AUTORIZADO, payload: user });
            return;
          }
        }
      } catch (err) {
        if (err) console.log(err);
      }
    }
    checkLogin();
    console.log(localStorage);
  }, []);
  useEffect(() => setIsDisabled(!form.isValid()), [form.values]);
  const loginUsuario = async () => {
    if (form.validate().hasErrors) return;
    let { email, contrasena } = form.values;
    setIsValidandoCredenciales(true);
    try {
      let response = await axios.post(`/usuarios/datos/log`, {
        email: email,
        contrasena: contrasena,
      });
      console.log(response.data);
      dispatch({
        type: USUARIO_AUTORIZADO,
        payload: { ...response.data },
      });
    } catch (errorResponse) {
      handleRespuestaLogin(errorResponse);
      setIsValidandoCredenciales(false);
    }
  };
  return isExpirado() ? (
    <>
      <Center mx="center" pos="relative" mih="90vh">
        <Stack w="90vw" pos="relative">
          <LoadingOverlay visible={isLoadingGoogleAuth} overlayBlur={2} />
          <Title align="center" order={2}>
            Ingresa a K-Bocchi
          </Title>
          <Grid justify="center" align="center" gutter="xs">
            <Grid.Col sm="auto" px="lg">
              <form>
                <Stack p="md" justify="flex-end">
                  <TextInput
                    placeholder="Escribe tu correo"
                    label="Correo"
                    {...form.getInputProps("email")}
                  />
                  <PasswordInput
                    placeholder="Escribe tu contraseña"
                    label="Contraseña"
                    {...form.getInputProps("contrasena")}
                    disabled={isBloqueada}
                  />
                  {isDisabled ? (
                    <DisabledButton
                      type="submit"
                      w="100%"
                      radius="0"
                      color="green-nature"
                    >
                      Ingresar
                    </DisabledButton>
                  ) : (
                    <EnabledButton
                      type="submit"
                      w="100%"
                      radius="0"
                      color="green-nature"
                      loading={isValidandoCredenciales}
                      onClick={(e) => {
                        e.preventDefault();
                        loginUsuario();
                      }}
                    >
                      Ingresar
                    </EnabledButton>
                  )}
                </Stack>
                <Divider
                  size="sm"
                  labelPosition="center"
                  label="ó"
                  orientation={isMobile ? "horizontal" : "vertical"}
                />
              </form>
            </Grid.Col>

            {!isMobile && (
              <Grid.Col sm={1} span="content">
                <div
                  style={{
                    borderRight: `1px solid ${theme.colors.dark[0]} `,
                    height: "40vh",
                  }}
                ></div>
              </Grid.Col>
            )}

            <Grid.Col sm="auto" span="content">
              <Center>
                <Button
                  radius="0"
                  px="4em"
                  color="dark"
                  variant="outline"
                  leftIcon={<FcGoogle size="1.5em" />}
                  h="4em"
                  onClick={() => {
                    signInWithGoogle();
                  }}
                >
                  Continuar con google
                </Button>
              </Center>
              <Box
                pos={isMobile ? "relative" : "absolute"}
                left={isMobile ? "0" : "80%"}
                bottom="90%"
              >
                <Link style={{ textDecoration: "none" }} to={"/registro"}>
                  <Center>
                    <Text align="center" color="dimmed" fw="bold">
                      Crea una cuenta
                    </Text>
                  </Center>
                </Link>
              </Box>
            </Grid.Col>
          </Grid>
        </Stack>
      </Center>
      {/* <Layout/> */}
    </>
  ) : (
    <LoadingOverlay visible={!isExpirado()} overlayBlur={2} />
  );
}
