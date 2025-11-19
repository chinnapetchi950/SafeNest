// src/api/apiClient.js
import axiosInstance from "./axiosInstance";

const apiClient = {
  get: (url: string, params: any) => axiosInstance.get(url, { params }),
  put: (url: string, data: any) => axiosInstance.put(url, data),
  delete: (url: string) => axiosInstance.delete(url),
   post: (url: string, data: any, isMultipart = false) => {
    if (isMultipart) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      return axiosInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosInstance.post(url, data);
  },
};

export default apiClient;
