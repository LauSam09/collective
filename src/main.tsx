import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import { AuthContextProvider } from "@/components";
import { queryClient } from "./react-query";

import "./index.css";

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
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
