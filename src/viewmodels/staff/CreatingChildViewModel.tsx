
// import { useState,useEffect } from "react";
// import { useTranslation } from 'react-i18next'; } from '../../contexts/LanguageContext';
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import { createChildUser } from "../../features/auth/staffSlice/registerNewChild/createChildSlice";
// import { launchImageLibrary } from "react-native-image-picker";
// import {Alert} from "react-native";
// import moment from "moment";
// import Storage from "../../utils/storage";
// import { fetchUserList } from "../../features/auth/User/userSlice";


// const useFilterBottomSheetViewModel = () => {
//    const dispatch = useDispatch();
//   const { loading, error, data } = useSelector((state) => state.auth);
//   // users dropdown
// const [users, setUsers] = useState([]);
// const [selectedUserId, setSelectedUserId] = useState(null);
// const [role, setRole] = useState(null);

//   const navigation=useNavigation()
//   const [form, setForm] = useState({
//     phone: "",
//     date_of_birth: null,
//     guardian_name: "",
//     name: "",
//     // playMinutes: "",
//     // playHours: "",
//     gender: "",
//     address:'',
//     pictures: [],
//     user_id: null, 
//   });
//  const [formError, setFormError] = useState({  phone: "",
//     date_of_birth: null,
//     guardian_name: "",
//     name: "",
//     // playMinutes: "",
//     // playHours: "",
//     gender: "",address:""});
//      const [childformError, setChildFormError] = useState({  phone: "",
//     game_type_id: "",
//     play_from: "",
//     play_to: "",
//     session_date: null,
//     play_duration: "",});

//   const [childform, setChildForm] = useState({
//     game_type_id: "",
//     play_from: "",
//     play_to: "",
//     session_date:null,
//     play_duration: "",
//     price:'',
//   });

//   const [errors, setErrors] = useState({});
//   const [selectedGender, setSelectedGender] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
// const [showTimePickerFrom, setShowTimePickerFrom] = useState(false);
// const [showTimePickerTo, setShowTimePickerTo] = useState(false);
// const [picker, setPicker] = useState({
//   show: false,
//   mode: "date",   // or "time"
//   field: null,    // "play_from" | "play_to" | "session_date"
// });
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//  const isnextButtonDisabled =
//   !form.phone?.trim() ||
//   !form.date_of_birth ||
//     !form.guardian_name?.trim() ||
//   !form.name?.trim() ||
//     !form.gender?.trim() ||!form.address?.trim() ||
//   !!formError.phone ||
//   !!formError.date_of_birth || !!formError.guardian_name ||
//   !!formError.name || !!formError.gender || !!formError.address;

//    const isaddButtonDisabled =
//   !childform.game_type_id ||
//   !childform.play_from?.trim() ||
//     !childform.play_to?.trim() ||
//   !childform.session_date ||
//     !childform.play_duration ||
//   !!childformError.game_type_id ||
//   !!childformError.play_from || !!childformError.play_to ||
//   !!childformError.session_date || !!childformError.play_duration;

// //   console.log("Form State:", form);
// //     console.log("childform", childform);

// // console.log("Form Errors:", formError);
// // console.log("Disabled:", isnextButtonDisabled);
//   // ----------------------------------------
//   // GENDER SELECT
//   // ----------------------------------------
//   const handleSelectGender = (gender) => {
//     console.log('gender',gender)
//     setSelectedGender(gender);
//       setForm((prev) => ({ ...prev, gender }));

//   };

//   useEffect(() => {
//   checkRoleAndLoadUsers();
// }, []);

// const checkRoleAndLoadUsers = async () => {
//   const storedRole = await Storage.getItem("admin"); // "admin" | "user"
//   setRole(storedRole);

//   if (storedRole === "admin") {
//     loadUsers();
//   }
// };

// const loadUsers = async () => {
//   const data: any = await dispatch(fetchUserList()).unwrap();
//   setUsers(
//     data.map((u: any) => ({
//       label: u.full_name,
//       value: u.id,
//     }))
//   );
// };
// const handleSelectUser = (userId) => {
//   setSelectedUserId(userId);
//   setForm(prev => ({
//     ...prev,
//     user_id: userId, // ✅ VERY IMPORTANT
//   }));
// };

//   // ----------------------------------------
//   // GENERIC INPUT HANDLERS
//   // ----------------------------------------
//   const handleInputChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleInputChangeForm = (key, value) => {
//     setChildForm((prev) => ({ ...prev, [key]: value }));
//   };

