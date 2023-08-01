import {
  Button,
  Image,
  ThemeIcon,
  Text,
  Center,
  Stack,
  Box,
  LoadingOverlay,
  Title,
  Flex,
  Divider,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useCallback, useRef, useState, useEffect } from "react";
import { modals } from "@mantine/modals";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { notifications } from "@mantine/notifications";
import { MdOutlineVerified } from "react-icons/md";
import { DisabledButton, EnabledButton } from "../../Components/DynamicButtons";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function DatosValidacionIne({ anterior, siguiente }) {
  //Este estado permite almacenar la imagen que suba el usuario
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  //Este estado permite guardar la URL de la imagen que sube el usuario
  const [urlImagen, setUrlImagen] = useState();
  //Este estado usa el hook useRef que permite guardar una referencia a una variable o a un elemento html
  //Es la webcam en sí
  const webcamRef = useRef(null);
  //Es el elemento image donde se muestra la foto de la ine subida
  const imagenINE = useRef(null);
  //Es el elemento image donde se muestra la foto de la webcam
  const imagenFotoWebcam = useRef(null);
  const navigate = useNavigate();
  //Permite habilitar y deshabilitar el boton de siguiente
  const [disabled, setDisabled] = useState(true);
  //Permite guardar la url de la foto del usuario para poder mostrarla en preview
  const [urlFoto, setUrlFoto] = useState();
  const net = new faceapi.FaceRecognitionNet();
  // const [isSubirFotoDisabled,setIsSubirFotoDisabled] = useState(false);

  //Esta funcion muestra un aviso para poder habilitar la camara
  const openAviso = () => {
    if (isCamaraEnabled) return;
    modals.openConfirmModal({
      title: <Title order={3}>¡Hola!</Title>,
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green-nature" },
      children: (
        <Text>
          Para poder continuar necesitamos una fotografía con el fin de
          compararla con su INE para validar su identidad. ¿Esta usted de
          acuerdo?
        </Text>
      ),
      //Esto se ejecuta cuando el usuario le da a confirmar
      onConfirm: () => {
        //Se activa la camara
        setIsCamaraEnabled(true);
        //Y se muestra una notificación
        notifications.show({
          message: "¡Perfecto! Se esta habilitando su camara",
          autoClose: 3500,
          color: "green-nature",
        });
      },
      //Esto se ejecuta cuando el usuario le da a cancelar
      onCancel: () => setUrlImagen(),
      //Permite modificar el modal que se muestra, quitandole los botones de cerrar
      closeOnClickOutside: false,
      closeOnEscape: false,
      withCloseButton: false,
    });
  };
  const irAtras = () => {
    navigate(anterior);
  };
  const irSiguiente = () => {
    navigate(siguiente);
  };

  const validar = () => {};
  useEffect(() => {
    //Si hay una urlFoto se muestra un modal con la preview de la foto tomada
    if (urlFoto)
      modals.openConfirmModal({
        id: "confirmacion",
        title: <Title order={3}>¡Hola!</Title>,
        labels: { confirm: "Validar", cancel: "Regresar" },
        confirmProps: { color: "green-nature" },
        children: (
          <Stack>
            <Text>Esta es la foto con la que se validará tu INE</Text>
            <Image
              src={urlFoto}
              imageProps={{ onLoad: () => URL.revokeObjectURL(urlImagen) }}
              imageRef={imagenFotoWebcam}
            />
          </Stack>
        ),
        onConfirm: () => {
          //Se cierra el modal anterior
          modals.close("confirmacion");
          setIsCamaraEnabled(true);
          //Se define una función para detectar y comparar rostros
          async function detect() {
            if (!urlFoto) return;
            try {
              //Primero ejecuta detectSingleFace que permite obtener el rostro visible en la ine
              let faceDescriptionsINE = await faceapi
                .detectSingleFace(
                  imagenINE.current,
                  new faceapi.TinyFaceDetectorOptions()
                )
                //También se marca ese rostro
                .withFaceLandmarks()
                //Y agrega descriptores (para poder compararlos)
                .withFaceDescriptor();
              console.log("INE: ", faceDescriptionsINE);
              //Si no hay un rostro visible notifica al usuario
              if (!faceDescriptionsINE) {
                notifications.update({
                  id: "validar-notificacion",
                  message:
                    "El rostro no se encuentra visible en la INE, intenta con otra foto",
                  color: "red",
                  loading: false,
                  autoClose: 10000,
                  onClose: () => notifications.clean(),
                  withCloseButton: true,
                  icon: <ImCross />,
                });
                setDisabled(true);
                return;
              }

              //si hay rostro, continua
              // const imgIne = await faceapi.fetchImage(urlImagen);

              //Crea un elemento img temporal para poder usarlo para almacenar la foto/imagen del usuario
              const newImage = document.createElement("img");
              newImage.src = urlFoto;
              //Obtiene los descriptores de la foto de la persona
              let faceDescriptionsPersona = await faceapi
                .detectSingleFace(
                  newImage,
                  new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceDescriptor();
              console.log("FOTO: ", faceDescriptionsPersona);
              //Si no hay rostro en la imagen, notifica al usuario
              if (!faceDescriptionsPersona) {
                notifications.update({
                  id: "validar-notificacion",
                  message:
                    "El rostro no se encuentra visible en la foto tomada con la webcam, intenta con otra foto",
                  color: "red",
                  loading: false,
                  autoClose: 10000,
                  onClose: () => notifications.clean(),
                  withCloseButton: true,
                  icon: <ImCross />,
                });
                setDisabled(true);
                return;
              }
              setUrlFoto();

              /**
               * Para poder verificar que el rostro sea el mismo, se tiene que verificar su similitud
               * Esto se hace calculando la "distancia" o que tan diferente es un rostro con el otro
               * Para eso se usa euclidianDistance y los descriptores que se generaron previamente
               */
              const maxDescriptorDistance = 0.6;
              const euclideanDistance = faceapi.euclideanDistance(
                faceDescriptionsINE.descriptor,
                faceDescriptionsPersona.descriptor
              );
              //La distancia va en una escala de 0-1. Mientras menor sea el numero, más parecidos son los rostros
              //Se definió 0.49 como la medida aceptable para decir que el rostro es el mismo
              if (euclideanDistance <= 0.49) {
                //Si el rostro es valido, se desactiva la camara, se activa el boton de siguiente y se muestra una notificación
                console.log("valido");
                setIsCamaraEnabled(false);
                notifications.update({
                  id: "validar-notificacion",
                  message: "Identidad validada correctamente!",
                  color: "green-nature",
                  loading: false,
                  autoClose: 10000,
                  onClose: () => notifications.clean(),
                  withCloseButton: true,
                  icon: <FaCheck />,
                });
                setDisabled(false);
              } else {
                //Si el rostro es invalido, se mantiene la camara activa y el boton de siguiente se mantiene desactivo
                console.log("invalido");
                notifications.update({
                  id: "validar-notificacion",
                  message:
                    "No se ha podido validar tu identidad, no coinciden los rostros en la INE y la imagen de tu rostro",
                  color: "red",
                  loading: false,
                  autoClose: 10000,
                  onClose: () => notifications.clean(),
                  withCloseButton: true,
                  icon: <ImCross />,
                });
                setDisabled(true);
              }
              // const faceMatcher = new faceapi.FaceMatcher([faceDescriptionsINE.descriptor,faceDescriptionsPersona.descriptor],maxDescriptorDistance);
              console.log(euclideanDistance);
            } catch (err) {
              console.log(err);
              notifications.update({
                id: "validar-notificacion",
                message: "Ha habido un error, intenta de vuelta",
                color: "red",
                loading: false,
                autoClose: 10000,
                onClose: () => notifications.clean(),
                withCloseButton: true,
                icon: <ImCross />,
              });
            }
          }

          //Se manda a llamar la funcion de detect y se muestra un mensaje de espera
          detect();
          notifications.show({
            id: "validar-notificacion",
            message: "Estamos validando tu INE, no salgas",
            color: "blue-calm",
            loading: true,
            autoClose: false,
            withCloseButton: false,
          });
        },
      });
  }, [urlFoto]);

  useEffect(() => {
    //Esta funcion se encarga de obtener los modelos usados por face-api. Estos modelos se encuentran en la carpeta de public
    async function fetchModels() {
      // faceapi
      //   .loadFaceRecognitionModel("./models")
      //   .then(() => console.log("done"))
      //   .catch((e) => console.log(e));
      console.log(process.env.PUBLIC_URL);
      try {
        //Se cargan los modelos necesarios
        await faceapi.loadFaceRecognitionModel(
          process.env.PUBLIC_URL + "/models"
        );
        await faceapi.loadFaceDetectionModel(
          process.env.PUBLIC_URL + "/models"
        );
        await faceapi.loadFaceLandmarkModel(process.env.PUBLIC_URL + "/models");
        await faceapi.loadTinyFaceDetectorModel(
          process.env.PUBLIC_URL + "/models"
        );

        console.log("done");
      } catch (err) {
        console.log(err);
      }
    }
    fetchModels();
  }, []);
  //Esta función permite tomar una foto con la webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUrlFoto(imageSrc);
  }, [webcamRef]);
  useEffect(() => {}, [urlFoto]);
  const [isCamaraEnabled, setIsCamaraEnabled] = useState(false);

  return (
    <Stack pos="relative">
      {/* <LoadingOverlay visible={isModelsLoading}> */}
      <Box mx="auto" pos={"relative"}>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <Center>
          <ThemeIcon radius="xl" size="xl" color="green-nature">
            <MdOutlineVerified />
          </ThemeIcon>
        </Center>

        <Title order={3} align="center">
          ¡Sigamos!
        </Title>
        <Text order={5} align="center" mt="lg" size="lg" color="dimmed">
          Para brindar mas seguridad a los pacientes, tenemos que validar tu
          identidad
        </Text>
        <Stack mt="lg">
          {/* Este componente de mantine permite subir archivos */}
          <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={([file]) => {
              //Cuando se sube un archivo se guarda en "file" y se guarda una url de esa imagen para poderla mostrar en urlImagen
              console.log(file);
              setFile(file);
              setUrlImagen(URL.createObjectURL(file));
              openAviso();
            }}
            maxFiles={1}
          >
            {/* Aqui se muestra la preview de la foto */}
            {urlImagen ? (
              <Image
                src={urlImagen}
                imageRef={imagenINE}
                imageProps={{ onLoad: () => URL.revokeObjectURL(urlImagen) }}
              />
            ) : (
              <Text align="center">Sube tu ine</Text>
            )}
          </Dropzone>
          {/* Si la camara esta habilitada se muestra la webcam */}
          {isCamaraEnabled && (
            <>
              <Center>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{
                    maxWidth: "90%",
                  }}
                />
              </Center>
              <Center>
                <Button color="green-nature.6" onClick={capture}>
                  Tomar foto
                </Button>
              </Center>
              <Divider label="ó" labelPosition="center" />
              {/* Aqui esta el componente para subir el archivo de la foto, para usar una foto en vez de la webcam */}
              <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={([file]) => {
                  console.log(file);
                  setUrlFoto(URL.createObjectURL(file));
                }}
                maxFiles={1}
              >
                <Text align="center">Sube una foto de tu rostro aquí</Text>
              </Dropzone>
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
      {/* </LoadingOverlay> */}
    </Stack>
  );
}
