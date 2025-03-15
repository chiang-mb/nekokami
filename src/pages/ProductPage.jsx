import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link, useSearchParams } from "react-router-dom"; // import useSearchParams
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams(); // 取得 URL 查詢參數

  useEffect(() => {
    const getAllProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/products/all`
        );
        const filteredProducts = Object.values(res.data.products).filter(
          (product) => product.category !== "奉納金"
        );
        setAllProducts(filteredProducts);
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsLoading(false);
      }
    };
    getAllProducts();
  }, []);

  // 讀取 URL 中的 ?category=xxx，若存在就更新 selectedCategory
  useEffect(() => {
    const categoryFromURL = searchParams.get("category");
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [searchParams]);

  // 加入購物車
  const addCartItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: { product_id, qty: Number(qty) },
      });
      const cartRes = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(cartRes.data.data));
      // alert("已成功加入購物車！");
    } catch (error) {
      alert("加入購物車失敗");
    }
  };

  const categories = [
    "全部",
    ...new Set(allProducts.map((product) => product.category)),
  ].filter((category) => category !== "奉納金");

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "全部") return true;
    return product.category === selectedCategory;
  });

  return (
    <div className="container mt-5">
      <h2
        className="text-center mb-4"
        style={{ color: "black", fontSize: "1.5rem" }}
      >
        貓紙社 | NEKOKAMI
      </h2>
      <p className="text-center text-muted mb-4">
        探索我們為貓咪打造的獨特包裝與商品！
      </p>

      {/* 分類按鈕 */}
      <div className="text-center mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn btn-outline-dark me-2 ${
              selectedCategory === category ? "active" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center">
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-5">
              <div className="card border-0 shadow-sm text-center p-3">
                <img
                  src={product.imageUrl}
                  className="card-img-top rounded mb-3"
                  alt={product.title}
                />
                <h5
                  className="mb-2"
                  style={{ color: "black", fontSize: "1.2rem" }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {product.title}
                  </Link>
                </h5>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {product.description}
                </p>
                <strong className="text-danger" style={{ fontSize: "1.2rem" }}>
                  NT${product.price}
                </strong>
                <div className="mt-3">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-outline-dark me-2 mb-1"
                  >
                    查看詳細
                  </Link>
                  <button
                    onClick={() => addCartItem(product.id, 1)}
                    className="btn btn-dark mb-1"
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
