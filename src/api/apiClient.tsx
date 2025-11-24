// src/api/apiClient.js
import axiosInstance from "./axiosInstance";

const apiClient = {
  get: (url: string, params: any) => axiosInstance.get(url, { params }),

  put: (url: string, data: any) =>
    axiosInstance.put(url, data),

  delete: (url: string) =>
    axiosInstance.delete(url),

  post: (url: string, data: any, isMultipart = false) => {
        console.log(isMultipart,'isMultipart');

    return axiosInstance.post(url, data, {
      headers: isMultipart
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });
  },
};

export default apiClient;

