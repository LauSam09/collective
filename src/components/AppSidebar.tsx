import { CalendarDays, Search, Settings, ListCheck, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";

const items = [
  // TODO: Add a home page?
  //   {
  //     title: "Home",
  //     url: "/",
  //     icon: Home,
  //   },
  {
    title: "Shopping List",
    url: "/",
    icon: ListCheck,
  },
  {
    title: "Meal Planning",
    url: "/planning",
    icon: CalendarDays,
  },
  {
    title: "Recipes",
    url: "/recipes",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export interface AppSidebarProps {
  onOpenAddItem: () => void;
}

export const AppSidebar = ({ onOpenAddItem }: AppSidebarProps) => (
  <Sidebar className="dark:border-black">
    <SidebarContent>
      <SidebarHeader>
        <h1 className="text-2xl font-bold px-2">Collective</h1>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button onClick={onOpenAddItem}>
                  <Plus /> Add item
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);
