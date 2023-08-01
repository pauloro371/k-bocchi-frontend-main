import axios from "axios";
import { showErrorConexionNotification } from "../utils/notificationTemplate";
import { BACKEND_SERVER } from "../server";

axios.defaults.timeout = 120000;
axios.defaults.baseURL = BACKEND_SERVER;
axios.interceptors.response.use(
  function (response) {
    console.log("Se hizo la petición con un status 2xx");
    console.debug()
    console.log(response);
    return response;
  },
  function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("La petición se realizo con un status fuera de 2xx: ",{...error.response});
      return Promise.reject(error);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log("No se pudo hacer la request: ",error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Fallo el setup de la request: ",error.message);
    }
    showErrorConexionNotification();
    console.log(error.config);
    return Promise.reject(null);
  }
);
