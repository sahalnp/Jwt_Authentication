import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const {isAuthenticated} = useSelector((store) => store.user);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoute;