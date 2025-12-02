
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";
import { createAsyncThunkHandlers } from "../../../utils/asyncThunkHandler";

import { Alert } from "react-native";

export const uploadProfileImage = createAsyncThunk(
  "api/user/profile_image",
  async ({ image }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("profile_image", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: image.fileName || "profile.jpg",
      });

      const res = await authService.uploadProfileImage(formData);

      return res?.data; // contains { status, message, data: { profile_image_url } }
    } catch (err) {
            console.log("Profile Error --->",  err?.response?.data); // PRINT FULL ERROR

      const message =
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong";

      Alert.alert("Upload Failed", message);
      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);
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
    createAsyncThunkHandlers(builder, uploadProfileImage, "uploadProfileImage");
  },
});

export default authSlice.reducer;
