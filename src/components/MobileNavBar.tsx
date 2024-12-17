import { CalendarDays, ListCheck, Plus, Search, Settings } from "lucide-react";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Button } from "./ui/button";

type MobileNavBarProps = {
  onOpenAddItem: () => void;
};

export const MobileNavBar = ({ onOpenAddItem }: MobileNavBarProps) => (
  <div className="sm:hidden">
    {/* Prevent mobile nav bar from overlapping content at bottom of screen */}
    <div className="py-7" />
    <div className="fixed bottom-0 p-1 w-full bg-sidebar">
      <div className="flex items-stretch gap-1">
        <MobileNavLink to="/">
          <ListCheck />
        </MobileNavLink>

        <MobileNavLink to="/planning">
          <CalendarDays />
        </MobileNavLink>

        <QuickAddButton onClick={onOpenAddItem} />

        <MobileNavLink to="/recipes">
          <Search />
        </MobileNavLink>

        <MobileNavLink to="/settings">
          <Settings />
        </MobileNavLink>
      </div>
    </div>
  </div>
);

type MobileNavLinkProps = Pick<NavLinkProps, "to"> & {
  children: React.ReactNode;
};

const MobileNavLink = ({ to, children }: MobileNavLinkProps) => (
  <NavLink
    to={to}
    className={() => "flex flex-1 flex-col items-center justify-center py-0.5"}
  >
    <Button variant="secondary" className="w-full h-full">
      {children}
    </Button>
  </NavLink>
);

type QuickAddButtonProps = {
  onClick: () => void;
};

const QuickAddButton = ({ onClick }: QuickAddButtonProps) => (
  <Button
    onClick={onClick}
    className="flex flex-1 flex-col items-center justify-center py-0.5 min-h-12"
  >
    <Plus />
  </Button>
);
