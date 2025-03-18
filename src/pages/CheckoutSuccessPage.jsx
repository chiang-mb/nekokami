import { useNavigate } from "react-router-dom";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {/* 桌面版背景圖 */}
        <img
          src="/nekokami/images/banner.jpg"
          alt="NEKOKAMI Banner Desktop"
          className="position-absolute w-100 h-100 d-none d-md-block"
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: -1 }}
        />

        {/* 手機版背景圖 */}
        <img
          src="/nekokami/images/banner-mobile.jpg"
          alt="NEKOKAMI Banner Mobile"
          className="position-absolute w-100 h-100 d-block d-md-none"
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: -1 }}
        />

        {/* 暗色 Overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            top: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        ></div>

        {/* 文字內容 */}
        <div className="position-relative text-center text-white">
          <small className="d-block mb-2" style={{ letterSpacing: "1px" }}>
            THANK YOU (=´ᴥ`)ﾉ
          </small>
          <h1 className="display-4 mb-3">感謝您的購買與支持！</h1>
          <p className="lead mb-4">
            訂單已成功送出，我們將盡快處理出貨並通知您物流資訊。
          </p>
          <button
            className="btn btn-outline-light btn-lg rounded-0"
            style={{ fontWeight: "bold" }}
            onClick={() => navigate("/")}
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
