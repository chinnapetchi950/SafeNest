// src/features/auth/authService.js
import apiClient from "../../api/apiClient";
const authService = {
  login: (credentials: any) => apiClient.post("api/login", credentials),
  registerUser: (data: any) => apiClient.post("api/admin/users", data, true),
  createChild:(data:any)=>apiClient.post("api/user/children",data,true),
  getuserGameTypes: async () => {return apiClient.get("api/user/game-types")},
  getdashboardchildren:async ()=>{return apiClient.get("api/user/home")},
  // getdashboardchildren_filterApi:async()=>{return apiClient.get("api/user/children")},
  getdashboardchildren_filterApi: async (fullUrl: string) => {
  return apiClient.get(fullUrl);
},

  //  profile: () => apiClient.get("/auth/profile"),
};

export default authService;