//   // ----------------------------------------
//   // RESET FORM
//   // ----------------------------------------
//   const handleReset = () => {
//     setForm({
//       phone: "",
//       date_of_birth:null,
//       guardian_name: "",
//       name: "",
//       // playMinutes: "",
//       // playHours: "",
//       gender: "",
//       address:'',
//       pictures:[]
//     });
//     setErrors({});
//   };

// const pickImages = () => {
//   launchImageLibrary(
//     { mediaType: "photo", selectionLimit: 5 },
//     (response) => {
//       if (response.didCancel || response.errorCode) return;

//       const imgs = response.assets?.map((item) => ({
//         uri: item.uri!,
//         type: item.type || "image/jpeg",
//         fileName: item.fileName || `img_${Date.now()}.jpg`,
//       })) || [];

//       setForm(prev => ({
//         ...prev,            // keep all other fields
//         pictures: [...prev.pictures, ...imgs],
//       }));
//     }
//   );
// };
// const removeImage = (index: number) => {
//   setForm(prev => ({
//     ...prev,
//     pictures: prev.pictures.filter((_, i) => i !== index)
//   }));
// };
//   // ----------------------------------------
//   // SIMPLE VALIDATION
//   // ----------------------------------------
//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!form.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
//     if (!form.guardian_name.trim()) newErrors.guardian_name = "Guardian Name is required";
//     if (!form.name.trim()) newErrors.name = "Child name is required";
//     if (!form.gender) newErrors.gender = "Please select gender";
//     if (!form.address) newErrors.address = "Address is required";
//  if (role === "admin" && !form.user_id) {
//     newErrors.user_id = "Please assign child to staff";
//   }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//    const validateFormadd = () => {
//     const newErrors = {};
//     if (!childform.game_type_id) newErrors.game_type_id = "Please select Game Type";
//     if (!childform.play_from) newErrors.play_from = "Please select Play From";
//     if (!childform.play_to) newErrors.play_to = "Please select Play To";
//     if (!childform.session_date) newErrors.session_date = "Please select SessionDate";
//     if (!childform.play_duration) newErrors.play_duration = "Please select play_duration";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ----------------------------------------
//   // NEW: PLAY DURATION SELECT
//   // ----------------------------------------
  // const handleDurationSelect = (duration) => {
  //   setChildForm((prev) => ({ ...prev, duration }));
  // };

//   // ----------------------------------------
//   // NEW: DATE/TIME PICKER HANDLER
//   // ----------------------------------------
// //   const handlePickerChange = (type, event, selectedValue) => {
// //   if (event.type === "dismissed") {
// //     closePicker(type);
// //     return;
// //   }

// //   if (type === "date") {
// //     const date = new Date(selectedValue);
// //     const formatted =
// //       `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
// //         date.getDate()
// //       ).padStart(2, "0")}`;

// //     setChildForm((prev) => ({
// //       ...prev,
// //       session_date: formatted,
// //     }));
// //   }

// //   if (type === "play_from") {
// //     const time = new Date(selectedValue);
// //     const formatted = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// //     setChildForm((prev) => ({
// //       ...prev,
// //       play_from: formatted,
// //     }));
// //   }

// //   if (type === "play_to") {
// //     const time = new Date(selectedValue);
// //     const formatted = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// //     setChildForm((prev) => ({
// //       ...prev,
// //       play_to: formatted,
// //     }));
// //   }

// //   closePicker(type);
// // };

// // const handlePickerChange = (type, event, selectedValue) => {
// //   if (event.type === "dismissed") {
// //     closePicker(type);
// //     return;
// //   }

// //   const value = new Date(selectedValue);

// //   if (type === "date") {
// //     setChildForm(prev => ({ ...prev, session_date: value }));
// //   }

// //   if (type === "play_from") {
// //     const formatted = value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //     setChildForm(prev => ({ ...prev, play_from: formatted }));
// //   }

// //   if (type === "play_to") {
// //     const formatted = value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //     setChildForm(prev => ({ ...prev, play_to: formatted }));
// //   }

// //   closePicker(type);
// // };
// // const handlePickerChange = (type, event, selectedValue) => {
// //   if (event.type === "dismissed") {
// //     closePicker(type);
// //     return;
// //   }

// //   const value = new Date(selectedValue);

