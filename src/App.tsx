import { Route, Routes } from "react-router-dom"
import { Box } from "@chakra-ui/react"

import Nav from "./components/Nav"
import { LoginPage } from "./pages/Login"
import { Protected } from "./components/Protected"
import { ListPage } from "./pages/List"
import "./App.css"

function App() {
  return (
    <div className="App">
      <Nav />
      <Box p={4} maxW={"800px"} mx="auto">
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <ListPage />
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
