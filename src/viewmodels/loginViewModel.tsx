// src/viewmodels/authViewModel.js
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export const loginViewModel = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.auth);

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
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormError(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

     const res = await dispatch(loginUser(form)).unwrap(); // <-- unwrap() returns actual result or throws error
      console.log("Login successful:", res);
      navigation.navigate("BottomTabs"); 
  };
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
