import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@/firebase";
import { NavBar } from "@/components";

export const App = () => {
  const [state, setState] = useState<
    "loading" | "unauthenticated" | "authenticated"
  >("loading");
  const auth = getAuth();

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

  if (state === "loading") {
    return <h1>Collective</h1>;
  }

  if (state === "unauthenticated") {
    return (
      <div>
        <button onClick={signIn}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
    </div>
  );
};
