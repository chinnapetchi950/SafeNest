// src/api/axiosInstance.js
import axios from "axios";
import Storage from "../utils/storage";
import { store } from "../store/store";
import { setLoading } from "../features/auth/loadingSlice.tsx/loadingSlices";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "https://testlink3.pillersofttechnologies.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
       store.dispatch(setLoading(true));
      const publicEndpoints = ["api/login"];

      const isPublic = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (!isPublic) {
          const token = await Storage.getItem("token");
console.log("toekn....",token)
        // const token = await AsyncStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 🧾 Log request for testing
      if (config.method?.toLowerCase() === "post") {
        console.log("🟡 [POST Request URL]:", config.url);
        console.log("📦 [POST Data Sent]:", config.data);
      } else {
        console.log(`➡️ [${config.method?.toUpperCase()} Request]:`, config.url);
      }
    } catch (error) {
          store.dispatch(setLoading(false)); // stop loader on error

      console.warn("Error in request interceptor:", error);
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 🔵 Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
        store.dispatch(setLoading(false)); // ✅ Stop loader

    // ✅ Print the success response for testing
    const status = response.status;

    console.log("✅ [API Success]:", {
      url: response.config.url,
      status: status,
      data: response.data,
    });

    // 🔊 Extra success indicator
    if (status >= 200 && status < 300) {
      console.log(
        `🎉 [SUCCESS] ${response.config.url} → Status: ${status} ✅`
      );
    }

    return response;
  },
  async (error) => {
    const { response } = error;
    store.dispatch(setLoading(false)); // ✅ Stop loader even on error

    if (response) {
      // console.error("❌ [API Error Response]:", {
      //   url: response.config?.url,
      //   status: response.status,
      //   data: response.data,
      // });

      if (response.status === 401) {
        //console.warn("⚠️ Unauthorized — token invalid or expired");
        // await AsyncStorage.removeItem("token");
        // global.token = null;
      }
    } else {
      console.error("🚨 Network or unknown error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
