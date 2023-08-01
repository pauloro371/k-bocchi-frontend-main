import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import { ImCross, ImInfo } from "react-icons/im";
import { RiSignalWifiErrorLine } from "react-icons/ri";
const defaultMensajeErrorConexion =
  "Estamos experimentando problemas, disculpa 😭. Intentalo de nuevo";
const defaultTimer = 5000;
export const showErrorConexionNotification = (
  mensaje = defaultMensajeErrorConexion
) => {
  notifications.show({
    id: "notificaion-error-net",
    message: mensaje,
    icon: <RiSignalWifiErrorLine />,
    color: "red.5",
    autoClose: defaultTimer,
  });
};

export const updateErrorConexionNotification = (
  mensaje = defaultMensajeErrorConexion
) => {
  notifications.update({
    id: "notificaion-error-net",
    message: mensaje,
    icon: <RiSignalWifiErrorLine />,
    color: "red.5",
    autoClose: defaultTimer,
  });
};

export const showPositiveFeedbackNotification = (mensaje,props={}) => {
  notifications.show({
    message: mensaje,
    icon: <FaCheck />,
    color: "green-nature",
    autoClose: defaultTimer,
    ...props
  });
};
export const showNegativeFeedbackNotification = (mensaje,props={}) => {
  notifications.show({
    message: mensaje,
    icon: <ImCross />,
    color: "red",
    autoClose: defaultTimer,
    ...props
  });
};

export const showInfoNotification = (mensaje,props={}) => {
  notifications.show({
    message: mensaje,
    icon: <ImInfo />,
    color: "blue-calm",
    autoClose: defaultTimer,
    
    
    ...props,
  });
};


