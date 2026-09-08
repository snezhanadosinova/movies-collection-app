import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!loading && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search + location.hash,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
