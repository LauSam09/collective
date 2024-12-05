import { Route, Routes } from "react-router-dom";
import { NavBar, MobileNavBar, List } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

export const App = () => (
  <div>
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <NavBar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="/recipes" element={<>Recipes</>} />
            <Route path="/planning" element={<>Planning</>} />
            <Route path="/settings" element={<>Settings</>} />
          </Routes>
        </div>
        <MobileNavBar />
      </div>
    </SidebarProvider>
  </div>
);
