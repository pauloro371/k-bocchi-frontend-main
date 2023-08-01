import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase';
import { notifications } from '@mantine/notifications';



export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      notifications.show({
        title: payload?.notification?.title,
        message: payload?.notification?.body,
      });
      resolve(payload);
    });
  });