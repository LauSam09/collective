import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthState, User } from "@/contexts";
import {
  getAuth,
  getFirestoreUser,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "@/firebase";

const auth = getAuth();

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState | "loading">("loading");
  const [user, setUser] = useState<User>();

  const handleAuthStateChanged = async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      setState("unauthenticated");
      return;
    }

    const firestoreUser = await getFirestoreUser(firebaseUser.uid);

    if (!firestoreUser) {
      setState("unregistered");
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoUrl: firebaseUser.photoURL ?? undefined,
      });
      return;
    }

    setState("registered");
    setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName!,
      photoUrl: firebaseUser.photoURL ?? undefined,
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);

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

  if (state === "unauthenticated") {
    return (
      <div>
        <button onClick={signIn}>Sign in</button>
      </div>
    );
  }

  if (state === "unregistered") {
    return (
      <div>
        Users have to be manually registered at present. Please contact the
        application developer if you would like to be registered.
      </div>
    );
  }

  if (!user) {
    return <h1>Collective</h1>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
