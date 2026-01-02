import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const useRegisterChildViewModel = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    gameType: "",
    playFrom: "",
    playTo: "",
    sessionDate: "",
    duration: "",
  });

  const [errors, setErrors] = useState({
    gameType: "",
    playFrom: "",
    playTo: "",
    sessionDate: "",
    duration: "",
  });

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev)=>({...prev, [key]: ""}));   // clear error while typing
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!form.gameType) {
      newErrors.gameType = "Select game type";
      valid = false;
    }

    if (!form.playFrom) {
      newErrors.playFrom = "Select play from time";
      valid = false;
    }

    if (!form.playTo) {
      newErrors.playTo = "Select play to time";
      valid = false;
    }

    if (!form.sessionDate) {
      newErrors.sessionDate = "Select date";
      valid = false;
    }

    if (!form.duration) {
      newErrors.duration = "Select duration";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitChildSession = () => {
    if (!validateForm()) return;

    console.log("Final Form:", form);

    // After success
    navigation.navigate('SessionDetailsScreen');
  };

  const isButtonDisabled =
    !form.gameType ||
    !form.playFrom ||
    !form.playTo ||
    !form.sessionDate ||
    !form.duration;

  return {
    form,
    errors,
    handleInputChange,
    submitChildSession,
    isButtonDisabled,
  };
};

export default useRegisterChildViewModel;
