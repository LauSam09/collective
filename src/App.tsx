import { Route, Routes } from "react-router-dom";
import { NavBar, MobileNavBar, List, Recipes } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { useState } from "react";
import { AddItemModal } from "./components/List/AddItemModal";

export const App = () => {
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full dark:bg-neutral-800">
          <NavBar />
          <div className="p-4">
            <Routes>
              <Route path="/" element={<List />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/planning" element={<>Planning</>} />
              <Route path="/settings" element={<>Settings</>} />
            </Routes>
          </div>
          <MobileNavBar onOpenAddItem={() => setAddItemModalOpen(true)} />
        </div>
      </SidebarProvider>
      <AddItemModal
        open={addItemModalOpen}
        onOpenChange={setAddItemModalOpen}
      />
    </div>
  );
};
