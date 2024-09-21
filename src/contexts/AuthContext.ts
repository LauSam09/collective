import { createContext, useContext } from "react";

export type AuthState = "unauthenticated" | "authenticated" | "registered";

export interface User {
  id: string;
  displayName: string;
  email: string;
}

export interface AuthContextType {
  state: AuthState;
  user: User | undefined;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  state: "unauthenticated",
  user: undefined,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);
