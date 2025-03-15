import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // carts 確保是陣列
  const carts = useSelector((state) => state.cart.carts) || [];

  // 預設不選任何付款方式
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = 50; // 固定運費

  // 如果購物車是空的，嘗試重新取得資料
  useEffect(() => {
    if (carts.length === 0) {
      const fetchCart = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
          dispatch(updateCartData(res.data.data));
        } catch (error) {
          console.error("無法獲取購物車資料", error);
        }
      };
      fetchCart();
    }
  }, [dispatch, carts.length]);

  // 送出付款請求（這裡不呼叫 API，直接導向付款成功頁面）
  const handlePayment = () => {
    if (carts.length === 0) {
      alert("購物車內沒有商品");
      return;
    }
    if (!selectedPayment) {
      alert("請先選擇付款方式");
      return;
    }

    setIsSubmitting(true);

    // 模擬付款成功，不進行 API 驗證
    dispatch(updateCartData([])); // 清空 Redux 購物車
    navigate("/checkout-success");
    setIsSubmitting(false);
  };

  // 計算小計
  const subtotal = carts.reduce(
    (acc, cartItem) => acc + cartItem.final_total,
    0
  );
  // 總計 = 小計 + 運費
  const total = subtotal + shippingFee;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h3 className="fw-bold mb-4 pt-3">選擇付款方式</h3>
        </div>
      </div>

      <div className="row flex-row-reverse justify-content-center pb-5">
        {/* 訂單資訊 */}
        <div className="col-md-4">
          <div className="border p-4 mb-4">
            {carts.length > 0 ? (
              carts.map((cartItem) => (
                <div className="d-flex mb-3" key={cartItem.id}>
                  <img
                    src={cartItem.product.imageUrl}
                    alt={cartItem.product.title}
                    className="me-2"
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="w-100">
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 fw-bold">{cartItem.product.title}</p>
                      <p className="mb-0">NT${cartItem.final_total}</p>
                    </div>
                    <p className="mb-0 fw-bold">x{cartItem.qty}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">購物車內沒有商品</p>
            )}

            {/* 運費 & 總計 */}
            <table className="table mt-4 border-top border-bottom text-muted">
              <tbody>
                <tr>
                  <th className="border-0 px-0 pt-4">小計</th>
                  <td className="text-end border-0 px-0 pt-4">NT${subtotal}</td>
                </tr>
                <tr>
                  <th className="border-0 px-0 pt-0 pb-4">運費</th>
                  <td className="text-end border-0 px-0 pt-0 pb-4">
                    NT${shippingFee}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-4">
              <p className="mb-0 h4 fw-bold">總計</p>
              <p className="mb-0 h4 fw-bold">NT${total}</p>
            </div>
          </div>
        </div>

        {/* 付款方式選擇 */}
        <div className="col-md-6">
          <div className="border p-3 mb-4">
            {/* 現金支付（貨到付款） */}
            <div className="form-check py-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="paymentCash"
                checked={selectedPayment === "cash"}
                onChange={() => setSelectedPayment("cash")}
              />
              <label className="form-check-label ms-2" htmlFor="paymentCash">
                現金支付（貨到付款）
              </label>
              {selectedPayment === "cash" && (
                <div className="mt-2 ps-4 text-muted">
                  您選擇了「貨到付款」。商品送達時再付現金給物流人員。
                </div>
              )}
            </div>
            <hr />

            {/* 信用卡支付 */}
            <div className="form-check py-2">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="paymentCredit"
                checked={selectedPayment === "credit"}
                onChange={() => setSelectedPayment("credit")}
              />
              <label className="form-check-label ms-2" htmlFor="paymentCredit">
                信用卡支付
              </label>
              {selectedPayment === "credit" && (
                <div className="mt-3 ps-4 text-muted">
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">
                      信用卡卡號
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cardExpire" className="form-label">
                      有效日期
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardExpire"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cardCVC" className="form-label">
                      CVC
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardCVC"
                      placeholder="三位數"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部按鈕區 */}
          <div className="d-flex justify-content-between mt-4">
            <Link to="/checkout-form" className="text-dark">
              <i className="fas fa-chevron-left me-2"></i> 返回結帳
            </Link>
            <button
              onClick={handlePayment}
              className="btn btn-dark py-3 px-7"
              disabled={isSubmitting}
            >
              {isSubmitting ? "付款中..." : "付款"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
