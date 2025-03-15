import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;

      // 存入 Cookie
      document.cookie = `hexToken=${token}; expires=${new Date(
        expired
      )}; path=/`;
      axios.defaults.headers.common["Authorization"] = token;

      // 存入 LocalStorage，標記為已登入
      localStorage.setItem("isAuth", "true");

      // 轉向管理頁面
      navigate("/admin");
    } catch (error) {
      console.error("登入失敗：", error.response?.data || error);
      alert("登入失敗，請檢查帳號密碼");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {/* Logo */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">NEKOKAMI 後台登入</h2>
      </div>

      {/* 登入卡片 */}
      <div className="card p-4 shadow-sm border-0" style={{ width: "360px" }}>
        <h4 className="text-center fw-bold mb-4">請先登入</h4>

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating">
            <input
              name="username"
              value={account.username}
              onChange={handleInputChange}
              type="email"
              className="form-control"
              id="username"
              placeholder="name@example.com"
              required
            />
            <label htmlFor="username">Email address</label>
          </div>

          <div className="form-floating">
            <input
              name="password"
              value={account.password}
              onChange={handleInputChange}
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <button className="btn btn-dark w-100 py-2 fw-bold">登入</button>
        </form>
      </div>

      {/* 版權資訊 */}
      <p className="mt-4 mb-3 text-muted small">&copy; 2025~∞ - NEKOKAMI</p>
    </div>
  );
}
