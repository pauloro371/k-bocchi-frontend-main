import { useEffect, useState } from "react";

import { useNavigate, useOutletContext } from "react-router-dom";
import {
  email_validation,
  isEmailAvailable,
  isRequiredValidation,
  password_validation,
} from "../../utils/inputValidation";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  LoadingOverlay,
  PasswordInput,
  TextInput,
  ThemeIcon,
  Title,
  Text,
  Flex,
  Center,
} from "@mantine/core";
import { executeValidation } from "../../utils/isFormInvalid";
import { hasInitialValues } from "../../utils/hasInitialValues";
import ErrorModal from "../../Components/ErrorModal";
import MensajeErrorConexion from "../../Components/MensajeErrorConexion";
import { DisabledButton, EnabledButton } from "../../Components/DynamicButtons";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
const selectUsuarioIsGmail = (state) => state.usuario.isGmail;

//En este formulario se obtienen el email y contrasena
export default function DatosIdentificacion({ siguiente, atras }) {
  //React moderno se basa en hooks
  /**
   * Los hooks son funciones que permiten añadir comportamientos o funcionalidades a los componentes de react
   */
  //Aqui usamos el hook de useSelector de React Redux
  //Este hook nos permite obtener datos del estado de React Redux mediante una funcion de seleccion
  //En este caso es selectUsuarioIsGmail
  const isGmail = useSelector(selectUsuarioIsGmail);
  //Con useOutletContext se puede obtener las variables que pasamos como contexto, que en este caso datos y setDatos
  const { datos, setDatos } = useOutletContext();
  /**
   * opened usa el hook de useDisclosure de mantine. Este hook nos permite crear una variable booleana.
   * Con open y close se puede cambiar  el valor de opened a  true y false respectivamente
   */
  const [opened, { open, close }] = useDisclosure(false);
  /**
   * useNavigate es un hook de react-router que permite cambiar entre rutas en la aplicación
   */
  const navigate = useNavigate();
  //De la variable datos, se obtiene email y contrasena
  const { email, contrasena } = datos;
  //Posteriormente con disabled se puede habilitar o deshabilitar partes de la interfaz dependiendo de si el usuario se quiere registrar con google
  const [disabled, setDisabled] = useState(true && !isGmail);
  //isLoading permite señalar en la interfaz cuando se esta cargando
  const [isLoading, setIsLoading] = useState(false);
  // const isMobile = useMediaQuery("(max-width: 50em)");

  //Los formularios usan un hook (useForm) que es de mantine
  /**
   * Estos, reciben un objeto que contiene las configuraciones del formulario.
   *
   * validateInputOnChange: Esta propiedad permite indicarle al formulario que tiene que validarse en cada cambio que el usuario haga
   * validateInputOnBlur: Esta propiedad permite indicarle al formulario que tiene que validarse cada vez que el usuario toque un input
   * initialValues: Esta propiedad permite establecer los valores iniciales del formulario
   * validate: Esta propiedad contiene las validaciones para cada campo del formulario
   *
   * Todos los formularios del proyecto usan una funcion llamada executeValidation que permite ejecutar una serie de validaciones
   *
   */
  const form = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      email: email,
      contrasena: contrasena,
      confirmarContrasena: contrasena,
    },
    validate: {
      contrasena: (value) =>
        //En este caso, si el usuario desea registrarse con gmail, no se necesita validar contrasena ni email
        isGmail
          ? null
          : executeValidation(value, [
              isRequiredValidation,
              password_validation,
            ]),
      email: (value) =>
        isGmail
          ? null
          : executeValidation(value, [isRequiredValidation, email_validation]),
      confirmarContrasena: (value, values) =>
        isGmail
          ? null
          : executeValidation(value, [
              isRequiredValidation,
              password_validation,
              (value) =>
                values.contrasena !== value
                  ? "Las contraseñas no coinciden"
                  : null,
            ]),
    },
  });

  //El hook de useEffect es importante, se comporta un poco diferente a los demás
  /**
   * Lo más importante que hay que entender es:
   *  - Es una función que recibe dos parametros: El primero es una función a ejecutar y el segundo es un arreglo de dependecias
   *  - La función que se ejecuta en los siguientes casos:
   *      + Cada vez que el componente se renderiza
   *      + Cada vez que cambia una variable del arreglo de dependecias
   * Por lo tanto, cada vez que cambie la propiedad values de form, la función de este hook se va a ejecutar
   */
  useEffect(() => {
    //Cambiar el valor de datos, a los datos que tiene el formulario actualmente
    setDatos({ ...datos, ...form.values });
    //Si las dos contrasenas no son iguales, agregar un error al formulario mediante la función setErrors
    if (form.values.confirmarContrasena !== form.values.contrasena)
      form.setErrors({
        ...form.errors,
        confirmarcontrasena: "Las contraseñas no coinciden",
      });
    //Se revisa si el formulario es valido y se cambia el valor de disabled
    setDisabled(!form.isValid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => hasInitialValues(form), []);

  //Esta funcion se ejecuta cuando ya se han validado todos los campos y se habilita el boton de siguiente
  const onSubmitSuccess = async (data) => {
    console.log("DATOS: ", datos);
    //Se cambia el estado de carga a true
    setIsLoading(true);
    //Se revisa si el email esta ocupado o no
    let resultado = await isEmailAvailable({ ...data });
    //Una vez se termina, se cambia el estado de carga a falso
    setIsLoading(false);
    //Si no hay resultado se retorna
    if (!resultado) return;
    //Si hay errores se marcan en la interfaz y se regresa
    if (resultado.response && resultado.response.data) {
      form.setErrors({ email: resultado.response.data });
      return;
    }
    //Si el email es valido, se navega a la siguiente
    navigate(siguiente);
  };

  const onSubmitError = (data) => {
    alert(JSON.stringify(datos));
    navigate(siguiente);
  };

  return (
    <>
    {/* Este modal se muestra cada vez que hay un error */}
      <ErrorModal close={close} opened={opened}>
        <MensajeErrorConexion />
      </ErrorModal>
      <Box mx="auto" pos={"relative"}>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <Center>
          <ThemeIcon radius="xl" size="xl" color="green-nature">
            <FaLock color="green-nature" />
          </ThemeIcon>
        </Center>
        <Title align="center" order={3}>
          ¡Bienvenido!
        </Title>

        <Text order={5} mt="lg" size="lg" color="dimmed" align="center">
          Empecemos con tus datos datos para ingresar a Bocchi
        </Text>
        {/* Creamos una etiqueta form y asignamos la funcion onSubmit del formulario a la funcion onSubmit de la etiqueta form */}
        <form onSubmit={form.onSubmit(onSubmitSuccess, onSubmitError)}>
          <TextInput
            label="Correo"
            placeholder="bidenBlast@gmail.com"
            mt="lg"
            withAsterisk
            disabled={isGmail}
            // De esta forma vinculamos los campos del formulario a inputs en la interfaz
            //Este input es el campo de "email"
            {...form.getInputProps("email")}
          />
          {/* Si el usuario se esta registrando con gmail no hay necesidad de mostrar la contraseña */}
          {!isGmail && (
            <>
              <PasswordInput
                label="Contraseña"
                placeholder="Contrasena"
                mt="xl"
                withAsterisk
                {...form.getInputProps("contrasena")}
              />
              <PasswordInput
                label="Confirmar contraseña"
                placeholder="Contraseña"
                mt="xl"
                // disabled={!form.isValid("contrasena")}
                withAsterisk
                {...form.getInputProps("confirmarContrasena")}
              />
            </>
          )}

          <Flex justify="flex-end" mt="lg">
            {disabled ? (
              <DisabledButton color="green-nature">Siguiente</DisabledButton>
            ) : (
              <EnabledButton color="green-nature">Siguiente</EnabledButton>
            )}
          </Flex>
        </form>
      </Box>
    </>
  );
}
