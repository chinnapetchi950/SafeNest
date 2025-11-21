// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { createAsyncThunkHandlers } from "../../utils/asyncThunkHandler";
import Storage from "../../utils/storage";
import { Alert } from "react-native";

export const loginUser = createAsyncThunk("api/login", async (credentials, thunkAPI) => {
  console.log('requestparam',credentials)
  try {
    const res = await authService.login(credentials);
 console.log("login api res---->",res)
 const { token, admin } = res.data;

      // Save using the common storage utility
      await Storage.setItem("token", token);
      await Storage.setItem("admin", admin);
    return res.data;
  } catch (err) {
    console.log("error.....", err);

  const message = err?.response?.data?.message || err.message || "Something went wrong";

  Alert.alert("Error", message); 

  return thunkAPI.rejectWithValue(message);
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
