import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { updateCartData } from "../../redux/cartSlice";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const routes = [
  { path: "/products", name: "貓紙社" },
  { path: "/donation", name: "貓神社" },
  { path: "/about", name: "關於我們" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cart.carts) || [];

  // 取得購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch (error) {
      console.error("取得購物車列表失敗", error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-between align-items-center">
        <NavLink className="navbar-brand fw-bold" to="/">
          NEKOKAMI
        </NavLink>

        {/* 手機版獨立購物車 */}
        <div className="d-flex align-items-center d-lg-none">
          <NavLink
            to="/cart"
            className="position-relative me-4"
            style={{ top: "5px" }}
          >
            <i className="fas fa-shopping-cart fs-4 text-dark"></i>
            {carts.length > 0 && (
              <span
                className="position-absolute badge bg-danger rounded-circle"
                style={{
                  top: "-12px",
                  right: "-15px",
                  fontSize: "12px",
                  padding: "5px 8px",
                }}
              >
                {carts.length}
              </span>
            )}
          </NavLink>

          {/* 漢堡選單按鈕 */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* 桌機版與手機版共用選單 */}
        <div
          className={`collapse navbar-collapse justify-content-end ${
            isMenuOpen ? "show" : ""
          }`}
        >
          <div className="navbar-nav">
            {routes.map((route) => (
              <NavLink
                key={route.path}
                className="nav-item nav-link me-4"
                to={route.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.name}
              </NavLink>
            ))}
            {/* 桌機版購物車（只在桌機顯示） */}
            <NavLink
              to="/cart"
              className="nav-item nav-link position-relative d-none d-lg-block"
            >
              <i className="fas fa-shopping-cart text-dark"></i>
              {carts.length > 0 && (
                <span
                  className="position-absolute badge bg-danger rounded-circle"
                  style={{
                    top: "-5px",
                    right: "-8px",
                    fontSize: "12px",
                    padding: "5px 8px",
                  }}
                >
                  {carts.length}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
