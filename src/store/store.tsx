// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import registerSlice from "../features/auth/staffSlice/registerSlice";
import loadingSlices from "../features/auth/loadingSlice.tsx/loadingSlices";
import gameTypesReducer from "../features/auth/staffSlice/registerNewChild/gameTypesSlice";
import dashboardReducer from "../features/auth/dashboardSlice/dashboardSlice";
import dashboardReducerfilter from "../features/auth/dashboardSlice/dashboardfilterslice";
import childlistReducer from "../features/auth/children/childrenListslice";
import userListReducer from "../features/auth/User/userSlice";
import gameTypeReducer from "../features/auth/Game/addGameSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";

// --------------------- PERSIST CONFIG ---------------------
const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["data", "user"], // persist login data + profile_image
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// --------------------- STORE ---------------------
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Persisted reducer
    registerSlice,
    loadingSlice: loadingSlices,
    gameTypes: gameTypesReducer,
    dashboard: dashboardReducer,
    dashboardReducerfilter,
    childrenlist: childlistReducer,
    userList: userListReducer,
    createGameType: gameTypeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
