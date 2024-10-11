import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { NavBar, MobileNavBar, List } from "@/components";

export const App = () => (
  <div>
    <NavBar />
    <Box p={4}>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/recipes" element={<>Recipes</>} />
        <Route path="/planning" element={<>Planning</>} />
        <Route path="/settings" element={<>Settings</>} />
      </Routes>
    </Box>
    <MobileNavBar />
  </div>
);
