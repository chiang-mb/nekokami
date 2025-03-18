import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateCartData } from "../redux/cartSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CheckoutFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart); // ✅ Redux 購物車完整對象
  const carts = cart?.carts || []; // ✅ 確保 carts 是陣列
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // **確保購物車最新**
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
        dispatch(updateCartData(res.data.data)); // 更新 Redux 購物車狀態
      } catch (error) {
        console.error("購物車載入失敗", error);
      }
    };

    if (carts.length === 0) {
      fetchCart(); // **如果購物車是空的，重新請求 API**
    }
  }, [dispatch, carts.length]);

  // **送出訂單**
  const onSubmit = async (data) => {
    if (carts.length === 0) {
      alert("購物車內沒有商品");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.phone,
            address: data.address,
          },
          message: data.message,
        },
      };

      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, orderData);

      reset(); // 清空表單
      navigate("/checkout-payment");
    } catch {
      alert("結帳失敗，請稍後再試！");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h3 className="fw-bold mb-4 pt-3">填寫結帳資訊</h3>
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
                  <td className="text-end border-0 px-0 pt-4">
                    NT$
                    {carts.reduce(
                      (acc, cartItem) => acc + cartItem.final_total,
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="border-0 px-0 pt-0 pb-4">運費</th>
                  <td className="text-end border-0 px-0 pt-0 pb-4">
                    NT$50 {/* 這裡可以動態計算，例如滿額免運 */}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-4">
              <p className="mb-0 h4 fw-bold">總計</p>
              <p className="mb-0 h4 fw-bold">
                NT$
                {carts.reduce(
                  (acc, cartItem) => acc + cartItem.final_total,
                  0
                ) + 50}
              </p>
            </div>
          </div>
        </div>

        {/* 填寫表單 */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="text-muted mb-0">Email</label>
              <input
                type="email"
                className="form-control"
                {...register("email", {
                  required: "Email 為必填",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "請輸入有效的 Email",
                  },
                })}
              />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
            <div className="mb-3">
              <label className="text-muted mb-0">姓名</label>
              <input
                type="text"
                className="form-control"
                {...register("name", { required: "請輸入姓名" })}
              />
              <p className="text-danger">{errors.name?.message}</p>
            </div>
            <div className="mb-3">
              <label className="text-muted mb-0">手機號碼</label>
              <input
                type="text"
                className="form-control"
                {...register("phone", {
                  required: "手機號碼為必填",
                  pattern: {
                    value: /^09\d{8}$/,
                    message: "請輸入正確的手機號碼格式（09xxxxxxxx）",
                  },
                })}
              />
              <p className="text-danger">{errors.phone?.message}</p>
            </div>
            <div className="mb-3">
              <label className="text-muted mb-0">地址</label>
              <input
                type="text"
                className="form-control"
                {...register("address", { required: "請輸入地址" })}
              />
              <p className="text-danger">{errors.address?.message}</p>
            </div>
            <div className="mb-3">
              <label className="text-muted mb-0">留言（選填）</label>
              <textarea
                className="form-control"
                rows="3"
                {...register("message")}
              ></textarea>
            </div>

            {/* 下一步 */}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/cart" className="text-dark">
                <i className="fas fa-chevron-left me-2"></i> 返回購物車
              </Link>
              <button
                type="submit"
                className="btn btn-dark py-3 px-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "提交中..." : "確認結帳"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
