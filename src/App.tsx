import { Route, Routes } from "react-router-dom"
import { Box } from "@chakra-ui/react"

import Nav from "./components/Nav"
import "./App.css"
import { LoginPage } from "./pages/Login"
import { Protected } from "./components/Protected"

function App() {
  return (
    <div className="App">
      <Nav />
      <Box p={4}>
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <div>Home</div>
              </Protected>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/recipes"
            element={
              <Protected>
                <div>Recipes</div>
              </Protected>
            }
          />
        </Routes>
      </Box>
    </div>
  )
}

export default App
