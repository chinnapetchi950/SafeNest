// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import registerSlice from "../features/auth/staffSlice/registerSlice";
import loadingSlices from "../features/auth/loadingSlice.tsx/loadingSlices";
import gameTypesReducer from "../features/auth/staffSlice/registerNewChild/gameTypesSlice";
import dashboardReducer  from "../features/auth/dashboardSlice/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registerSlice:registerSlice,
  loadingSlice:loadingSlices,
  gameTypes: gameTypesReducer,
  dashboard:dashboardReducer,
 
  },
});
console.log("store reducers:", store.getState());
