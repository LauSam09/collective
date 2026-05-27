import { getAuth, GoogleAuthProvider, signInWithPopup } from "@/firebase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const auth = getAuth();

export const SignIn = () => {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center">
      <div className="p-4 flex justify-center w-full">
        <Card>
          <CardHeader>
            <CardTitle>Collective</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p>Welcome to Collective - the recipe planning application.</p>
              <p>Sign in to get started.</p>
              <Button onClick={signIn}>Sign in with Google</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
