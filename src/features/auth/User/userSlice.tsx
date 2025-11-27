import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

export const fetchUserList = createAsyncThunk(
  "api/admin/users",
  async (_, thunkAPI) => {
    try {
      const res = await authService.getUserList(); // call service
      console.log("userlist Response:", res.data);

      return res.data;
    } catch (err) {
      console.log("userlist Error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
// ----------------------------------------------
// 🔥 SLICE
// ----------------------------------------------
const userlistSlice = createSlice({
  name: "userList",
  initialState: {
    loading: false,
    list: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      //Loading
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //Success
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.status === true) {
          state.list = action.payload.data; // STORE API DATA
        }
      })

      // Error
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
      });
  },
});

export default userlistSlice.reducer;
