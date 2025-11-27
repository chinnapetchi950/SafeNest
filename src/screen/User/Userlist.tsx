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
import { useFocusEffect } from "@react-navigation/native";

export default function UserlistScreen() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10; // items per page

  const [selectAll, setSelectAll] = useState(false);
  const viewModel=useDashboardViewModel();

  const [userList, setUserlist] = useState([]);
useEffect(() => {
    viewModel.loadUserlist();
  }, []);

 //Reset to Page 1 When Search Changes
// useEffect(() => {
//   setCurrentPage(1);
// }, [searchText]);
console.log("viewModel?.UserList",viewModel?.UserList);

  useEffect(() => {
  if (viewModel?.UserList?.length) {
    // add selected flag default false
    const updated = viewModel.UserList.map((item) => ({
      ...item,
      selected: item.selected ?? false,
    }));
    setUserlist(updated);
  }
}, [viewModel.UserList]);

// toggle single child
const toggleSelect = (id) => {
  setUserlist((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    )
  );
};

// toggle all
const toggleSelectAll = () => {
  setSelectAll((prev) => {
    const newValue = !prev;
    setUserlist((user) =>
      user.map((c) => ({
        ...c,
        selected: newValue,
      }))
    );
    return newValue;
  });
};

// search filter
const filtered = userList.filter((user) =>
  user.name?.toLowerCase().includes(searchText.toLowerCase())
);
const totalPages = Math.ceil(filtered.length / pageSize) || 1;

// paginated data for flatlist
const paginatedData = filtered.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
  const renderCard = ({ item,index }) => (
    <View style={styles.card}>

      {/* LEFT SIDE */}
      <View style={styles.leftBox}>
        <Text style={styles.number}>{index+1}</Text>

        <Text style={styles.childName}>{item.firstname}</Text>
        <Text style={styles.childName}>{item.phone}</Text>
        <Text style={styles.childName}>{item.email}</Text>
        
        
      </View>
      <View style={styles.labels}>
          <Text style={styles.label}>No.</Text>
          <Text style={styles.label}>UserName</Text>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.label}>Email</Text>
        </View>
      {/* RIGHT SIDE */}
      <View style={styles.rightBox}>
        {/* <TouchableOpacity style={styles.checkBox}>
          <Text style={{ color: "#fff" }}>✔</Text>
        </TouchableOpacity> */}
         <TouchableOpacity
          onPress={() => toggleSelect(item.id)}
          style={[
            styles.checkbox,
            item.selected && styles.checkboxChecked,
          ]}
        >
  {item.selected && (
    <Ionicons name="checkmark" size={16} color="#fff" />
  )}
  </TouchableOpacity>
        <TouchableOpacity style={styles.menuDots}>
          <Text style={styles.dots}>⋮</Text>
        </TouchableOpacity>

      </View>

    </View>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>game management</Text>
        <Text style={styles.userName}>Sarah Saad</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <SearchBar
                 placeholder="Search for a child"
                 onChangeText={text => viewModel?.handleSearchChange(text)}
                 // onChangeText={text => {}}
                 onSearchPress={() => {}}
                 onFilterPress={() => {}}
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
        data={userList}
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
        <Text style={styles.navIcon}></Text>
        <Text style={styles.navIcon}></Text>
        <View style={styles.addButton}>
          <Text style={{ color: "#fff", fontSize: 24 }}></Text>
        </View>
        <Text style={styles.navIcon}>''</Text>
        <Text style={styles.navIcon}>''</Text>
      </View>
    </View>
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
    color: "#0A8A25",
    fontWeight: "600",
    marginRight: 6
  },
  check: {
    color: "#0A8A25",
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




