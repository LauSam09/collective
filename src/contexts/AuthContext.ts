import { createContext, useContext } from "react";

export type AuthState = "unauthenticated" | "unregistered" | "registered";

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl: string | undefined;
  groupName: string;
  groupId: string;
  defaultListId: string;
}

export interface AuthContextType {
  user: User;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: {
    id: "",
    displayName: "",
    email: "",
    photoUrl: undefined,
    groupId: "",
    groupName: "",
    defaultListId: "",
  },
  signOut: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);
export const useUser = () => useAuth().user;
