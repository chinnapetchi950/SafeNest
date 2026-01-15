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
export const deleteChildren = createAsyncThunk(
  "children/delete-multiple",
  async (ids: number[], thunkAPI) => {
    try {
      const res = await authService.deleteChildren(ids); // role-based API
      return res.data;
    } catch (err: any) {
      console.log("errr========>",err);
      
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
  deleteLoading: false,
  },

  reducers: {},

extraReducers: (builder) => {
  builder

    // ----------------------------
    // FETCH CHILDREN
    // ----------------------------
    .addCase(fetchChildrenList.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchChildrenList.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.status === true) {
        state.list = action.payload.data;
      }
    })

    .addCase(fetchChildrenList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to load data";
    })

    // ----------------------------
    // DELETE CHILDREN
    // ----------------------------
    .addCase(deleteChildren.pending, (state) => {
      state.deleteLoading = true;
      state.error = null;
    })

    .addCase(deleteChildren.fulfilled, (state, action) => {
      state.deleteLoading = false;

      if (action.payload?.status === true) {
        const deletedIds = action.meta.arg; // ids passed to thunk
        state.list = state.list.filter(
          (child) => !deletedIds.includes(child.id)
        );
      }
    })

    .addCase(deleteChildren.rejected, (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload || "Failed to delete children";
    });
},

});

export default childlistSlice.reducer;
