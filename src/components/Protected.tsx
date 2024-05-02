import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthentication } from "@/hooks";

type ProtectedProps = {
  children: ReactNode;
};

export const Protected = ({ children }: ProtectedProps) => {
  const { state } = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (state === "Unauthenticated") {
      navigate("/login", { state: { from: location } });
    }
  }, [state]);

  return <>{children}</>;
};
