// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { createAsyncThunkHandlers } from "../../utils/asyncThunkHandler";
import Storage from "../../utils/storage";


export const loginUser = createAsyncThunk("api/admin/login", async (credentials, thunkAPI) => {
  try {
    const res = await authService.login(credentials);
 console.log("login jkjkjkjkjk",res)
 const { token, admin } = res.data;

      // Save using the common storage utility
      await Storage.setItem("token", token);
      await Storage.setItem("admin", admin);
    return res.data;
  } catch (err) {
    console.log("error.....",err)
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

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
    
    },
  },
  extraReducers: (builder) => {
    createAsyncThunkHandlers(builder, loginUser, "login");
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
