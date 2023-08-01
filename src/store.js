import { applyMiddleware, createStore } from "@reduxjs/toolkit";

import rootReducer from "./reducer";
import { LogMiddleware } from "./Features/LogMiddleware";

const middlewareEnhancer = applyMiddleware(LogMiddleware);

const store = createStore(rootReducer,middlewareEnhancer);
// const store = createStore(rootReducer,preloadedState);

export default store;
