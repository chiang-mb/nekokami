import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";

import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [cart, setCart] = useState({});
  const [productsList, setProductsList] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const swiperRef = useRef(null);
  const recommendedSwiperRef = useRef(null);

  const dispatch = useDispatch();

  // 取得購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
      dispatch(updateCartData(res.data.data));
    } catch (error) {
      alert("取得購物車列表失敗");
    }
  };

  useEffect(() => {
    getCart();

    // 初始化原有的 Swiper（如果有其他滑動效果）
    new Swiper(swiperRef.current, {
      modules: [Autoplay],
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 3,
      spaceBetween: 10,
      breakpoints: {
        767: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }, []);

  // 取得所有產品（用於推薦）
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/products/all`
        );
        // 假設後端回傳的是物件，所以轉為陣列
        setProductsList(Object.values(res.data.products));
      } catch (error) {
        console.error("取得產品失敗", error);
      }
    };
    fetchProducts();
  }, []);

  // 推薦產品：排除已在購物車中的品項
  const recommendedProducts = productsList.filter((product) => {
    return !cart.carts?.some((cartItem) => cartItem.product.id === product.id);
  });

  // 初始化推薦產品的 Swiper
  useEffect(() => {
    if (recommendedSwiperRef.current && recommendedProducts.length > 0) {
      new Swiper(recommendedSwiperRef.current, {
        modules: [Autoplay],
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        slidesPerView: 2,
        spaceBetween: 10,
        breakpoints: {
          767: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
    }
  }, [recommendedProducts]);

  // 新增商品至購物車
  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: { product_id, qty: Number(qty) },
      });
      getCart(); // 更新購物車
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };

  // 清空整個購物車
  const removeCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert("刪除購物車失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 刪除購物車某項商品
  const removeCartItem = async (cartItem_id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
      setCart(res.data.data);
    } catch (error) {
      alert("刪除購物車品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 更新購物車某項商品的數量
  const updateCartItem = async (cartItem_id, product_id, qty) => {
    if (qty <= 0) {
      // 如果數量 <= 0，則從購物車移除該商品
      removeCartItem(cartItem_id);
      return;
    }

    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Math.max(1, qty), // 確保數量不會低於 1
        },
      });

      getCart(); // 更新購物車
    } catch (error) {
      alert("更新購物車品項失敗");
    }
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="mt-3">
          <h3 className="mt-3 mb-4">購物車</h3>
          <div className="row">
            <div className="col-md-8 mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 ps-0">
                      產品名稱
                    </th>
                    <th scope="col" className="border-0">
                      數量
                    </th>
                    <th scope="col" className="border-0">
                      價格
                    </th>
                    <th scope="col" className="border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts?.map((cartItem) => (
                    <tr key={cartItem.id} className="border-bottom border-top">
                      <th scope="row" className="border-0 px-0 fw-normal py-4">
                        <img
                          src={cartItem.product.imageUrl}
                          alt=""
                          style={{
                            width: "72px",
                            height: "72px",
                            objectFit: "cover",
                          }}
                        />
                        <p className="mb-0 fw-bold ms-3 d-inline-block">
                          {cartItem.product.title}
                        </p>
                      </th>
                      <td
                        className="border-0 align-middle"
                        style={{ maxWidth: "160px" }}
                      >
                        <div className="input-group pe-5">
                          <button
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product.id,
                                cartItem.qty - 1
                              )
                            }
                            className="btn btn-outline-dark border-0 py-2"
                            type="button"
                            disabled={cartItem.qty <= 1}
                            id="button-addon1"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input
                            type="text"
                            className="form-control border-0 text-center my-auto shadow-none"
                            value={cartItem.qty}
                            readOnly
                          />
                          <button
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product.id,
                                cartItem.qty + 1
                              )
                            }
                            className="btn btn-outline-dark border-0 py-2"
                            type="button"
                            id="button-addon2"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="border-0 align-middle">
                        <p className="mb-0 ms-auto">{cartItem.final_total}</p>
                      </td>
                      <td className="border-0 align-middle">
                        <button
                          onClick={() => removeCartItem(cartItem.id)}
                          className="btn btn-outline-dark border-0 py-2"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-4">
              <div className="border p-4 mb-4">
                <h4 className="fw-bold mb-4">訂單資訊</h4>
                <table className="table text-muted border-bottom">
                  <tbody>
                    <tr>
                      <th className="border-0 px-0 pt-4 fw-normal">小計</th>
                      <td className="text-end border-0 px-0 pt-4">
                        NT${cart.total}
                      </td>
                    </tr>
                    <tr>
                      <th className="border-0 px-0 pt-0 pb-4 fw-normal">
                        運費
                      </th>
                      <td className="text-end border-0 px-0 pt-0 pb-4">
                        NT$50
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-flex justify-content-between mt-4">
                  <p className="mb-0 h4 fw-bold">總計</p>
                  <p className="mb-0 h4 fw-bold">NT${cart.final_total + 50}</p>
                </div>
                <Link to="/checkout-form" className="btn btn-dark w-100 mt-4">
                  結帳
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 推薦產品區塊 */}
        {recommendedProducts.length > 0 && (
          <div className="my-4">
            <h4 className="text-center mb-4">其他產品推薦</h4>
            <div ref={recommendedSwiperRef} className="swiper-container mb-5">
              <div className="swiper-wrapper">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="swiper-slide">
                    <div className="card">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="card-body text-center">
                        <h6 className="card-title">{product.title}</h6>
                        <p className="card-text">NT${product.price}</p>
                        <button
                          className="btn btn-dark"
                          onClick={() => addCartItem(product.id, 1)}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}
