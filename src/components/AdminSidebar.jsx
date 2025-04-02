import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/admin/login");
  };

  return (
    <nav
      className="bg-dark text-white p-4"
      style={{ minWidth: "200px", minHeight: "100vh" }}
    >
      <h2 className="h5 mb-4">管理後台</h2>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link
            to="/admin/products"
            className={`text-decoration-none ${
              location.pathname.includes("/admin/products")
                ? "text-warning fw-bold"
                : "text-white"
            }`}
          >
            產品管理
          </Link>
        </li>
        <li className="mb-3">
          <Link
            to="/admin/orders"
            className={`text-decoration-none ${
              location.pathname.includes("/admin/orders")
                ? "text-warning fw-bold"
                : "text-white"
            }`}
          >
            訂單管理
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light w-100"
          >
            登出
          </button>
        </li>
      </ul>
    </nav>
  );
}
