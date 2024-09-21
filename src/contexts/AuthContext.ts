import { createContext, useContext } from "react";

export type AuthState = "unauthenticated" | "unregistered" | "registered";

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl: string | undefined;
}

export interface AuthContextType {
  user: User;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: { id: "", displayName: "", email: "", photoUrl: undefined },
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);
