import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import ScrollToTop from "../components/ScrollToTop";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (!token) {
      navigate("/admin/login");
      return;
    }

    // 重整時補上 token
    axios.defaults.headers.common["Authorization"] = token;

    // 驗證 token 是否有效
    axios.post(`${BASE_URL}/v2/api/user/check`).catch(() => {
      alert("登入驗證失敗，請重新登入");
      navigate("/admin/login");
    });
  }, [navigate]);

  return (
    <>
      <ScrollToTop />
      <div className="admin-container">
        <header className="admin-header"></header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
