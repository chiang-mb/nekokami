import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="container my-5 text-center">
      {/* 主標題 */}
      <h2 className="fw-bold mb-5">ABOUT NEKOKAMI</h2>

      {/* 貓社長們 */}
      <h5 className="mb-4">貓社長們</h5>
      <div className="d-flex justify-content-center align-items-center flex-wrap mb-4">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className="cat-img"
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 0.8rem",
            }}
          >
            <img
              src={`/nekokami/images/cat${num}.jpg`}
              alt={`cat${num}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* 文字敘述 */}
      <p className="text-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>
        NEKOKAMI
        的「KAMI」既是紙(かみ)，也是神(神様)。我們透過設計，將貓元素融入紙品創作，每一張紙都承載著對貓的愛。我們同時也經營著貓咪之家，讓曾經流浪街頭的貓，回到高高在上的地位，偶爾如神一般俯瞰我們、偶爾像隻貓咪對我們撒驕，貓社長們過去也都是流浪貓喔！
      </p>

      {/* 一起為貓咪奉納支持 */}
      <h5 className="mt-5 mb-4">奉納感謝回饋</h5>
      <div
        className="d-flex flex-column flex-md-row justify-content-center align-items-center align-items-md-start hover-zoom-container"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/donation")}
      >
        {/* 左側圖片 */}
        <img
          src="/nekokami/images/donation.jpg"
          alt="奉納金"
          className="img-fluid mb-3 mb-md-0 rounded hover-zoom"
          style={{ maxWidth: "300px", height: "auto" }}
        />

        {/* 右側：文字 + 按鈕 (上下排列) */}
        <div className="ms-md-4" style={{ maxWidth: "400px" }}>
          {/* 文字描述 */}
          <p className="text-muted text-center text-md-start mb-0">
            您的每一筆奉納金，都將用於中途貓之家的醫療、照顧與日常開支。
            我們提供專屬的「回饋品」給支持貓咪的善心人士，希望有更多崇敬貓的人，一起成為守護貓咪的力量ヾ(*ΦωΦ)ツ
          </p>
          {/* 按鈕：置於文字區塊下方，桌面版靠右、手機版置中 */}
          <div className="text-md-end text-center mt-3">
            <button
              className="btn btn-dark px-4 py-2"
              onClick={() => navigate("/donation")}
            >
              前往貓神社奉納
            </button>
          </div>
        </div>
      </div>
      {/* 更多品牌資訊 */}
      <hr className="my-5" />
      <div className="row">
        <div className="col-md-6 mb-2">
          <h5 className="fw-bold">永續環保</h5>
          <p className="text-muted">
            NEKOKAMI
            致力於使用回收紙、FSC認證紙張及大豆油墨印刷，減少對環境的傷害，
            並在生產過程中嚴格控管能耗與廢棄物處理。
          </p>
        </div>
        <div className="col-md-6">
          <h5 className="fw-bold">藝術設計</h5>
          <p className="text-muted">
            我們與插畫家、設計師合作，將貓咪的靈動與魅力結合創意表現。
            無論是包裝紙、卡片或海報，每一件作品都蘊含對貓的熱愛。
          </p>
        </div>
      </div>
    </div>
  );
}
