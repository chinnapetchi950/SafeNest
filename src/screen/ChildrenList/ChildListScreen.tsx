import React, { useState,useEffect,useCallback  } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/Searchcomponent";
import { useDashboardViewModel } from "../../viewmodels/useDashboardViewModel";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FilterBottomSheet from "../components/FilterModal";
import { useSelector } from "react-redux";

import { useFocusEffect } from "@react-navigation/native";
import Storage from "../../utils/storage";
export default function ChildListScreen() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10; // items per page

  const [selectAll, setSelectAll] = useState(false);
  const viewModel=useDashboardViewModel();

  const [children, setChildren] = useState([]);
  const [role, setRole] = useState(null);
  const [visible, setVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [openHour, setOpenHour] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
  
    const [openMinute, setOpenMinute] = useState(false);
    const [selectedMinute, setSelectedMinute] = useState(null);
      const [firstUsername, setFirstUsername] = useState('');
    

    
    

useEffect(() => {
    viewModel.loadChildrenlist();
    
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      const r = await Storage.getItem('admin'); // contains "admin" or "user"
      setRole(r);
    };
    loadRole();
  }, []);
 //Reset to Page 1 When Search Changes
// useEffect(() => {
//   setCurrentPage(1);
// }, [searchText]);

  useEffect(() => {
  if (viewModel?.childrenList?.length) {
    // add selected flag default false
    const updated = viewModel.childrenList.map((item) => ({
      ...item,
      selected: item.selected ?? false,
    }));
    const getFullName = (child) => {
        if (!child) return '';
        return [
          child?.firstname,
          child?.secondname,
          child?.thirdname,
          child?.fourthname,
        ]
          .filter(Boolean)
          .join(' ');
      };

      if (viewModel?.childrenList?.length > 0) {
        const fullName = getFullName(viewModel.childrenList[0].user);
        setFirstUsername(fullName);
      }
    setChildren(updated);
  }
}, [viewModel.childrenList]);

// toggle single child
const toggleSelect = (id) => {
  setChildren((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    )
  );
};

// toggle all
const toggleSelectAll = () => {
  setSelectAll((prev) => {
    const newValue = !prev;
    setChildren((children) =>
      children.map((c) => ({
        ...c,
        selected: newValue,
      }))
    );
    return newValue;
  });
};
const hours = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));
// search filter
const filtered = children.filter((child) =>
  child.name?.toLowerCase().includes(searchText.toLowerCase())
);
const totalPages = Math.ceil(filtered.length / pageSize) || 1;