// //   // ---------- DATE ----------
// //   if (type === "date") {
// //     const year = value.getFullYear();
// //     const month = String(value.getMonth() + 1).padStart(2, "0");
// //     const day = String(value.getDate()).padStart(2, "0");

// //     const formattedDate = `${year}-${month}-${day}`; // ✔ backend format

// //     setChildForm(prev => ({ ...prev, session_date: formattedDate }));
// //   }

// //   // ---------- TIME (COMMON FORMATTER) ----------
// //   const formatTime1 = (dateObj) =>
// //     dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
// //   const formatTime = (dateObj) => {
// //     const h = String(dateObj.getHours()).padStart(2, "0");
// //     const m = String(dateObj.getMinutes()).padStart(2, "0");
// //     const s = String(dateObj.getSeconds()).padStart(2, "0");
// //     return `${h}:${m}:${s}`;
// //   };

// //   // ---------- PLAY FROM ----------
// //   if (type === "play_from") {
// //     const formatted = formatTime(value);
// //     console.log(formatted,'formatted=====?');
    
// //     setChildForm(prev => ({ ...prev, play_from: formatted }));
// //   }

// //   // ---------- PLAY TO ----------
// //   if (type === "play_to") {
// //     const formatted = formatTime(value);
// //     console.log(formatted,'formattedto=====?');

// //     // Validate play_from < play_to
// //     if (childForm.play_from) {
// //       const from = new Date(`2000-01-01 ${childForm.play_from}`);
// //       const to   = new Date(`2000-01-01 ${formatted}`);

// //       if (to <= from) {
// //         alert("❗ 'Play To' must be greater than 'Play From'");
// //         return;
// //       }
// //     }

// //     setChildForm(prev => ({ ...prev, play_to: formatted }));
// //   }

// //   closePicker(type);
// // };
// const handlePickerChange = (event, selectedValue) => {
//   if (event.type === "dismissed") {
//     closePicker();
//     return;
//   }

//   const value = new Date(selectedValue);

//   // ---- DATE ----
//   if (picker.field === "session_date") {
//     const y = value.getFullYear();
//     const m = String(value.getMonth() + 1).padStart(2, "0");
//     const d = String(value.getDate()).padStart(2, "0");

//     setChildForm(prev => ({ ...prev, session_date: `${y}-${m}-${d}` }));
//     closePicker();
//     return;
//   }

//   // ---- TIME FORMAT ----
//   const h = String(value.getHours()).padStart(2, "0");
//   const mm = String(value.getMinutes()).padStart(2, "0");
//   const formatted = `${h}:${mm}`;

//   // ---- PLAY FROM ----
//   if (picker.field === "play_from") {
//     console.log("FROM:", formatted);
//     setChildForm(prev => ({ ...prev, play_from: formatted }));
//   }

//   // ---- PLAY TO ----
//   if (picker.field === "play_to") {
//     console.log("TO:", formatted);

//     if (childform.play_from) {
//       const from = new Date(`2000-01-01 ${childform.play_from}`);
//       const to = new Date(`2000-01-01 ${formatted}`);

//       if (to <= from) {
//         Alert.alert("Play To must be greater than Play From");
//         return;
//       }
//     }

//     setChildForm(prev => ({ ...prev, play_to: formatted }));
//   }

//   closePicker();
// };


// const closePicker = (type) => {
//   if (type === "date") setShowDatePicker(false);
//   if (type === "play_from") setShowTimePickerFrom(false);
//   if (type === "play_to") setShowTimePickerTo(false);
// };
//  const handleNext=async()=>{
//   if (!validateForm()) return;{
// console.log("Form1 data saved:", form);
// navigation.navigate("SessionDetailsScreen", {
//   parentform: form
// });
//     // navigation.navigate("SessionDetailsScreen",{ parentform:form });
//   }
//  }
// const handleAddChild  = async (form: any) => {
//   console.log(childform, form, "childform0000");

//   if (!validateFormadd()) return;

//   // merge objects
//   const finalPayload = {
//     ...form,
//     ...childform,
//   };

//   console.log("FINAL PAYLOAD:", finalPayload);

//   const formData = new FormData();

//   Object.keys(finalPayload).forEach((key) => {
//     console.log("finalPayload[key] instanceof Date",finalPayload[key] instanceof Date);
    
//   if (key === "pictures") {
//     if (Array.isArray(finalPayload.pictures)) {
//       finalPayload.pictures.forEach((img) => {
//         formData.append("pictures[]", {
//           uri: img.uri,
//           name: img.fileName,
//           type: img.type,
//         });
//       });
//     }
//   }

