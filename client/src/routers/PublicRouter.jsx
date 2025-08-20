import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PublicRoute = ({ children }) => {
  const {isAuthenticated} = useSelector((store) => store.user);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
export default PublicRoute;
