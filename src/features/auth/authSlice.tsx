// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { createAsyncThunkHandlers } from "../../utils/asyncThunkHandler";
import Storage from "../../utils/storage";
import { Alert } from "react-native";

/* ---------------- LOGIN ---------------- */
export const loginUser = createAsyncThunk("api/login", async (credentials, thunkAPI) => {
  console.log("requestparam", credentials);
  try {
    const res = await authService.login(credentials);
    console.log("login api res---->", res);

    const { token ,role} = res.data;

    await Storage.setItem("token", token);
    await Storage.setItem("admin", role);

    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Something went wrong";
    Alert.alert("Error", message);
    return thunkAPI.rejectWithValue(message);
  }
});


/* ---------------- LOGOUT ---------------- */
export const logoutUser = createAsyncThunk("api/user/logout", async (_, thunkAPI) => {
  try {
    const res = await authService.logout();  // 🔥 CALL LOGOUT API
    console.log("logout api res---->", res);
    Alert.alert("Success",res?.data?.message);

    // Clear storage
    await Storage.removeItem("token");
    //await Storage.removeItem("admin");

    return true;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Logout failed";
    Alert.alert("Error", message);
    return thunkAPI.rejectWithValue(message);
  }
});


/* ---------------- SLICE ---------------- */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: {},
    error: {},
    data: {},
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    createAsyncThunkHandlers(builder, loginUser, "login");

    // ADD Logout handlers
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.data = {};
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.error.logout = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
