import {
  USUARIO_AUTORIZADO,
  USUARIO_LOGOUT,
  USUARIO_ACTUALIZAR
} from "../../Actions/actionsUsuario";

const initialState = {
  email: "",
  rol: "",
  nombre: "",
  isGmail: false,
};

export default function usuarioReducer(state = initialState, action) {
  switch (action.type) {
    case USUARIO_AUTORIZADO:
      return {
        ...action.payload,
      };
    case USUARIO_LOGOUT:
      return {
        ...initialState,
      };
    case USUARIO_ACTUALIZAR:{
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state;
  }
}
