import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthState } from "@/contexts";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@/firebase";

const auth = getAuth();

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState | "loading">("loading");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setState("authenticated");
      } else {
        setState("unauthenticated");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  if (state === "loading") {
    return <h1>Collective</h1>;
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        user: undefined,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
