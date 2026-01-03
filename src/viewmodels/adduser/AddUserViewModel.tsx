import { useCallback, useState } from "react";
import { Asset, ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/staffSlice/registerSlice";
import { Alert } from "react-native";
import strings from "../../localization/en";

const useUserInformationViewModel = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 👈 1 = User Info, 2 = Identity Info
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setuser] = useState({});

 const [form, setForm] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    nationalId: "",
    nationalIdImage: "",
    residenceCard: "",
    residenceCardImage: "",
  });
 const [uploads, setUploads] = useState({
    nationalId: { file: null as Asset | null, progress: 0 },
    residence: { file: null as Asset | null, progress: 0 },
  });
const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);




  

 const selectImage = useCallback((type: "nationalId" | "residence") => {
  const options: ImageLibraryOptions = { mediaType: "photo", quality: 0.7 };

  launchImageLibrary(options, (response: ImagePickerResponse) => {
    if (response.didCancel) return;

    const picked: Asset | undefined = response.assets?.[0];
    if (!picked) return;

    // Start progress animation
    setUploads((prev) => ({
      ...prev,
      [type]: { file: picked, progress: 0 },
    }));

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 0.1;
      if (progressValue >= 1) {
        progressValue = 1;
        clearInterval(interval);
      }
      setUploads((prev) => ({
        ...prev,
        [type]: { ...prev[type], progress: progressValue },
      }));
    }, 200);

    // FIXED: Save full file object (NOT just URI)
    const fileObj = {
      uri: picked.uri,
      type: picked.type || "image/jpeg",
      fileName: picked.fileName || `image-${Date.now()}.jpg`,
    };

    handleInputChange(
      type === "nationalId" ? "nationalIdImage" : "residenceCardImage",
      fileObj
    );
  });
}, []);


  const handleRemoveFile = (type: "nationalId" | "residence") => {
  setUploads((prev) => ({
    ...prev,
    [type]: { file: null, progress: 0 },
  }));

  handleInputChange(
    type === "nationalId" ? "nationalIdImage" : "residenceCardImage",
    null
  );
};



  
  const handlePickFile = () => {
  launchImageLibrary({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      console.log('ImagePicker Error:', response.errorMessage);
      return;
    }

    const picked: Asset | undefined = response.assets?.[0];
    if (!picked) return;

    setFile(picked);
    uploadFile(picked);
  });
};

  const uploadFile = async (picked) => {
    setUploading(true);
    setProgress(0);

    // Simulated upload progress
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 0.1;
      if (progressValue >= 1) {
        progressValue = 1;
        clearInterval(interval);
        setUploading(false);
      }
      setProgress(progressValue);
    }, 200);
  };
//   const isStep1Valid = () => {
//   return (
//     !!form.firstName.trim() &&
//     !!form.secondName.trim() &&
//     !!form.email.trim() &&
//     /^\S+@\S+\.\S+$/.test(form.email) &&
//     !!form.phone.trim() &&
//     /^\d{8,15}$/.test(form.phone) &&
//     !!form.password.trim() &&
//     form.password.length >= 6
//   );
// };
const isStep1Valid = () => {
  return (
    !!form.firstName.trim() &&
    !!form.secondName.trim() &&
    !!form.email.trim() &&
    !!form.email.trim() &&   // FIXED
    !!form.phone.trim() &&
    !!form.phone.trim() &&       // EXTRA FIX
    !!form.password.trim() &&
    form.password.trim().length >= 8              // EXTRA FIX
  );
};
// console.log(isStep1Valid,'isStep1Valid');

