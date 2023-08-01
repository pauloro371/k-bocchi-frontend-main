import axios from "axios";
import { BACKEND_SERVER } from "../server";

export const reestablecerContrasena = async (email) => {
  let response;
  try {
    response = axios.post(`${BACKEND_SERVER}/usuarios/reestablecerContrasena`, {
      email: email,
    });
  } catch (err) {
    response = err;
  }
  return response;
};
