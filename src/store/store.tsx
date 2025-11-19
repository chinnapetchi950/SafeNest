// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import registerSlice from "../features/auth/staffSlice/registerSlice";
import loadingSlices from "../features/auth/loadingSlice.tsx/loadingSlices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registerSlice:registerSlice,
  loadingSlice:loadingSlices
  },
});