// STEP 2 VALIDATION (Dynamic Button Disable)
const isStep2Valid = () => {
  return (
    !!form.nationalId.trim() &&
    !!form.nationalIdImage &&
    !!form.residenceCard.trim() &&
    !!form.residenceCardImage
  );
};
 

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const [errors, setErrors] = useState({});
 const validateForm = () => {
  const newErrors: any = {};

  if (!form.firstName.trim()) newErrors.firstName = strings.validation.firstNameRequired;
  if (!form.secondName.trim()) newErrors.secondName = strings.validation.secondNameRequired;
  // if (!form.lastName.trim()) newErrors.lastName = strings.validation.nicknameRequired;

  if (!form.email.trim()) newErrors.email = strings.validation.emailRequired;
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    newErrors.email = strings.validation.emailInvalid;

  if (!form.phone.trim()) newErrors.phone = strings.validation.phoneRequired;
  else if (!/^\d{8,15}$/.test(form.phone))
    newErrors.phone = strings.validation.phoneInvalid;

  if (!form.password.trim()) newErrors.password = strings.validation.passwordRequired;
  else if (form.password.length < 6)
    newErrors.password = strings.validation.passwordMinLength;

  if (!form.nationalId.trim())
    newErrors.nationalId = strings.validation.nationalIdRequired || "National ID number is required";

  if (!form.nationalIdImage)
    newErrors.nationalIdImage = strings.validation.nationalIdImageRequired || "National ID image is required";

  if (!form.residenceCard.trim())
    newErrors.residenceCard = strings.validation.residenceCardRequired || "Residence card number is required";

  if (!form.residenceCardImage)
    newErrors.residenceCardImage = strings.validation.residenceCardImageRequired || "Residence card image is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
 const validateFormFirst = () => {
  const newErrors: any = {};

  if (!form.firstName.trim()) newErrors.firstName = strings.validation.firstNameRequired;
  if (!form.secondName.trim()) newErrors.secondName = strings.validation.secondNameRequired;
  // if (!form.lastName.trim()) newErrors.lastName = strings.validation.nicknameRequired;

  if (!form.email.trim()) newErrors.email = strings.validation.emailRequired;
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    newErrors.email = strings.validation.emailInvalid;

  if (!form.phone.trim()) newErrors.phone = strings.validation.phoneRequired;
  else if (!/^\d{8,15}$/.test(form.phone))
    newErrors.phone = strings.validation.phoneInvalid;

  if (!form.password.trim()) newErrors.password = strings.validation.passwordRequired;
  else if (form.password.length < 6)
    newErrors.password = strings.validation.passwordMinLength;

  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleRegisterForm = () => {
  const isValid = validateFormFirst();
  if (!isValid) {
         //if (step === 1) setStep(2);

    console.log("❌ Form validation failed:", errors);
    return;
  }
  else{
    console.log(step);
    
     if (step === 1) setStep(2);
  
  }
}

const handleRegister = async () => {
  try {
    const isValid = validateForm();
    if (!isValid) {
      const msg = Object.values(errors).join("\n");
  Alert.alert(strings.alerts.error || 'Error', msg);
      return;
    }

    const formData = new FormData();

    formData.append("firstname", form.firstName);
    formData.append("secondname", form.secondName);
    formData.append("thirdname", form.thirdName);
    formData.append("fourthname", form.fourthName);
    formData.append("nickname", form.lastName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("national_id_number", form.nationalId);
    formData.append("residency_card_number", form.residenceCard);
console.log('form.nationalIdImage?.uri',form.nationalIdImage?.uri);

    // NATIONAL ID IMAGE
    if (form.nationalIdImage?.uri) {
      formData.append("national_id[]", {
        uri: form.nationalIdImage.uri,
        type: form.nationalIdImage.type || "image/jpeg",
        name: form.nationalIdImage.fileName || "national-id.jpg",
      });
    }

    // RESIDENCY CARD IMAGE
    if (form.residenceCardImage?.uri) {
      formData.append("residency_card[]", {
        uri: form.residenceCardImage.uri,
        type: form.residenceCardImage.type || "image/jpeg",
        name: form.residenceCardImage.fileName || "residence-card.jpg",
      });
    }

    console.log("📤 Final FormData sending to API:", formData);

    const res = await dispatch(registerUser(formData)).unwrap();
    setuser(res?.data);

    if (res?.status === true) {
      setShowSuccess(true);
    }
    

  } catch (error) {
  console.log("❌ Registration failed --->", JSON.stringify(error, null, 2));

  setShowSuccess(false);

  // Axios error data
  const errData = error?.response?.data;

  if (errData) {
    // 1️⃣ Validation errors (e.g., phone already taken)
    if (errData.errors && typeof errData.errors === "object") {
      const messages = Object.values(errData.errors)
        .flat()
        .join("\n");
  Alert.alert(strings.alerts.error || 'Error', messages);
      return;
    }

    // 2️⃣ Server message
    if (errData.message) {
  Alert.alert(strings.alerts.error || 'Error', errData.message);
      return;
    }
  }

  // 3️⃣ Fallback
  Alert.alert(strings.alerts.error || 'Error', strings.alerts.error || 'Something went wrong. Please try again.');
}

};



  return {
    form,uploading,uploads,
    handleInputChange,file,progress,errors,step, setStep,handleRegisterForm,
    handleRegister,handleRemoveFile,handlePickFile,selectImage,isStep1Valid,
  isStep2Valid,showSuccess,setShowSuccess,setuser,user
  };
};

export default useUserInformationViewModel;
