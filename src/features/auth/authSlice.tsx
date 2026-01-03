// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { createAsyncThunkHandlers } from "../../utils/asyncThunkHandler";
import Storage from "../../utils/storage";
import { Alert } from "react-native";
import { useTranslation } from "../../contexts/LanguageContext";
const { t } = useTranslation();

/* ---------------- LOGIN ---------------- */
export const loginUser = createAsyncThunk("api/login", async (credentials, thunkAPI) => {
  try {
    const res = await authService.login(credentials);
    const { token, role } = res.data;

    await Storage.setItem("token", token);
    await Storage.setItem("admin", role);

    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Something went wrong";
  Alert.alert(t("alerts.error") || 'Error', message || t("alerts.error"));

    return thunkAPI.rejectWithValue(message);
  }
});

/* ---------------- LOGOUT ---------------- */
export const logoutUser = createAsyncThunk("api/user/logout", async (_, thunkAPI) => {
  try {
    const res = await authService.logout();
  Alert.alert(t("alerts.success") || 'Success', res?.data?.message || t("alerts.success"));

    await Storage.removeItem("token");
    await Storage.removeItem("admin");

    return true;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Logout failed";
  Alert.alert(t("alerts.error") || 'Error', message || t("alerts.error"));

    return thunkAPI.rejectWithValue(message);
  }
});

/* ---------------- DELETE ACCOUNT ---------------- */
export const deleteUserAccount = createAsyncThunk("api/user/delete-account", async (_, thunkAPI) => {
  try {
     const formData = new FormData();
      formData.append("_method", "DELETE");
           // formData.append("password", "DELETE");
      formData.append("confirmation", "DELETE");

      
    const res = await authService.delete_account(formData);
  Alert.alert(t("alerts.accountDeleted") || 'Account Deleted', res?.data?.message || t("alerts.accountDeleted"));

    await Storage.removeItem("token");
    await Storage.removeItem("admin");

    return true;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Account deletion failed";
  Alert.alert(t("alerts.error") || 'Error', message || t("alerts.error"));

    return thunkAPI.rejectWithValue(message);
  }
});
/* ---------------- CHANGE PASSWORD ---------------- */
export const changePassword = createAsyncThunk(
  "api/user/change-password",
  async (body, thunkAPI) => {
    console.log(body,'body');
    
    try {
      const res = await authService.changePassword(body);
      console.log("------------------>",res?.data);
      

  Alert.alert(t("alerts.success") || 'Success', res?.data?.message || t("auth.passwordsDoNotMatch") || 'Password changed successfully');

      return res.data;
    } catch (err) {
      console.log("Change Password Error --->",  err?.response?.data); // PRINT FULL ERROR
      const message =
        err?.response?.data?.message || err.message || "Failed to change password";

  Alert.alert(t("alerts.error") || 'Error', message || t("alerts.error"));

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendFcmToken = createAsyncThunk(
  "api/user/fcm-token",
  async (formdata, thunkAPI) => {
    try {
      const res = await authService.setFcmToken(formdata);
      console.log("res.data===>",res);
      
      return res.data;
    } catch (err) {
      console.log('err', err?.response);
      
      const message =
        err?.response?.data?.message || err.message || "FCM token update failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
/* ---------------- SLICE ---------------- */
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
      state.data = {};
    },
    updateLoginProfileImage: (state, action) => {
    if (state.data?.login) {
      state.data.login.profile_image_url = action.payload;
    }
  },
  },
  extraReducers: (builder) => {
    createAsyncThunkHandlers(builder, loginUser, "login");

    /* Logout Handlers */
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.data = {};
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.error.logout = action.payload;
      });

    /* Delete Account Handlers */
    builder
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading.delete = true;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading.delete = false;
        state.user = null;
        state.data = {};
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });
     createAsyncThunkHandlers(builder, changePassword, "changePassword");
    createAsyncThunkHandlers(builder, sendFcmToken, "fcmToken"); // ✅ optional but good

  },
});

export const { logout,updateLoginProfileImage } = authSlice.actions;
export default authSlice.reducer;
