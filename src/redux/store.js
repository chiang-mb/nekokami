import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // 前台購物車
import toastReducer from "./toastSlice"; // 後台通知

const store = configureStore({
  reducer: {
    cart: cartReducer, // 保留前台購物車功能
    toast: toastReducer, // 加入後台通知功能
  },
});

export default store;
