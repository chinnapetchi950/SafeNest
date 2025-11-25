import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

/**
 * Fetch dashboard children with dynamic query params
 * Example:
 * dispatch(fetchDashboardChildrenfilter({ search: "john", phone: "98765" }));
 */
export const fetchDashboardChildrenfilter = createAsyncThunk(
  "dashboard/filter",
  async (params, thunkAPI) => {
    try {
      // Build dynamic query string
      const query = new URLSearchParams();
console.log('params',params);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          query.append(key, value);
        }
      });

      const fullUrl = `/api/user/home?${query.toString()}`;
      console.log("Final API URL =>", fullUrl);

      // Call your service — update service to accept full URL
      const res = await authService.getdashboardchildren_filterApi(fullUrl);

      console.log("dashboardlistfilter Response:", res.data);

      return res.data;

    } catch (err) {
      console.log("dashboardlistfilter Error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ----------------------------------------------
// 🔥 SLICE
// ----------------------------------------------
const dashboardFilterSlice = createSlice({
  name: "dashboardfilter",
  initialState: {
    loading: false,
    list: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardChildrenfilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardChildrenfilter.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.status === true) {
          state.list = action.payload.data; 
        }
      })

      .addCase(fetchDashboardChildrenfilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load filtered data";
      });
  },
});

export default dashboardFilterSlice.reducer;
