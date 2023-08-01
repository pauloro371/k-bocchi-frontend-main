import usuarioReducer from "./Features/Usuario/usuarioSlice";
import comentarioReducer from "./Features/Comentario/comentarioSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    usuario:usuarioReducer,
    comentarios:comentarioReducer
})

export default rootReducer;