//   // --- FIX FOR DATE OBJECTS ---
//   else if (key === "date_of_birth" || key === "session_date") {
//     const formatted = moment(finalPayload[key]).format("YYYY-MM-DD");
//     console.log(formatted,'formatted-------------------->');
    
//     formData.append(key, formatted);
//   }
//    else if (key === "play_to" || key === "play_from") {
// const formatted = moment(finalPayload[key], "HH:mm").format("HH:mm:ss");
//     console.log(formatted,'formatted-------------------->time');
    
//     formData.append(key, formatted);
//   }
// //   else if (key === "game_type_id" || key === "play_duration") {
// // const formatted = finalPayload[key].toString();
// //     console.log(formatted,'formatted-------------------->type');
    
// //     formData.append(key, formatted);
// //   }

//   // --- NUMBERS FIX ---
//   // else if (typeof finalPayload[key] === "number") {
//   //   formData.append(key, String(finalPayload[key]));
//   // }

//   // --- NORMAL FIELDS ---
//   else {
//     formData.append(key, finalPayload[key]);
//   }
// });

//   console.log("FORMDATA READY",formData);

//  try {
//   const res = await dispatch(createChildUser(formData)).unwrap();
//   console.log("addchild successful:", res);
//    if (res?.status === true) {
//         setShowSuccessModal(true);   // SHOW MODAL FROM VIEWMODEL
//       }
//       return res;
// } catch (err) {
//   console.log("addchild ERROR:", err);

//   // Show message
//   if (err?.message) {
//     console.log("MESSAGE:", err.message);
//   }

//   // Print field-wise errors
//   if (err?.errors) {
//     Object.entries(err.errors).forEach(([field, messages]) => {
//       console.log(`${field}: ${messages.join(", ")}`);
//     });
//   }
// }
// };

//   return {
//     form,
//     errors,
//     selectedGender,

//     // methods
//     handleSelectGender,
//     handleInputChange,
//     handleReset,
//     handleInputChangeForm,
//     validateForm,

//     // child form
//     childform,
//     setChildForm,

//     // NEW exported functions
//     handleDurationSelect,
//     handlePickerChange,
//     handleAddChild ,
//     handleNext,
//     isnextButtonDisabled,
//     isaddButtonDisabled,
//     showDatePicker,
//   setShowDatePicker,
//   showTimePickerFrom,
//   setShowTimePickerFrom,
//   showTimePickerTo,
//   setShowTimePickerTo,
//   pickImages,
//   removeImage,
//   showSuccessModal,
//     setShowSuccessModal,
//       role,
//   users,
//   selectedUserId,
//   handleSelectUser,
//   };
// };

// export default useFilterBottomSheetViewModel;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Alert,PermissionsAndroid, Platform } from "react-native";
import moment from "moment";
import strings from '../../localization/en';
import { launchImageLibrary ,launchCamera} from "react-native-image-picker";
import { useTranslation } from 'react-i18next';

import Storage from "../../utils/storage";
import { fetchUserList } from "../../features/auth/User/userSlice";
import { createChildUser } from "../../features/auth/staffSlice/registerNewChild/createChildSlice";

const useFilterBottomSheetViewModel = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();

  /* -------------------- ROLE & USERS -------------------- */
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  /* -------------------- PARENT FORM -------------------- */
  const [form, setForm] = useState<any>({
    phone: "",
    date_of_birth: null,
    guardian_name: "",
    name: "",
    gender: "",
    address: "",
    pictures: [],
    user_id: null,
  });

  const [formError, setFormError] = useState<any>({
    phone: "",
    date_of_birth: "",
    guardian_name: "",
    name: "",
    gender: "",
    address: "",
    user_id: "",
  });

  /* -------------------- CHILD FORM -------------------- */
  const [childform, setChildForm] = useState<any>({
    game_type_id: "",
    play_from: "",
    play_to: "",
    session_date: null,
    play_duration: "",
    price: "",
  });

  const [childformError, setChildFormError] = useState<any>({});

  /* -------------------- UI STATES -------------------- */
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePickerFrom, setShowTimePickerFrom] = useState(false);
  const [showTimePickerTo, setShowTimePickerTo] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
const [errors, setErrors] = useState({});
  /* -------------------- ROLE CHECK -------------------- */
  useEffect(() => {
    checkRoleAndLoadUsers();
      initializeSessionDefaults();

  }, []);
