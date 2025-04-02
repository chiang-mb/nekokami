import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import NotFound from "../pages/NotFound";
import CheckoutFormPage from "../pages/CheckoutFormPage";
import CheckoutPaymentPage from "../pages/CheckoutPaymentPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";
import AboutPage from "../pages/AboutPage";
import DonationPage from "../pages/DonationPage";

// 後台
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/LoginPage";
import AdminProductPage from "../pages/AdminProductPage";
import AdminOrderPage from "../pages/AdminOrderPage";

const router = createHashRouter([
  // 前台路由
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "products", element: <ProductPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout-form", element: <CheckoutFormPage /> },
      { path: "checkout-payment", element: <CheckoutPaymentPage /> },
      { path: "checkout-success", element: <CheckoutSuccessPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "donation", element: <DonationPage /> },
    ],
  },

  // 後台路由
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "products", element: <AdminProductPage /> },
      { path: "orders", element: <AdminOrderPage /> },
      { path: "", element: <AdminProductPage /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
