// // src/api/axiosInstance.js
// import axios from "axios";
// import Storage from "../utils/storage";
// import { store } from "../store/store";
// import { setLoading } from "../features/auth/loadingSlice.tsx/loadingSlices";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// const axiosInstance = axios.create({
//   baseURL: "https://testlink3.pillersofttechnologies.com/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🟢 Request Interceptor
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//        store.dispatch(setLoading(true));
//       const publicEndpoints = ["api/login"];

//       const isPublic = publicEndpoints.some((endpoint) =>
//         config.url?.includes(endpoint)
//       );

//       if (!isPublic) {
//           const token = await Storage.getItem("token");
// console.log("toekn....",token)
//         // const token = await AsyncStorage.getItem("token");
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//       }

//       // 🧾 Log request for testing
//       if (config.method?.toLowerCase() === "post") {
//         console.log("🟡 [POST Request URL]:", config.url);
//         console.log("📦 [POST Data Sent]:", config.data);
//       } else {
//         console.log(`➡️ [${config.method?.toUpperCase()} Request]:`, config.url);
//       }
//     } catch (error) {
//           store.dispatch(setLoading(false)); // stop loader on error

//       console.warn("Error in request interceptor:", error);
//     }

//     return config;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // 🔵 Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//         store.dispatch(setLoading(false)); // ✅ Stop loader

//     // ✅ Print the success response for testing
//     const status = response.status;

//     console.log("✅ [API Success]:", {
//       url: response.config.url,
//       status: status,
//       data: response.data,
//     });

//     // 🔊 Extra success indicator
//     if (status >= 200 && status < 300) {
//       console.log(
//         `🎉 [SUCCESS] ${response.config.url} → Status: ${status} ✅`
//       );
//     }

//     return response;
//   },
//   async (error) => {
//     const { response } = error;
//     store.dispatch(setLoading(false)); // ✅ Stop loader even on error

//     if (response) {
//       // console.error("❌ [API Error Response]:", {
//       //   url: response.config?.url,
//       //   status: response.status,
//       //   data: response.data,
//       // });

//       if (response.status === 401) {
//         //console.warn("⚠️ Unauthorized — token invalid or expired");
//         // await AsyncStorage.removeItem("token");
//         // global.token = null;
//       }
//     } else {
//       console.error("🚨 Network or unknown error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
// src/api/axiosInstance.js
import axios from "axios";
import Storage from "../utils/storage";
import { store } from "../store/store";
import { setLoading } from "../features/auth/loadingSlice.tsx/loadingSlices";
import { Alert } from "react-native";
import strings from "../localization/en";
import { navigationRef } from "../navigations/Appnavigator";
const axiosInstance = axios.create({
  baseURL: "https://testlink3.pillersofttechnologies.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ------------------------------------------------------
   🟢 REQUEST INTERCEPTOR
------------------------------------------------------ */
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
        console.log("token....", token);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      if (config.method?.toLowerCase() === "post") {
        console.log("🟡 [POST Request URL]:", config.url);
        console.log("📦 [POST Data Sent]:", config.data);
      } else {
        console.log(`➡️ [${config.method?.toUpperCase()} Request]:`, config.url);
      }
    } catch (error) {
      store.dispatch(setLoading(false));
      console.warn("Error in request interceptor:", error);
    }

    return config;
  },
  (error) => {
    store.dispatch(setLoading(false));
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

/* ------------------------------------------------------
   🔵 RESPONSE INTERCEPTOR
------------------------------------------------------ */
axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false));

    console.log("✅ [API Success]:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },

  async (error) => {
    const { response } = error;
    store.dispatch(setLoading(false));

    // 1️⃣ Detect expired token returning HTML (backend sends login page)
    if (
      response?.status === 500 &&
      typeof response.data === "string" &&
      response.data.startsWith("<!DOCTYPE html")
    ) {
      console.log("⚠️ Token expired (HTML Response from backend)");

      await Storage.removeItem("token");

      Alert.alert(strings.alerts.sessionExpiredTitle || 'Session Expired', strings.alerts.sessionExpiredMessage || 'Your login has expired. Please login again.', [
    {
      text: strings.common.ok || 'OK',
      onPress: () => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('Login');
        }
      },
    },
  ]);

      

      return Promise.reject(error);
    }

    // 2️⃣ Detect normal 401 unauthorized (if backend supports)
    if (response?.status === 401) {
      await Storage.removeItem("token");

      Alert.alert(strings.alerts.sessionExpiredTitle || 'Session Expired', strings.alerts.sessionExpiredMessage || 'Your login has expired. Please login again.', [
    {
      text: strings.common.ok || 'OK',
      onPress: () => {
        if (navigationRef.isReady()) {
          navigationRef.navigate('Login');
        }
      },
    },
  ]);
      return Promise.reject(error);
    }

    // Unknown/Network error
    if (!response) {
      console.error("🚨 Network/Unknown Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
