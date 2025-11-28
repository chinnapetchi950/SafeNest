import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";
import Storage from "../../../utils/storage";

/**
 * Fetch children with dynamic query params
 * Example:
 * dispatch(fetchchildrenlistfilter({ search: "john", phone: "98765" }));
 */
export const fetchchildrenlistfilter = createAsyncThunk(
  "/api/user/children",
  async (params, thunkAPI) => {
        const role = await Storage.getItem("admin");  // or get user role from state

    try {
      // Build dynamic query string
      const query = new URLSearchParams();
     console.log('params',params);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== "") {
          query.append(key, value);
        }
      });

      let url = "";

    if (role === "admin") {
      url = "api/admin/children";
    } else {
      url = "api/user/children";   // default
    }
      const fullUrl = `${url}?${query.toString()}`;
      console.log("Final API URL =>", fullUrl);

      // Call your service — update service to accept full URL
      const res = await authService.getchildrenlist_filterApi(fullUrl);

      console.log("childrenlistfilter Response:", res.data);

      return res.data;

    } catch (err) {
      console.log("childrenlistfilter Error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ----------------------------------------------
// 🔥 SLICE
// ----------------------------------------------
const childrenFilterSlice = createSlice({
  name: "dashboardfilter",
  initialState: {
    loading: false,
    list: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchchildrenlistfilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchchildrenlistfilter.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.status === true) {
          state.list = action.payload.data; 
        }
      })

      .addCase(fetchchildrenlistfilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load filtered data";
      });
  },
});

export default childrenFilterSlice.reducer;
