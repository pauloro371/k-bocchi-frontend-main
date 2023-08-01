import { ADD_COMENTARIO } from "../../Actions/actionsComment";
const initialState = [{ contenido: "", fecha: "" }];

export default function comentarioReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_COMENTARIO:
      return [...state, { ...action.payload }];

    default:
      return state;
  }
}
