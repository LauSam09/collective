import { AvatarFallback } from "@radix-ui/react-avatar";

import { useAuth } from "@/contexts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { version } from "../../package.json";

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <>
      <div className="px-4 sticky z-[49] top-0 bg-sidebar">
        <div className="h-16 flex items-center justify-between">
          <SidebarTrigger />
          {/* TODO: Readd app title for mobile-only? */}

          {/* TODO: Factor out user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.photoUrl} referrerPolicy="no-referrer" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0">
                  <span>{user.displayName}</span>
                  <span className="font-normal">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex justify-end">
                <span className="text-xs">Version {version}</span>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
