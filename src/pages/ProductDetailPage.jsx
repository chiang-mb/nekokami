import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);

  const { id: product_id } = useParams();
  const dispatch = useDispatch();

  // 取得購物車，確保 Redux cart 數據最新
  const getCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch {
      alert("取得購物車列表失敗");
    }
  }, [dispatch]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  // 取得單一產品資料
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch {
        alert("取得產品失敗");
      }
    };
    getProduct();
  }, [product_id]);

  // 加入購物車
  const addCartItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart(); // 更新購物車
      // alert("加入購物車成功");
    } catch {
      alert("加入購物車失敗");
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="row align-items-center">
          {/* 左側：單張產品圖片 */}
          <div className="col-md-7 mt-3">
            <img
              src={product.imageUrl}
              className="d-block w-100"
              alt={product.title}
            />
          </div>

          {/* 右側：產品資訊、麵包屑、加入購物車 */}
          <div className="col-md-5">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-white px-0 mb-0 py-3">
                <li className="breadcrumb-item">
                  <Link className="text-muted" to="/">
                    首頁
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link className="text-muted" to="/products">
                    貓紙社
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  詳細資訊
                </li>
              </ol>
            </nav>

            <h2 className="fw-bold h1 mb-1">{product.title}</h2>
            <p className="mb-0 text-muted text-end">
              <del>NT${product.origin_price?.toLocaleString()}</del>
            </p>
            <p className="h4 fw-bold text-end">
              NT${product.price?.toLocaleString()}
            </p>

            <div className="row align-items-center">
              {/* 數量調整 */}
              <div className="col-6">
                <div className="input-group my-3 bg-light rounded">
                  <button
                    onClick={() =>
                      setQtySelect((prev) => Math.max(1, prev - 1))
                    }
                    className="btn btn-outline-dark border-0 py-2"
                    type="button"
                    disabled={qtySelect === 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control border-0 text-center my-auto shadow-none bg-light"
                    value={qtySelect}
                    readOnly
                  />
                  <button
                    onClick={() => setQtySelect((prev) => prev + 1)}
                    className="btn btn-outline-dark border-0 py-2"
                    type="button"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              {/* 加入購物車按鈕 */}
              <div className="col-6">
                <button
                  onClick={() => addCartItem(product.id, qtySelect)}
                  type="button"
                  className="text-nowrap btn btn-dark w-100 py-2"
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 產品描述 */}
        <div className="row my-3">
          <div className="col-md-7">
            <p style={{ whiteSpace: "pre-wrap" }}>{product.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
