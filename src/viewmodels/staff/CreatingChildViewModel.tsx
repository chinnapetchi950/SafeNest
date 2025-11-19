import { useState } from "react";

const useFilterBottomSheetViewModel = () => {
  
  const [form, setForm] = useState({
    phone: "",
    dob: "",
    name: "",
    Child_name: "",
    playMinutes: "",
    playHours: "",
    gender: "", // "male" | "female"
  });
 const [childform, setChildForm] = useState({
    gameType: "",
    playFrom: "",
    playTo: "",
    sessionDate: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});
 const [selectedGender, setSelectedGender] = useState(null);

 const handleSelectGender = (gender) => {
    setSelectedGender(gender);
  };
  // ✅ Generic input handler
  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Reset the entire form
  const handleReset = () => {
    setForm({
      phone: "",
      dob: "",
      name: "",
      Child_name: "",
      playMinutes: "",
      playHours: "",
      gender: "",
    });
    setErrors({});
  };

  // ✅ Simple validation (optional)
  const validateForm = () => {
    const newErrors = {};
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!form.name.trim()) newErrors.status = "Status is required";
    if (!form.Child_name.trim()) newErrors.sessionPrice = "Price is required";
    if (!form.playHours && !form.playMinutes)
      newErrors.playHours = "Play hours/minutes required";
    if (!form.gender) newErrors.gender = "Please select gender";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 const handleInputChangeForm = (key, value) => {
    setChildForm((prev) => ({ ...prev, [key]: value }));
  };
  return {
    form,
    errors,selectedGender,handleSelectGender,
    handleInputChange,
    handleReset,childform, setChildForm,handleInputChangeForm,
    validateForm,
  };
};

export default useFilterBottomSheetViewModel;
