import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUsuario } from "../usuarioHooks";

export const checkToken = async (id_usuario,setTokenFound=()=>{}) => {
  try {
    let currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_WEB_CREDENTIALS_FCM,
    });
    if (currentToken) {
      console.log("current token for client: ", currentToken);
      await axios.post("/fcmtokens", {
        token: currentToken,
        id_usuario,
      });
      if (setTokenFound) setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      if (setTokenFound) setTokenFound(false);
      // shows on the UI that permission is required
    }
  } catch (err) {
    if (setTokenFound) setTokenFound(false);
    console.log("An error occurred while retrieving token. ", err);
    // catch error while creating client token
  }
};
