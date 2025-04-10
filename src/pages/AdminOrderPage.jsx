import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import Toast from "../components/Toast";
import Pagination from "../components/Pagination";
import AdminSidebar from "../components/AdminSidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminOrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");
    if (!isAuth) {
      navigate("/admin/login");
      return;
    }
    getOrders(); // 預設取得第一頁訂單
  }, [navigate]);

  // 取得訂單資料（支援分頁）
  const getOrders = async (page = 1) => {
    if (!axios.defaults.headers.common["Authorization"]) {
      const match = document.cookie.match(new RegExp("(^| )hexToken=([^;]+)"));
      const token = match ? match[2] : null;
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
      } else {
        return;
      }
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/orders?page=${page}`
      );
      setOrders(res.data.orders);
      setPageInfo(res.data.pagination);
    } catch {
      alert("取得訂單失敗");
    }
  };

  // 切換分頁
  const handlePageChange = (page) => {
    getOrders(page);
  };

  // 刪除單筆訂單
  const deleteOrder = async (orderId) => {
    const isConfirmed = window.confirm("確定要刪除這筆訂單嗎？");

    if (!isConfirmed) return;

    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/order/${orderId}`
      );
      dispatch(pushMessage({ text: "刪除訂單成功！", status: "success" }));
      getOrders();
    } catch {
      alert("刪除訂單失敗");
    }
  };
  // 切換訂單狀態（paid）
  const updateOrderStatus = async (orderId, currentPaid) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, is_paid: !currentPaid } : order
        )
      );

      const updatedData = {
        data: {
          is_paid: !currentPaid,
        },
      };

      await axios.put(
        `${BASE_URL}/v2/api/${API_PATH}/admin/order/${orderId}`,
        updatedData
      );

      getOrders();
    } catch {
      alert("更新訂單狀態失敗");
    }
  };

  // 時間格式化
  const formatTime = (timestamp) => {
    const time = new Date(timestamp * 1000);
    return time.toLocaleString("zh-TW", { hour12: false });
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      {/* 右側內容 */}
      <div className="container-fluid p-4">
        <h2 className="mb-4">訂單管理</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>訂單編號</th>
                  <th>用戶資訊</th>
                  <th>寄送地址</th>
                  <th>電子信箱</th>
                  <th>產品明細</th>
                  <th>下單時間</th>
                  <th>訂單狀態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <p>{order.user.name}</p>
                      <p>{order.user.tel}</p>
                    </td>
                    <td>{order.user.address}</td>
                    <td>{order.user.email}</td>
                    <td>
                      {order.products &&
                      Object.keys(order.products).length > 0 ? (
                        Object.entries(order.products).map(([key, product]) => (
                          <p key={key}>
                            {product.product.title} x {product.qty}
                          </p>
                        ))
                      ) : (
                        <span>無產品資料</span>
                      )}
                    </td>
                    <td>{formatTime(order.create_at)}</td>
                    <td>
                      <button
                        onClick={() =>
                          updateOrderStatus(order.id, order.is_paid)
                        }
                        className="btn btn-link"
                      >
                        {order.is_paid ? (
                          <span className="text-success fw-bold">已處理</span>
                        ) : (
                          <span className="text-danger">未處理</span>
                        )}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分頁組件 */}
            <div className="mt-4">
              <Pagination
                pageInfo={pageInfo}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        <Toast />
      </div>
    </div>
  );
}
