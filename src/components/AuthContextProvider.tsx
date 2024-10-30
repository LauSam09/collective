import { useEffect, useState, ReactNode } from "react";
import { AuthContext, AuthState, User } from "@/contexts";
import { getAuth, getFirestoreUser, User as FirebaseUser } from "@/firebase";
import { SignIn } from "./SignIn";
import { CircularProgress, HStack, Stack } from "@chakra-ui/react";

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
      return;
    }

    setState("registered");
    setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName!,
      photoUrl: firebaseUser.photoURL ?? undefined,
      groupName: firestoreUser.group.name,
      groupId: firestoreUser.group.id,
      defaultListId: firestoreUser.group.defaultList,
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  if (state === "loading") {
    return (
      <HStack minW="100vw" justifyContent="center">
        <Stack minH="100vh" justifyContent="center">
          <CircularProgress isIndeterminate />
        </Stack>
      </HStack>
    );
  }

  if (state === "unauthenticated") {
    return <SignIn />;
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
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
