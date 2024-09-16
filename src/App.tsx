import { useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";

export const App = () => {
  console.log(app); //  TODO: This is a bodge to ensure the app is initialised. Need to find a better way to do this.
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

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>state: {state}</div>
      {state === "unauthenticated" && <button onClick={signIn}>Sign in</button>}
      {state === "authenticated" && <button onClick={signOut}>Sign out</button>}
    </div>
  );
};
