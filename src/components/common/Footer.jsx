import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="bg-dark py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between text-white mb-md-7 mb-4">
            <Link to="/" className="text-white h4 text-decoration-none">
              NEKOKAMI
            </Link>
            <ul className="d-flex list-unstyled mb-0 h4">
              <li>
                <a href="#" className="text-white mx-3">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" className="text-white mx-3">
                  <i className="fab fa-line"></i>
                </a>
              </li>
              <li>
                <a href="mailto:service@mail.com" className="text-white ms-3">
                  <i className="fas fa-envelope"></i>
                </a>
              </li>
            </ul>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p className="mb-0 footer-text text-white">
              © 2025 NEKOKAMI All Rights Reserved
              <br />
              本網站僅供個人練習使用，無商業行為
            </p>
            <Link
              to="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light btn-sm ms-auto"
            >
              管理後台
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
