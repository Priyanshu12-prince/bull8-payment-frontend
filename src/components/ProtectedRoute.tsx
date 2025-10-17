import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children, loading }: { children: JSX.Element, loading?: boolean }) => {
  const { isAuthenticated } = useUser();
  if (loading) return children; // don't redirect yet
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ message: "Please authorize to continue" }}
      />
    );
  }
  return children;
};

export default ProtectedRoute;
