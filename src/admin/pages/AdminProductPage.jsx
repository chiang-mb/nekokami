import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";
import Toast from "../components/Toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

export default function AdminProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    if (!isAuth) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品失敗");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  };

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    setTempProduct(mode === "edit" ? product : defaultModalState);
    setIsProductModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/admin/login");
  };

  return (
    <div className="d-flex">
      {/* 左側側邊選單 */}
      <nav
        className="bg-dark text-white p-4"
        style={{ minWidth: "200px", minHeight: "100vh" }}
      >
        <h2 className="h5 mb-4">管理後台</h2>
        <ul className="list-unstyled">
          <li className="mb-3">
            <Link
              to="/admin/products"
              className="text-white text-decoration-none"
            >
              產品管理
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/admin/orders"
              className="text-white text-decoration-none"
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

      {/* 右側內容 */}
      <div className="container-fluid p-4">
        <h2 className="mb-4">產品管理</h2>

        <div className="d-flex justify-content-end mb-3">
          <button
            onClick={() => handleOpenProductModal("create")}
            className="btn btn-dark"
          >
            新增產品
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success fw-bold">啟用</span>
                      ) : (
                        <span className="text-muted">未啟用</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenProductModal("edit", product)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleOpenDelProductModal(product)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <Pagination pageInfo={pageInfo} handlePageChange={getProducts} />
        </div>

        <ProductModal
          tempProduct={tempProduct}
          getProducts={getProducts}
          modalMode={modalMode}
          isOpen={isProductModalOpen}
          setIsOpen={setIsProductModalOpen}
        />
        <DelProductModal
          tempProduct={tempProduct}
          isOpen={isDelProductModalOpen}
          setIsOpen={setIsDelProductModalOpen}
          getProducts={getProducts}
        />
        <Toast />
      </div>
    </div>
  );
}
