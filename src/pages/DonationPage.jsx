import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice"; // 引入 Redux action

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function DonationPage() {
  const [donationProducts, setDonationProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch(); // 用來更新 Redux 內的購物車數據

  useEffect(() => {
    const getDonationProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/products/all`
        );
        const filteredProducts = Object.values(res.data.products).filter(
          (product) => product.category === "奉納金"
        );
        setDonationProducts(filteredProducts);
      } catch {
        alert("取得奉納金產品失敗");
      } finally {
        setIsLoading(false);
      }
    };
    getDonationProducts();
  }, []);

  // 🚀 加入購物車的 API 請求 + Redux 更新購物車數據
  const addCartItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: { product_id, qty: Number(qty) },
      });

      // 重新獲取最新的購物車數據
      const cartRes = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(cartRes.data.data)); // 更新 Redux 內的購物車狀態

      // alert("已添加奉納金至購物車！");
    } catch {
      alert("加入購物車失敗");
    }
  };

  return (
    <div className="container mt-5">
      <h2
        className="text-center mb-4"
        style={{ color: "black", fontSize: "1.5rem" }}
      >
        貓神社 | NEKOKAMI
      </h2>
      <p className="text-center text-muted mb-4">
        您的奉納金將幫助更多貓咪，並獲得專屬回饋品！
      </p>

      {isLoading ? (
        <div className="d-flex justify-content-center">
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      ) : (
        <div className="row">
          {donationProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-5">
              <div className="card border-0 shadow-sm text-center p-3">
                <img
                  src={product.imageUrl}
                  className="card-img-top rounded mb-3"
                  alt={product.title}
                />
                <h5 className="mb-2">{product.title}</h5>
                <p className="text-muted">{product.description}</p>
                <strong className="text-danger">NT${product.price}</strong>
                <button
                  onClick={() => addCartItem(product.id, 1)}
                  className="btn btn-dark mt-3 mb-2"
                >
                  奉納支持
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
