import { Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import MobileNav from "@/components/MobileNav";
import Nav from "@/components/Nav";
import { LoginPage } from "@/pages/Login";
import { Protected } from "@/components/Protected";
import { ListPage } from "@/pages/List";
import { RecipesPage } from "@/pages/Recipes";
import { PlanningPage } from "@/pages/Planning";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Nav />
      <Box p={4} maxW="800px" mx="auto" pb={{ base: 20, sm: 0 }}>
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
                <RecipesPage />
              </Protected>
            }
          />
          <Route
            path="/planning"
            element={
              <Protected>
                <PlanningPage />
              </Protected>
            }
          />
        </Routes>
      </Box>
      <MobileNav />
    </div>
  );
}

export default App;
