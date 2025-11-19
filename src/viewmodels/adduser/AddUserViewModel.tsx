import { useCallback, useState } from "react";
import { Asset, ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/staffSlice/registerSlice";

const useUserInformationViewModel = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 👈 1 = User Info, 2 = Identity Info

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
    const options = { mediaType: "photo", quality: 0.7 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      const picked = response.assets?.[0];
      if (!picked) return;

      // Simulate upload progress
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

      // Update form URI
      handleInputChange(
        type === "nationalId" ? "nationalIdImage" : "residenceCardImage",
        picked.uri
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
      ""
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

 

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const [errors, setErrors] = useState({});
 const validateForm = () => {
  const newErrors: any = {};

  if (!form.firstName.trim()) newErrors.firstName = "First name is required";
  if (!form.secondName.trim()) newErrors.secondName = "Second name is required";
  // if (!form.lastName.trim()) newErrors.lastName = "Nickname is required";

  if (!form.email.trim()) newErrors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    newErrors.email = "Enter a valid email address";

  if (!form.phone.trim()) newErrors.phone = "Phone number is required";
  else if (!/^\d{8,15}$/.test(form.phone))
    newErrors.phone = "Enter a valid phone number";

  if (!form.password.trim()) newErrors.password = "Password is required";
  else if (form.password.length < 6)
    newErrors.password = "Password must be at least 6 characters";

  if (!form.nationalId.trim())
    newErrors.nationalId = "National ID number is required";

  if (!form.nationalIdImage)
    newErrors.nationalIdImage = "National ID image is required";

  if (!form.residenceCard.trim())
    newErrors.residenceCard = "Residence card number is required";

  if (!form.residenceCardImage)
    newErrors.residenceCardImage = "Residence card image is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
 const validateFormFirst = () => {
  const newErrors: any = {};

  if (!form.firstName.trim()) newErrors.firstName = "First name is required";
  if (!form.secondName.trim()) newErrors.secondName = "Second name is required";
  // if (!form.lastName.trim()) newErrors.lastName = "Nickname is required";

  if (!form.email.trim()) newErrors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    newErrors.email = "Enter a valid email address";

  if (!form.phone.trim()) newErrors.phone = "Phone number is required";
  else if (!/^\d{8,15}$/.test(form.phone))
    newErrors.phone = "Enter a valid phone number";

  if (!form.password.trim()) newErrors.password = "Password is required";
  else if (form.password.length < 6)
    newErrors.password = "Password must be at least 6 characters";

  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleRegisterForm = () => {
  const isValid = validateFormFirst();
  if (!isValid) {
    console.log("❌ Form validation failed:", errors);
    return;
  }
  else{
     if (step === 2) setStep(1);
  
  }
}

const handleRegister = () => {
  const isValid = validateForm();
  if (!isValid) {
    console.log("❌ Form validation failed:", errors);
    return;
  }

  const data: {
    firstname: string;
    secondname: string;
    thirdname: string;
    fourthname: string;
    nickname: string;
    email: string;
    phone: string;
    password: string;
    national_id_number: string;
    residency_card_number: string;
    national_id?: { uri: string; type: string; name: string };
    residency_card?: { uri: string; type: string; name: string };
  } = {
    firstname: form.firstName,
    secondname: form.secondName,
    thirdname: form.thirdName,
    fourthname: form.fourthName,
    nickname: form.lastName,
    email: form.email,
    phone: form.phone,
    password: form.password,
    national_id_number: form.nationalId,
    residency_card_number: form.residenceCard,
  };

  // Attach images if available
  if (form.nationalIdImage?.uri) {
    const nationalFile = form.nationalIdImage;
    data.national_id = {
      uri: nationalFile.uri,
      type: nationalFile.type || "image/jpeg",
      name:
        nationalFile.fileName || nationalFile.name || "national-id.jpg",
    };
  }

  if (form.residenceCardImage?.uri) {
    const residenceFile = form.residenceCardImage;
    data.residency_card = {
      uri: residenceFile.uri,
      type: residenceFile.type || "image/jpeg",
      name:
        residenceFile.fileName || residenceFile.name || "residence-card.jpg",
    };
  }

  console.log("✅ Valid Data ready for API:", data);
  dispatch(registerUser(data));
};


  return {
    form,uploading,uploads,
    handleInputChange,file,progress,errors,step, setStep,handleRegisterForm,
    handleRegister,handleRemoveFile,handlePickFile,selectImage
  };
};

export default useUserInformationViewModel;
