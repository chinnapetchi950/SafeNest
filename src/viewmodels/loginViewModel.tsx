// src/viewmodels/authViewModel.js
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout ,sendFcmToken} from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Storage from "../utils/storage";
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { useTranslation } from "../contexts/LanguageContext";
export const loginViewModel = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const [form, setForm] = useState({ email: "", password: "" });
 const [formError, setFormError] = useState({ email: "", password: "" });
const navigation=useNavigation()
  // ✅ email regex for username validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const isButtonDisabled =
  //   !form.email ||
  //   !form.password ||
  //   formError.email ||
  //   formError.password;
    const isButtonDisabled =
  !form.email?.trim() ||
  !form.password?.trim() ||
  !!formError.email ||
  !!formError.password;
 const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!form.email) {
      errors.email = t("validation.emailRequired");
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      errors.email = t("validation.emailInvalid");
      isValid = false;
    }

    if (!form.password) {
      errors.password = t("validation.passwordRequired");
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = t("validation.passwordMinLength");
      isValid = false;
    }

    setFormError(errors);
    return isValid;
  };

  
const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    const res = await dispatch(loginUser(form)).unwrap();
    console.log("Login successful:", res.role);

    Storage.setItem("role", res.role);

    // ✅ GET FCM TOKEN
      const app = getApp();

    // ✅ GET MESSAGING INSTANCE
    const messaging = getMessaging(app);

    // ✅ GET FCM TOKEN
    const fcmToken = await getToken(messaging);
    console.log("FCM Token --->", fcmToken);

if (fcmToken&&res.role==='user') {
  const formData = new FormData();
  formData.append("fcm_token", fcmToken);

  dispatch(sendFcmToken(formData));
}


    // ✅ NAVIGATION
    if (res.role === "user") {
      navigation.navigate("BottomTabsStaff");
    } else {
      navigation.navigate("BottomTabs");
    }

  } catch (error) {
    console.log("Login Error:", error);
  }
};

  // const handleLogin = async () => {
  //   if (!validateForm()) return;

  //    const res = await dispatch(loginUser(form)).unwrap(); // <-- unwrap() returns actual result or throws error
  //     console.log("Login successful:", res.role);
  //     Storage.setItem('role',res.role);
  //     if(res.role==='user'){
  //     navigation.navigate("BottomTabsStaff"); 

  //     }else{
  //       navigation.navigate("BottomTabs"); 

  //     }
  // };
 // optional helper to simplify updates
  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError((prev) => ({ ...prev, [key]: "" })); // clear error when user types
  };
  const handleLogout = () => dispatch(logout());

  return {
    form,handleInputChange,
    setForm,
    handleLogin,
    handleLogout,formError,
    loading,
    error,
    data,
    isButtonDisabled
  };
};
