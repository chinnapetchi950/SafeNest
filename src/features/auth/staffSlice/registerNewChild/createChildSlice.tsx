import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../authService";
import { createAsyncThunkHandlers } from "../../../../utils/asyncThunkHandler";

import { Alert } from "react-native";
import { useTranslation } from "../../../../contexts/LanguageContext";
const { t } = useTranslation();

/**
 * createChildUser USER (multipart/form-data)
 * values may include: firstName, lastName, email, password, profileImage
 */
export const createChildUser = createAsyncThunk(
  "children/create",
  async (formData, thunkAPI) => {
    try {
      const res = await authService.createChild(formData);
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Something went wrong";

  Alert.alert(t("alerts.error") || 'Error', message || t("alerts.error"));

      return thunkAPI.rejectWithValue(err?.response?.data);
    }
  }
);
// export const createChildUser = createAsyncThunk(
//   "api/user/children",
//   async (formData, thunkAPI) => {
//     try {
//       const res = await authService.createChild(formData);
//       return res.data;

//     } catch (err) {
//       console.log("error.....", err?.response?.data);

//       const message =
//         err?.response?.data?.message ||
//         err.message ||
//         "Something went wrong";

//       Alert.alert("Error", message);
//       return thunkAPI.rejectWithValue(err?.response?.data);
//     }
//   }
// );



export const fetchGameTypes = createAsyncThunk(
  "api/user/gameTypes",
  async (_, thunkAPI) => {
    try {
      const res = await authService.getuserGameTypes(); // call service
      console.log("Game Types Response:", res.data);

      return res.data;
    } catch (err) {
      console.log("Game Types Error:", err?.response);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
export const childHandover = createAsyncThunk(
  "api/user/child/verify-delivery",
  async (formData, thunkAPI) => {
    try {
      const res = await authService.childHandover(formData);
      console.log("handover Response:", res.data);
      return res.data;
    } catch (err) {
      console.log("childHandover Error --->",  err?.response?.data); // PRINT FULL ERROR
  Alert.alert(t("alerts.error") || 'Failed', err?.response?.data?.message || t("alerts.error"));

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
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
    // automatically manage loading, error, and success states
    createAsyncThunkHandlers(builder, createChildUser, "createChildUser");
    createAsyncThunkHandlers(builder, fetchGameTypes, "fetchGameTypes");
        createAsyncThunkHandlers(builder, childHandover, "childHandover");


  },
});

//export const { logout } = authSlice.actions;
export default authSlice.reducer;
