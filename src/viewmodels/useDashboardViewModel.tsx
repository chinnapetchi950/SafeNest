import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchDashboardChildren } from "../features/auth/dashboardSlice/dashboardSlice";
import { fetchDashboardChildrenfilter } from "../features/auth/dashboardSlice/dashboardfilterslice";

export const useDashboardViewModel = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [childList, setChildList] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    phone: "",
    date_of_birth: "",
    status: "",
    price: "",
    play_hours: "",
    play_minutes: "",
    gender: "",
  });
  const [errors, seterrors] = useState({
    phone: "",
    date_of_birth: "",
    status: "",
    price: "",
    play_hours: "",
    play_minutes: "",
    gender: "",
  });
const [selectedGender, setSelectedGender] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
const [search, setSearch] = useState("");
  const handleChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilter = () => {
    setFilters({
      phone: "",
      date_of_birth: "",
      status: "",
      price: "",
      play_hours: "",
      play_minutes: "",
      gender: "",

    });
    setSelectedGender(null)
  };

 const handleSelectGender = (gender) => {
    console.log('gender',gender)
    setSelectedGender(gender);
      setFilters((prev) => ({ ...prev, gender }));

  };

  const handleInputChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
 const handleSearchChange = (value: string) => {
  setSearch(value);
};

const handleInputChangeForm = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  // Fetch API Data
  const loadChildren = useCallback(async () => {
    try {
      setLoading(true);

      const res: any = await dispatch(fetchDashboardChildren()).unwrap();

      if (res?.status === true) {
        setChildList(res); // PASS DATA TO SCREEN
        return res;
      }

      return null;
    } catch (err) {
      console.log("Dashboard API Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

   const applyFilter = async () => {
    console.log("Sending Filter to API:", filters);

    // Dummy return — replace with API call
    return { status: true, data: filters };
  };
 const handleSearch = async () => {
  try {
    setLoading(true);

    const payload = {
      search: search,                 // text search
      phone: filters.phone,           // phone number
      date_of_birth: filters.date_of_birth, // dob
      gender: filters.gender,
      price:filters.price,
      play_hours: filters.play_hours,
      play_minutes:filters.play_minutes
      //status: filters.status,
    };
   console.log('payload===>',payload)
    const res = await dispatch(fetchDashboardChildrenfilter(payload)).unwrap();

    if (res?.status) {
      setChildList(res);
      console.log("Filter Response:", res);
    }

    return res;

  } catch (err) {
    console.log("Filter Error:", err);
    return null;
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    childList,
    loadChildren,
    showFilterModal,
    setShowFilterModal,
    filters,
    handleChange,
    resetFilter,
    applyFilter,
    errors,
    seterrors,
    selectedGender,
    handleSelectGender,
    handleInputChange,
    handleInputChangeForm,
    handleSearchChange,
    search,setSearch,
    handleSearch,
  };
};
