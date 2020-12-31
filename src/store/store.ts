import { applyMiddleware, createStore, Middleware } from "redux"
import logger from "redux-logger"

import rootReducer from "./reducers"

let middleware: Middleware[] = []

if (process.env.NODE_ENV !== "production") {
  middleware = [...middleware, logger]
}

export default createStore(rootReducer, applyMiddleware(...middleware))
