import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

export default function AdminApp() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("isAuth");
    if (auth) {
      setIsAuth(true);
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  return isAuth ? (
    <div>
      <h2 className="text-center mt-4">管理後台</h2>
      <Outlet />
    </div>
  ) : (
    <LoginPage setIsAuth={setIsAuth} />
  );
}
