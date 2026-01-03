
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";
import { createAsyncThunkHandlers } from "../../../utils/asyncThunkHandler";

import { Alert } from "react-native";
import strings from "../../../../localization/en";

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

  Alert.alert(strings.alerts.error || 'Error', message || strings.alerts.error);
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

  builder.addCase(uploadProfileImage.fulfilled, (state, action) => {
    const newImage = action?.payload?.data?.profile_image_url;

    if (newImage) {
      // If user already exists, update only image
      if (state.user) {
        state.user.profile_image_url = newImage;
      }

      // If your login stored inside state.data.login
      if (state.data?.login) {
        state.data.login.profile_image_url = newImage;
      }
    }
  });
}

});

export default authSlice.reducer;
