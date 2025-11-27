import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

export const fetchChildrenList = createAsyncThunk(
  "api/user/children",
  async (_, thunkAPI) => {
    try {
      const res = await authService.getchildrenListApi(); // call service
      console.log("childrenlist Response:", res.data);

      return res.data;
    } catch (err) {
      console.log("childrenlist Error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
// ----------------------------------------------
// 🔥 SLICE
// ----------------------------------------------
const childlistSlice = createSlice({
  name: "childrenList",
  initialState: {
    loading: false,
    list: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      //Loading
      .addCase(fetchChildrenList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //Success
      .addCase(fetchChildrenList.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.status === true) {
          state.list = action.payload.data; // STORE API DATA
        }
      })

      // Error
      .addCase(fetchChildrenList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
      });
  },
});

export default childlistSlice.reducer;
