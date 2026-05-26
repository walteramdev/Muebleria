import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../../auth/AuthContext";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/iniciar-sesion" replace />;
  }
  return children;
};

export default ProtectedRoute;
