import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

export const ProtectedRoute = ({ element, path }) => {
  const name = useSelector((state) => state.auth.name);
  console.log("in protected route");

  const elementToRender = name ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ path }} />
  );
  console.log(elementToRender);
  return <Route path={path} element={elementToRender} />;
};
