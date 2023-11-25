import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import "./index.css";
import FirebaseContextProvider from "./contexts/FirebaseContext";
import { ListContextProvider } from "./contexts/ListContext";
import { RecipeContextProvider } from "./contexts/RecipeContext";

const theme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
    useLocalStorage: false,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <FirebaseContextProvider>
          <AuthenticationProvider>
            <ListContextProvider>
              <RecipeContextProvider>
                <App />
              </RecipeContextProvider>
            </ListContextProvider>
          </AuthenticationProvider>
        </FirebaseContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