// paginated data for flatlist
const paginatedData = filtered.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
 const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = new Date(selectedDate);
      const formateDate = formatDate(date);
      const formatted = `${date.getFullYear()}/${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      viewModel.handleInputChange('date_of_birth', formateDate);
    }
  };
const renderCard = ({ item, index }) => {
  // Determine status
  let statusText = "";
  let statusColor = "";
  let badgeBg = "";
  let StatusIcon = null;
  let iconName = "";

  switch (item?.session_status) {
    case "delivered":
      statusText = "Delivered";
      statusColor = "#2563EB"; // Blue
      badgeBg = "#DCE6FB";
      StatusIcon = Ionicons;
      iconName = "checkmark-circle";
      break;
    case "waiting":
      statusText = "Waiting";
      statusColor = "#D69E2E"; // Orange
      badgeBg = "#FDFBF6";
      StatusIcon = Feather;
      iconName = "alert-triangle";
      break;
    default:
      // any other non-waiting status considered Active
      statusText = "Active Now";
      statusColor = "#3AB54A"; // Green
      badgeBg = "#D8F3DC";
      StatusIcon = Ionicons;
      iconName = "checkmark-circle";
      break;
  }

  return (
    <View style={styles.card}>
      {/* LEFT SIDE */}
      <View style={styles.leftBox}>
        <Text style={styles.number}>{index + 1}</Text>
        <Text style={styles.childName}>{item.name}</Text>
        <Text style={styles.childName}>{item.guardian_name}</Text>
        <Text style={styles.childName}>
          {[item?.user?.firstname, item?.user?.secondname, item?.user?.thirdname, item?.user?.fourthname]
            .filter(Boolean)
            .join(" ")}
        </Text>
        <Text style={styles.childName}>{item.phone}</Text>
        <Text style={styles.childName}>{item.address}</Text>
        <Text style={styles.childName}>{item.total_play_duration}</Text>

        {/* Status Badge */}
        <View style={[styles.activeBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.activeText, { color: statusColor }]}>{statusText}</Text>
          <StatusIcon name={iconName} size={16} color={statusColor} />
        </View>
      </View>

      {/* LABELS */}
      <View style={styles.labels}>
        <Text style={styles.label}>No.</Text>
        <Text style={styles.label}>Child Name</Text>
        <Text style={styles.label}>Guardian Name</Text>
        <Text style={styles.label}>User Name</Text>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.label}>Play Hours</Text>
        <Text style={styles.label}>Status</Text>
      </View>

      {/* RIGHT SIDE */}
      <View style={styles.rightBox}>
        <TouchableOpacity
          onPress={() => toggleSelect(item.id)}
          style={[styles.checkbox, item.selected && styles.checkboxChecked]}
        >
          {item.selected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuDots}>
          <Text style={styles.dots}>⋮</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>

    <View style={styles.container}>
      {/* Header */}
      {role!='admin'&&
      <View style={styles.headerRow}>
        <Text style={styles.title}>SafeNest</Text>
        <Text style={styles.userName}>{firstUsername}</Text>
      </View>
}
      {/* Search */}
      <View style={styles.searchWrapper}>
        <SearchBar
                 placeholder="Search for a child"
                 onChangeText={text => viewModel?.handleSearchChange(text)}
                 // onChangeText={text => {}}
                 onSearchPress={() => viewModel.handlechildrenSearch()}
          onFilterPress={() => {
            viewModel.resetFilter(), setVisible(true);
          }}
                //  onSearchPress={() => {}}
                //  onFilterPress={() => {viewModel?.handlechildrenSearch}}
               />
      </View>

      {/* Select All */}
      <View style={styles.selectAllRow}>
        <Text style={styles.selectAllText}>Select All</Text>
        <TouchableOpacity
  onPress={toggleSelectAll}
  style={[
    styles.checkbox,
    selectAll && styles.checkboxChecked,
  ]}
>
  {selectAll && (
    <Ionicons name="checkmark" size={16} color="#fff" />
  )}
</TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination */}
     <View style={styles.pagination}>
  {/* PREVIOUS */}
  <TouchableOpacity
    disabled={currentPage === 1}
    onPress={() => setCurrentPage(prev => prev - 1)}
    style={[
      styles.pageBtn,
      currentPage > 1 && { backgroundColor: "#A278F4" },
      currentPage === 1 && { opacity: 0.3 },
    ]}
  >
    <Ionicons name="chevron-back-outline" size={18} color={currentPage > 1 ? "#fff" : "#000"} />
  </TouchableOpacity>

  {/* PAGE NUMBER */}
  <Text style={styles.pageText}>
    {currentPage} of {totalPages}
  </Text>

  {/* NEXT */}
  <TouchableOpacity
    disabled={currentPage === totalPages}
    onPress={() => setCurrentPage(prev => prev + 1)}
    style={[
      styles.pageBtn,
      currentPage < totalPages && { backgroundColor: "#A278F4" },
      currentPage === totalPages && { opacity: 0.3 },
    ]}
  >
    <Ionicons name="chevron-forward-outline" size={18} color={currentPage < totalPages ? "#fff" : "#000"} />
  </TouchableOpacity>
</View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* <Text style={styles.navIcon}></Text>
        <Text style={styles.navIcon}></Text>
        <View style={styles.addButton}>
          <Text style={{ color: "#fff", fontSize: 24 }}></Text>
        </View>
        <Text style={styles.navIcon}>''</Text>
        <Text style={styles.navIcon}>''</Text> */}
      </View>
    </View>
    <FilterBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        onApply={()=>{setVisible(false),viewModel.handlechildrenSearch}}
        viewModel={viewModel}
        minutes={minutes}
        hours={hours}
        openHour={openHour}
        openMinute={openMinute}
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        setOpenHour={setOpenHour}
        setOpenMinute={setOpenMinute}
        setSelectedHour={setSelectedHour}
        setSelectedMinute={setSelectedMinute}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        handleDateChange={handleDateChange}
      />
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },

  headerRow: { marginTop: 5 },
  title: { color: "#9b59b6", fontWeight: "bold", fontSize: 14,textAlign:'right' },
  userName: { marginTop: 3, color: "#444", fontSize: 16 ,textAlign:'right'},

  searchWrapper: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },

  selectAllRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 10,
    marginBottom:15,
  },
  selectAllText: { fontSize: 14, marginRight: 10, fontWeight: "600" },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#A278F4",
  },
  checkboxChecked: {
    backgroundColor: "#A278F4",
  },

 card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderWidth:1,
    borderColor:'#D9D9D9',
    //borderRadius: 16,
    elevation: 3,
    //marginVertical: 10,
  },

  /* LEFT */
  leftBox: {
    flex: 1,
    gap: 4,
  },
  number: {
    fontSize: 16,
    fontWeight: "600",
  },
  childName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  guardian: {
    fontSize: 14,
    color: "#0D0D0D",
  },
  phone: {
    fontSize: 14,
    color: "#0D0D0D",
  },
  address: {
    fontSize: 14,
    color: "#0D0D0D",
  },
  hours: {
    fontSize: 14,
    color: "#0D0D0D",
  },

  activeBadge: {
    backgroundColor: "#D6F5D6",
    flexDirection: "row",

    paddingVertical: 3,
    paddingHorizontal: 28,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  activeText: {
    color: "#3AB54A",
    fontWeight: "600",
    marginRight: 6
  },
  check: {
    color: "#3AB54A",
    fontWeight: "700",
  },

  /* RIGHT */
  rightBox: {
    width: 100,
    alignItems: "flex-end",
    flexDirection:'column'
  },

  checkBox: {
    width: 24,
    height: 24,
    backgroundColor: "#A278F4",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  menuDots: {
    position: "absolute",
    top: 30,
    right: 10,
  },
  dots: {
    fontSize: 22,
    color: "#444",
  },

  labels: {
    marginTop: 5,
    alignItems: "flex-end",
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#808080",
    fontWeight: "500",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginBottom:'20%'
  },
  pageBtn: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pageText: { marginHorizontal: 20, fontSize: 16, fontWeight: "600" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderRadius: 30,
    //backgroundColor: "#fff",
    //elevation: 8,
  },
  navIcon: { fontSize: 22 },
  addButton: {
    width: 55,
    height: 55,
    backgroundColor: "#A278F4",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});




