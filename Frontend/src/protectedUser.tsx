import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user} = useContext(AdminContext);
  console.log(user, "user for user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
