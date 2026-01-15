import { useState, useCallback,useMemo  } from "react";
import { useDispatch } from "react-redux";
import { fetchDashboardChildren } from "../features/auth/dashboardSlice/dashboardSlice";
import { fetchDashboardChildrenfilter } from "../features/auth/dashboardSlice/dashboardfilterslice";
import { fetchChildrenList } from "../features/auth/children/childrenListslice";
import { fetchUserList } from "../features/auth/User/userSlice";
import { fetchchildrenlistfilter } from "../features/auth/children/childrenfilterSlice";
import { childHandover } from "../features/auth/staffSlice/registerNewChild/createChildSlice";
import { Alert } from "react-native";
import strings from "../localization/en";
import authService from "../features/auth/authService";
import { useTranslation } from 'react-i18next';

export const useDashboardViewModel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [childList, setChildList] = useState([]);
    const [childrenList, setChildrenList] = useState([]);
        const [UserList, setUserList] = useState([]);

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
const [showModal, setShowModal] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
 const isApplyDisabled = useMemo(
    () => Object.values(filters).every((value) => value === "" || value === null),
    [filters]
  );
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
      // setLoading(true);

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
      // setLoading(false);
    }
  }, []);

  const loadChildrenlist = useCallback(async () => {
    try {
      setLoading(true);

      const res: any = await dispatch(fetchChildrenList()).unwrap();

      if (res?.status === true) {
        setChildrenList(res?.data); // PASS DATA TO SCREEN
        return res;
      }

      return null;
    } catch (err) {
      console.log("childrenlist API Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  const loadUserlist = useCallback(async () => {
    try {
      setLoading(true);

      const res: any = await dispatch(fetchUserList()).unwrap();

      if (res?.status === true) {
        setUserList(res?.data?.data); // PASS DATA TO SCREEN
        return res;
      }

      return null;
    } catch (err) {
      console.log("userlist API Error:", err);
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
  console.log("pppp");
  
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
const handlechildrenSearch = async () => {
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
    const res = await dispatch(fetchchildrenlistfilter(payload)).unwrap();

    if (res?.status) {
      setChildrenList(res?.data);
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

const childHandoverdata = async (data) => {
  try {
    setLoading(true);

   const formData = new FormData();
   //formData.append("_method", "PATCH");
           // formData.append("password", "DELETE");
      formData.append("qr_data",data)
      console.log('formDataformData',formData);
      

    const res = await dispatch(childHandover(formData)).unwrap();
  

    if (res?.status) {
      //setChildrenList(res?.data);
      console.log("child Response:", res);
  Alert.alert(t('alerts.success') || 'Success', res.message)

       loadChildren()
       setShowModal(false)
    }

    return res;

  } catch (err) {
    console.log("child Error:", err);
    return null;
  } finally {
    setLoading(false);
  }
};
const endChildSession = (childId) => {
  Alert.alert(
    'Confirm',
    'Are you sure you want to end this session?',
    [
      {
        text: t('common.cancel') || 'Cancel',
        style: 'cancel',
      },
      {
        text: t('common.yes') || 'Yes',
        onPress: async () => {
          try {
            setLoading(true);

            const formData = new FormData();
            formData.append('_method', 'PATCH');

            const res = await authService.childendSession(childId, formData);

            console.log('END SESSION RES:', res);

            Alert.alert(
              t('alerts.success') || 'Success',
              res.data?.message
            );

            loadChildren();
          } catch (error) {
            console.log('End Session Error:', error?.response);
            Alert.alert(
              t('alerts.error') || 'Error',
              error?.response?.data?.message || 'Something went wrong'
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ],
    { cancelable: true }
  );
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
    childrenList,
    loadChildrenlist,
    UserList,loadUserlist,
    handlechildrenSearch,
    childHandoverdata,
    showModal,setShowModal,
    endChildSession,
    isApplyDisabled
  };
};
