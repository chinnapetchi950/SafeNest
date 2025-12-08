// src/features/auth/authService.js
import apiClient from "../../api/apiClient";
import Storage from "../../utils/storage";
import { logout } from "./authSlice";
const authService = {
  login: (credentials: any) => apiClient.post("api/login", credentials),
  registerUser: (data: any) => apiClient.post("api/admin/users", data,true),
  createChild:(data:any)=>apiClient.post("api/user/children",data,true),
  getuserGameTypes: async () => {return apiClient.get("api/user/game-types")},
  getdashboardchildren:async ()=>{return apiClient.get("api/user/home")},
getchildrenListApi: async () => {
    const role = await Storage.getItem("admin");  // or get user role from state

    let url = "";

    if (role === "admin") {
      url = "api/admin/children";
    } else {
      url = "api/user/children";   // default
    }

    return apiClient.get(url);
  }, 
  getdashboardchildren_filterApi: async (fullUrl: string) => {return apiClient.get(fullUrl)},
  getchildrenlist_filterApi: async (fullUrl: string) => {return apiClient.get(fullUrl)},

  logout:async()=>{
    const role = await Storage.getItem("admin");  // or get user role from state

    let url = "";

    if (role === "admin") {
      url = "api/admin/logout";
    } else {
      url = "api/user/logout";   // default
    }

    return apiClient.post(url)},
      getUserList: async () => {return apiClient.get("api/admin/users")},
      getMessagelist:async () => {return apiClient.get("api/admin/messages")},
      createGame:(data:any)=>apiClient.post("api/admin/game-types",data,true),
      delete_account:async(data)=>{return apiClient.post('api/user/delete-account',data,true)},
      uploadProfileImage:(data:any)=>apiClient.post("api/user/profile_image",data,true),
changePassword: (data) => apiClient.post('api/user/change-password', data),
childHandover:(data)=>apiClient.post('api/user/child/verify-delivery',data,true),
childendSession: (childId,data) =>
  apiClient.post(`api/user/children/${childId}/end-session`,data,true),
deleteUsers: async (ids: number[]) => {
  const formData = new FormData();
  ids.forEach((id) => formData.append("ids[]", id.toString()));
  formData.append("_method", "DELETE");

  return apiClient.post("api/admin/users-delete-multiple", formData, true);
},


  //  profile: () => apiClient.get("/auth/profile"),
};

export default authService;
