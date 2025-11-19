// src/features/auth/authService.js
import apiClient from "../../api/apiClient";

const authService = {
  login: (credentials: any) => apiClient.post("api/admin/login", credentials),
  registerUser: (data: any) => apiClient.post("api/admin/users", data, true),


  //  profile: () => apiClient.get("/auth/profile"),
};

export default authService;
