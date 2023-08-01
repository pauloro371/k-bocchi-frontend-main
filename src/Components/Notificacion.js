import { notifications } from "@mantine/notifications";
import { onMessageListener } from "../utils/FirebaseMessaging/onMessage";

export default function Notificacion() {
  onMessageListener().then((payload) => {
    notifications.show({
      title: payload?.notification?.title,
      message: payload?.notification?.body,
    });
  });
}
