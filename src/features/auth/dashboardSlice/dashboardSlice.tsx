import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

export const fetchDashboardChildren = createAsyncThunk(
  "api/user/home",
  async (_, thunkAPI) => {
    try {
      const res = await authService.getdashboardchildren(); // call service
      console.log("dashboardlist Response:", res.data);

      return res.data;
    } catch (err) {
      console.log("dashboardlist Error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
// ----------------------------------------------
// 🔥 SLICE
// ----------------------------------------------
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    list: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      //Loading
      .addCase(fetchDashboardChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //Success
      .addCase(fetchDashboardChildren.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.status === true) {
          state.list = action.payload.data; // STORE API DATA
        }
      })

      // Error
      .addCase(fetchDashboardChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
      });
  },
});

export default dashboardSlice.reducer;
