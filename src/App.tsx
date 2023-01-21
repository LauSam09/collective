import { Route, Routes } from "react-router-dom"
import { Box } from "@chakra-ui/react"

import Nav from "./components/Nav"
import "./App.css"

function App() {
  return (
    <div className="App">
      <Nav />
      <Box p={4}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/recipes" element={<div>Recipes</div>} />
        </Routes>
      </Box>
    </div>
  )
}

export default App
