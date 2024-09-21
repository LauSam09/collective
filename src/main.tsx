import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AuthContextProvider } from "@/components";

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
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
