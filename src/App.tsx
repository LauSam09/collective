import { NavBar } from "@/components";
import { useAuth } from "@/contexts";

export const App = () => {
  const { state, signIn } = useAuth();

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
