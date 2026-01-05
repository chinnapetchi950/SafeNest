import authService from "../authService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAsyncThunkHandlers } from "../../../utils/asyncThunkHandler";

export const fetchAdminHome = createAsyncThunk(
  "dashboard/adminHome",
  async (params = {}, thunkAPI) => {
    try {
      const res = await authService.getAdminHome(params);

      console.log("res----->",res.data.data);
      
      return res.data.data;
    } catch (err) {
        console.log(err,"ree");
        
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to load dashboard";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