// useEffect(() => {
//   initializeSessionDefaults();
// }, []);
  const checkRoleAndLoadUsers = async () => {
    const storedRole = await Storage.getItem("admin"); // "admin" | "user"
    setRole(storedRole);

    if (storedRole === "admin") {
      loadUsers();
    }
  };
const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "This app needs access to your camera to take photos",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // iOS automatically asks permission at runtime
    return true;
  }
};
const initializeSessionDefaults = () => {
  const nowPlus2Min = moment().add(2, 'minutes');
  setChildForm((prev) => ({
    ...prev,
    session_date: moment().format("YYYY-MM-DD"), // today
    play_from: nowPlus2Min.format("HH:mm"),      // current time + 2 min
    play_to: prev.play_to || "",                 // keep existing if any
    play_duration: prev.play_duration || "",     // keep existing if any
  }));
};
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data: any = await dispatch(fetchUserList()).unwrap();
      console.log( data.data?.data," data.data?.data");
      
      setUsers(
        data.data?.data?.map((u: any) => ({
          label: u.full_name,
          value: u.id,
        }))
      );
    } finally {
      setLoadingUsers(false);
    }
  };
 const handleReset = () => {
    setForm({
      phone: "",
      date_of_birth:null,
      guardian_name: "",
      name: "",
      // playMinutes: "",
      // playHours: "",
      gender: "",
      address:'',
      pictures:[]
    });
    setErrors({});
  };
  /* -------------------- HANDLERS -------------------- */
  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    setForm((prev: any) => ({ ...prev, user_id: userId }));
  };

  const handleInputChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleInputChangeForm = (key: string, value: any) => {
    setChildForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSelectGender = (gender: string) => {
    setSelectedGender(gender);
    setForm((prev: any) => ({ ...prev, gender }));
  };

  const handleDurationSelect = (duration: number) => {
  setChildForm((prev) => {
    const startTime = moment(prev.play_from, "HH:mm");
    const endTime = startTime.clone().add(duration, "minutes");

    return {
      ...prev,
      play_duration: duration,
      play_to: endTime.format("HH:mm"), // auto-fill end time
    };
  });
};
  const formatImage = (item) => ({
  uri: item.uri,
  type: item.type || "image/jpeg",
  fileName: item.fileName || `img_${Date.now()}.jpg`,
});
  const openCamera = async () => {
  if (form.pictures.length >= 5) {
    Alert.alert("Limit reached", "You can upload only 5 images");
    return;
  }

  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert("Permission Denied", "Camera permission is required to take photos");
    return;
  }

  launchCamera(
    {
      mediaType: "photo",
      cameraType: "back",
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel || response.errorCode) return;

      const asset = response.assets?.[0];
      if (!asset) return;

      setForm((prev) => ({
        ...prev,
        pictures: [...prev.pictures, formatImage(asset)],
      }));
    }
  );
};


  /* -------------------- IMAGE PICKER -------------------- */
  const pickImages = () => {
    launchImageLibrary({ mediaType: "photo", selectionLimit: 5 }, (response) => {
      if (response.didCancel || response.errorCode) return;

      const imgs =
        response.assets?.map((item) => ({
          uri: item.uri!,
          type: item.type || "image/jpeg",
          fileName: item.fileName || `img_${Date.now()}.jpg`,
        })) || [];

      setForm((prev: any) => ({
        ...prev,
        pictures: [...prev.pictures, ...imgs],
      }));
    });
  };

  const removeImage = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      pictures: prev.pictures.filter((_: any, i: number) => i !== index),
    }));
  };

  /* -------------------- VALIDATION -------------------- */
   const validateForm = () => {
    const newErrors: any = {};
  // const { t } = useTranslation();
   if (!form.phone || !form.phone.trim()) newErrors.phone = t('validation.phoneRequired');
   if (!form.date_of_birth) newErrors.date_of_birth = t('validation.dateOfBirthRequired');
   if (!form.guardian_name || !form.guardian_name.trim()) newErrors.guardian_name = t('validation.guardianNameRequired');
   if (!form.name || !form.name.trim()) newErrors.name = t('validation.nameRequired');
   if (!form.gender) newErrors.gender = t('validation.genderRequired');
   if (!form.address) newErrors.address = t('validation.addressRequired');
 if (role === "admin" && !form.user_id) {
   newErrors.user_id = t('validation.required');
  }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

     const validateFormadd = () => {
  const newErrors: any = {};
    if (!childform.game_type_id) newErrors.game_type_id = t('validation.gameTypeRequired');
    if (!childform.play_from) newErrors.play_from = t('validation.playFromRequired');
    if (!childform.play_to) newErrors.play_to = t('validation.playToRequired');
    if (!childform.session_date) newErrors.session_date = t('validation.sessionDateRequired');
    if (!childform.play_duration) newErrors.play_duration = t('validation.durationRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- DATE / TIME PICKER -------------------- */
  const closePicker = () => {
    setShowDatePicker(false);
    setShowTimePickerFrom(false);
    setShowTimePickerTo(false);
  };

  const handlePickerChange = (event: any, selectedValue: any) => {
    if (event.type === "dismissed") {
      closePicker();
      return;
    }

    const value = new Date(selectedValue);

    if (showDatePicker) {
      setChildForm((prev: any) => ({
        ...prev,
        session_date: moment(value).format("YYYY-MM-DD"),
      }));
      closePicker();
      return;
    }

    const time = moment(value).format("HH:mm");

    if (showTimePickerFrom) {
      setChildForm((prev: any) => ({ ...prev, play_from: time }));
    }

    if (showTimePickerTo) {
      if (childform.play_from) {
        const from = moment(childform.play_from, "HH:mm");
        const to = moment(time, "HH:mm");
        if (to.isSameOrBefore(from)) {
          Alert.alert(t('validation.playToGreaterThanPlayFromTitle') || 'Validation', t('validation.playToGreaterThanPlayFrom') || 'Play To must be greater than Play From');
          return;
        }
      }
      setChildForm((prev: any) => ({ ...prev, play_to: time }));
    }

    closePicker();
  };

  /* -------------------- NAVIGATION -------------------- */
  const handleNext = () => {
    if (!validateForm()) return;
    navigation.navigate("SessionDetailsScreen", { parentform: form });
  };

  /* -------------------- FINAL SUBMIT -------------------- */
  const handleAddChild = async (parentForm: any) => {
    if (!validateFormadd()) return;

    const payload = { ...parentForm, ...childform };
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      if (key === "pictures") {
        payload.pictures.forEach((img: any) => {
          formData.append("pictures[]", {
            uri: img.uri,
            name: img.fileName,
            type: img.type,
          } as any);
        });
      } else if (key === "date_of_birth" || key === "session_date") {
        formData.append(key, moment(payload[key]).format("YYYY-MM-DD"));
      } else if (key === "play_from" || key === "play_to") {
        formData.append(key, moment(payload[key], "HH:mm").format("HH:mm:ss"));
      } else {
        formData.append(key, payload[key]);
      }
    });
console.log("formdata,",formData);

    try {
      const res = await dispatch(createChildUser(formData)).unwrap();
      console.log('res',res?.data);
      
      if (res?.status) {
        setShowSuccessModal(true);
        // if (role === "admin") navigation.navigate("BottomTabs");
      }
      return res;
    } catch (err) {
      console.log("CREATE CHILD ERROR", err);
    }
  };

  /* -------------------- BUTTON STATES -------------------- */
  const isnextButtonDisabled =
    !form.phone ||
    !form.date_of_birth ||
    !form.guardian_name ||
    !form.name ||
    !form.gender ||(role==='admin'&&!form.user_id)||
    !form.address;

  const isaddButtonDisabled =
    !childform.game_type_id ||
    !childform.play_from ||
    !childform.play_to ||
    !childform.session_date ||
    !childform.play_duration;

  /* -------------------- EXPORT -------------------- */
  return {
    form,
    formError,
    childform,
    childformError,
    role,
    users,
    selectedUserId,
    loadingUsers,
    selectedGender,
    showDatePicker,
    showTimePickerFrom,
    showTimePickerTo,
    showSuccessModal,
    handleReset,
    setShowDatePicker,
    setShowTimePickerFrom,
    setShowTimePickerTo,
    setShowSuccessModal,
    handleSelectUser,
    handleSelectGender,
    handleInputChange,
    handleInputChangeForm,
    handlePickerChange,
    pickImages,
    removeImage,
    handleNext,
    handleAddChild,
    isnextButtonDisabled,
    isaddButtonDisabled,
    handleDurationSelect,
    openCamera
  };
};

export default useFilterBottomSheetViewModel;

