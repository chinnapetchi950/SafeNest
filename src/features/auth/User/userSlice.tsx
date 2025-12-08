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
export const deleteUsers = createAsyncThunk(
  "api/admin/deleteUsers",
  async (ids: number[], thunkAPI) => {
    try {
      const res = await authService.deleteUsers(ids);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message);
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
      // Fetch Users
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure list is always an array
        state.list = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.list = []; // reset list on error
        state.error = action.payload || "Failed to load data";
      })

      // Delete Users
      .addCase(deleteUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.meta.arg || [];

        // Ensure state.list is an array before filtering
        if (Array.isArray(state.list)) {
          state.list = state.list.filter(
            (user) => !deletedIds.includes(Number(user.id))
          );
        } else {
          state.list = [];
        }
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete users";
      });
  },
});

export default userlistSlice.reducer;


