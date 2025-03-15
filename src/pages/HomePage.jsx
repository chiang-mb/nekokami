import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/products/all`
        );
        setAllProducts(Object.values(res.data.products));
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsLoading(false);
      }
    };
    getAllProducts();
  }, []);

  // 加入購物車 (若未使用可自行刪除)
  const addCartItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: { product_id, qty: Number(qty) },
      });
      const cartRes = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(cartRes.data.data));
      alert("已成功加入購物車！");
    } catch (error) {
      alert("加入購物車失敗");
    }
  };

  // 導向 /products?category=xxx
  const goToCategory = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  // 從 allProducts 中各取一個包裝紙 / 明信片 / 海報
  const packagingPaper = allProducts.find((p) => p.category === "包裝紙");
  const postcard = allProducts.find((p) => p.category === "明信片");
  const poster = allProducts.find((p) => p.category === "海報");

  return (
    <div>
      {/* ========== 形象 Banner ========== */}
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        {/* 桌面版 Banner */}
        <img
          src="/nekokami/images/banner.jpg"
          alt="NEKOKAMI Banner Desktop"
          className="position-absolute w-100 h-100 d-none d-md-block"
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: -1 }}
        />

        {/* 手機版 Banner */}
        <img
          src="/nekokami/images/banner-mobile.jpg"
          alt="NEKOKAMI Banner Mobile"
          className="position-absolute w-100 h-100 d-block d-md-none"
          style={{ objectFit: "cover", top: 0, left: 0, zIndex: -1 }}
        />

        {/* 暗色 Overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>

        {/* 文字內容 */}
        <div className="position-relative text-center text-white">
          <small className="d-block mb-2" style={{ letterSpacing: "1px" }}>
            貓紙社 | 貓神社
          </small>
          <h1 className="display-4 mb-3 fw-bold">N E K O K A M I</h1>
          <p className="lead mb-4">目光所及都有貓，心裡滿滿都是貓</p>
          <button
            className="btn btn-outline-light btn-lg rounded-0"
            style={{ fontWeight: "bold" }}
            onClick={() => navigate("/about")}
          >
            了解我們
          </button>
        </div>
      </div>

      {/* ========== 貓紙社：交錯式三分類 ========== */}
      <div className="container my-5">
        {/* <h2 className="text-center mb-5">貓紙社</h2> */}

        {isLoading ? (
          <div className="d-flex justify-content-center">
            <ReactLoading
              type="spin"
              color="black"
              width="4rem"
              height="4rem"
            />
          </div>
        ) : (
          <>
            {/* --- 包裝紙 --- */}
            {packagingPaper && (
              <div className="row align-items-center mb-5">
                {/* 左側：圖片 */}
                <div className="col-md-6 mb-4 mb-md-0">
                  <div className="overflow-hidden hover-zoom-container rounded">
                    <img
                      src={packagingPaper.imageUrl}
                      alt={packagingPaper.title}
                      className="img-fluid hover-zoom"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToCategory("包裝紙")}
                    />
                  </div>
                </div>

                {/* 右側：白色區塊，內容置中 */}
                <div className="col-md-6">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center h-100 p-4"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <h3 className="mb-3">{"包裝紙"}</h3>
                    <p className="text-muted text-center mb-4">
                      {packagingPaper.description ||
                        "嚴選高品質紙材，適用於禮品包裝、手工藝品及文創商品。細緻印刷與高耐久性設計，包裝不僅美觀，更具收藏價值。"}
                    </p>
                    <button
                      className="btn btn-dark"
                      onClick={() => goToCategory("包裝紙")}
                    >
                      選購
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- 明信片（反轉排版） --- */}
            {postcard && (
              <div className="row align-items-center mb-5 flex-row-reverse">
                {/* 右側：圖片 */}
                <div className="col-md-6 mb-4 mb-md-0">
                  <div className="overflow-hidden hover-zoom-container rounded">
                    <img
                      src={postcard.imageUrl}
                      alt={postcard.title}
                      className="img-fluid hover-zoom"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToCategory("明信片")}
                    />
                  </div>
                </div>

                {/* 左側：白色區塊，內容置中 */}
                <div className="col-md-6">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center h-100 p-4"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <h3 className="mb-3">{"明信片"}</h3>
                    <p className="text-muted text-center mb-4">
                      {postcard.description ||
                        "厚磅紙張結合創意設計，讓明信片不僅是一張紙，而是溫暖情感的傳遞。適合作為禮物、收藏或書寫心意的載體。"}
                    </p>
                    <button
                      className="btn btn-dark"
                      onClick={() => goToCategory("明信片")}
                    >
                      選購
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- 海報 --- */}
            {poster && (
              <div className="row align-items-center mb-5">
                {/* 左側：圖片 */}
                <div className="col-md-6 mb-4 mb-md-0">
                  <div className="overflow-hidden hover-zoom-container rounded">
                    <img
                      src={poster.imageUrl}
                      alt={poster.title}
                      className="img-fluid hover-zoom"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToCategory("海報")}
                    />
                  </div>
                </div>

                {/* 右側：白色區塊，內容置中 */}
                <div className="col-md-6">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center h-100 p-4"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <h3 className="mb-3">{"海報"}</h3>
                    <p className="text-muted text-center mb-4">
                      {poster.description ||
                        "獨特設計，將貓的靈動與魅力化為藝術，讓你的空間充滿療癒感與個性。無論是掛在牆上，還是點綴角落，貓都會以最柔軟的方式，成為你的日常風景。"}
                    </p>
                    <button
                      className="btn btn-dark"
                      onClick={() => goToCategory("海報")}
                    >
                      選購
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* 紙材特點區塊 */}
      <div className="container my-5">
        <hr className="mb-5" style={{ borderTop: "1px solid #ddd" }} />
        <h2 className="text-center mb-4">紙材特點</h2>
        <div className="row">
          <div className="col-md-4 mb-3 text-center">
            <img
              src="https://images.unsplash.com/photo-1422036306541-00138cae4dbc?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="嚴選日製紙材"
              className="img-fluid rounded mb-3"
              style={{ height: "250px", objectFit: "cover" }}
            />
            <h5>嚴選日製紙材</h5>
            <p className="text-muted">
              採用來自日本的高品質紙材，具有細膩的紋理與優異的耐久性，
              為每一份紙品帶來更佳的質感與收藏價值。
            </p>
          </div>
          <div className="col-md-4 mb-3 text-center">
            <img
              src="https://images.unsplash.com/photo-1462143338528-eca9936a4d09?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="FSC 認證紙張"
              className="img-fluid rounded mb-3"
              style={{ height: "250px", objectFit: "cover" }}
            />
            <h5>FSC 認證紙張</h5>
            <p className="text-muted">
              選用經過 FSC 認證的環保紙張，確保所有原材料來自
              負責任管理的森林，支持可持續發展，減少環境負擔。
            </p>
          </div>
          <div className="col-md-4 mb-3 text-center">
            <img
              src="https://images.unsplash.com/photo-1625820104062-387167dd655b?q=80&w=1825&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="高品質印刷技術"
              className="img-fluid rounded mb-3"
              style={{ height: "250px", objectFit: "cover" }}
            />
            <h5>高品質印刷技術</h5>
            <p className="text-muted">
              採用專業級印刷技術，確保色彩飽滿、細節銳利，
              讓每一份作品都能完美呈現設計師的創意與匠心。
            </p>
          </div>
        </div>
      </div>

      {/* 品牌故事區塊（切成左右兩欄，手機版置中） */}
      <div className="bg-light py-5" style={{ width: "100%" }}>
        <div className="container">
          <div className="row align-items-center">
            {/* 左側：標題 + 文字 */}
            <div className="col-lg-6 text-lg-start text-center mb-4 mb-lg-0">
              <h2
                className="fw-bold mb-3"
                style={{ fontSize: "2.5rem", fontWeight: "bold" }}
              >
                關於我們
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: "1.1rem", maxWidth: "600px" }}
              >
                NEKOKAMI
                的「KAMI」既是紙(かみ)，也是神(神様)。我們透過設計，將貓元素融入紙品創作，讓每一張紙承載對貓的愛。我們也經營貓咪之家，讓曾經流浪街頭的貓，高高在上的俯瞰我們。希望有更多崇敬貓的人，一起成為守護貓咪的力量ヾ(*ΦωΦ)ツ
              </p>
            </div>

            {/* 右側：貓咪照片 + CTA */}
            <div className="col-lg-6 text-lg-end text-center">
              <div
                className="d-flex justify-content-lg-end justify-content-center align-items-center flex-wrap mb-3"
                style={{ gap: "1rem" }}
              >
                {/* 每個貓咪照片都加上 hover-zoom 效果 + 點擊導向 donation */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                  }}
                  className="hover-zoom-container"
                  onClick={() => navigate("/donation")}
                >
                  <img
                    src="/nekokami/images/cat1.jpg"
                    alt="cat1"
                    className="hover-zoom"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                  }}
                  className="hover-zoom-container"
                  onClick={() => navigate("/donation")}
                >
                  <img
                    src="/nekokami/images/cat2.jpg"
                    alt="cat2"
                    className="hover-zoom"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                  }}
                  className="hover-zoom-container"
                  onClick={() => navigate("/donation")}
                >
                  <img
                    src="/nekokami/images/cat3.jpg"
                    alt="cat3"
                    className="hover-zoom"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                  }}
                  className="hover-zoom-container"
                  onClick={() => navigate("/donation")}
                >
                  <img
                    src="/nekokami/images/cat4.jpg"
                    alt="cat4"
                    className="hover-zoom"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <p
                className="text-muted text-lg-end text-center"
                style={{ fontSize: "1.2rem" }}
              >
                邀請您一起為貓做更多，將回饋可愛感謝禮{" "}
                <span style={{ color: "red", fontSize: "1.5rem" }}>❤</span>
              </p>
              <button
                className="btn btn-dark px-4 py-2"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
                onClick={() => navigate("/donation")}
              >
                奉納支持
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
