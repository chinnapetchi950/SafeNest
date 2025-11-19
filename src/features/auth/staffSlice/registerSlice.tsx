import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";
import { createAsyncThunkHandlers } from "../../../utils/asyncThunkHandler";


/**
 * REGISTER USER (multipart/form-data)
 * values may include: firstName, lastName, email, password, profileImage
 */
export const registerUser = createAsyncThunk("api/admin/register", async (values, thunkAPI) => {
  try {
    // API call (multipart = true)
    const res = await authService.registerUser(values);
    console.log("Register response:", res);

    const { token, admin } = res.data;

   

    return res.data;
  } catch (err) {
    console.log("Register error:", err);
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
    // automatically manage loading, error, and success states
    createAsyncThunkHandlers(builder, registerUser, "register");
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
