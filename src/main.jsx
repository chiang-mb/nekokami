import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./assets/styles/all.scss";
import "bootstrap/dist/js/bootstrap.js";

import "bootstrap/dist/css/bootstrap.min.css"; // 確保 CSS 正確載入
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 載入 Bootstrap JS
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Provider } from "react-redux";
import store from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
