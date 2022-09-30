import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoutes = () => {
  // let auth = true;
  const navigate = useNavigate();
  let auth = true; //   const [loading, isLoading] = useState(false);
  const token: any = localStorage.getItem("token");
  const exp: any = localStorage.getItem("exp");

  if (Date.now() >= exp * 1000) {
    toast.error("Sua sessão expirou. Realize o login novamente");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("exp");
    auth = false;
    return <Navigate to="/login" />;
  }

  if (!exp || !token) {
    toast.error("Você deve realizar o login novamente");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("exp");
    auth = false;
    return <Navigate to="/login" />;
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
