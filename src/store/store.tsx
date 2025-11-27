// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import registerSlice from "../features/auth/staffSlice/registerSlice";
import loadingSlices from "../features/auth/loadingSlice.tsx/loadingSlices";
import gameTypesReducer from "../features/auth/staffSlice/registerNewChild/gameTypesSlice";
import dashboardReducer  from "../features/auth/dashboardSlice/dashboardSlice";
import dashboardReducerfilter from "../features/auth/dashboardSlice/dashboardfilterslice";
import childlistReducer from '../features/auth/children/childrenListslice';
import userListReducer from '../features/auth/User/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registerSlice:registerSlice,
  loadingSlice:loadingSlices,
  gameTypes: gameTypesReducer,
  dashboard:dashboardReducer,
  dashboardReducerfilter:dashboardReducerfilter,
  childrenlist:childlistReducer,
  userList:userListReducer
  
 
  },
});
console.log("store reducers:", store.getState());
