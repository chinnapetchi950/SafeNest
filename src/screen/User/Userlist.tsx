

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import strings from '../../localization/en';
import SearchBar from "../components/Searchcomponent";
import { useDashboardViewModel } from "../../viewmodels/useDashboardViewModel";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteUsers } from "../../features/auth/User/userSlice";
import { useDispatch } from "react-redux";
import ViewAccountModal from "../components/ViewAccountModal";
export default function UserlistScreen() {
  const viewModel = useDashboardViewModel();

  const dispatch = useDispatch();

  const [userList, setUserlist] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
    const [showAccountModal, setShowAccountModal] = useState(false);
const [user,setUser]=useState({})

  const pageSize = 10;

  useEffect(() => {
    viewModel.loadUserlist();
  }, []);

  useEffect(() => {
    if (viewModel?.UserList?.length) {
      const updated = viewModel.UserList.map((item) => ({
        ...item,
        selected: item.selected ?? false,
      }));
      setUserlist(updated);
    }
  }, [viewModel.UserList]);

  // Toggle select one user
  const toggleSelect = (id) => {
    setUserlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setUserlist((prev) => prev.map((u) => ({ ...u, selected: newValue })));
  };

  // Toggle 3-dot menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Delete selected or single user
  const handleDelete = async (item?: any) => {
    const idsToDelete = item
      ? [item.id]
      : userList.filter((u) => u.selected).map((u) => u.id);

    if (idsToDelete.length === 0) {
      Alert.alert(strings.userList.noUserSelectedTitle, strings.userList.noUserSelectedMessage);
      return;
    }

    Alert.alert(
      strings.userList.confirmDeleteTitle,
      strings.userList.confirmDeleteMessage.replace('{count}', String(idsToDelete.length)),
      [
        { text: strings.common.cancel, style: "cancel" },
        {
          text: strings.common.delete,
          style: "destructive",
          onPress: async () => {
            try {
              const res = await dispatch(deleteUsers(idsToDelete)).unwrap();
              if (res?.status === true) {
                Alert.alert(strings.common.success || 'Success', strings.userList.userDeletedSuccess);
                viewModel?.loadUserlist();
                setSelectAll(false);
              }
            } catch (err: any) {
              Alert.alert(strings.common.error || 'Error', err || strings.userList.failedToDeleteUsers);
            }
          },
        },
      ]
    );
  };

  // Search filter
  const filtered = userList.filter((user) =>
    [user.firstname, user.secondname, user.thirdname, user.fourthname]
      .join(" ")
      .toLowerCase()
      .includes(searchText?.toLowerCase() || "")
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderCard = ({ item, index }) => (
    <TouchableOpacity onPress={()=>{ setUser(item),setShowAccountModal(true)}} style={styles.card}>
      {/* LEFT */}
      <View style={styles.leftBox}>
        <Text style={styles.number}>{index + 1}</Text>
        <Text style={styles.childName}>
          {[item?.firstname, item?.secondname, item?.thirdname, item?.fourthname]
            .filter(Boolean)
            .join(" ")}
        </Text>
        <Text style={styles.childName}>{item.phone}</Text>
        <Text style={styles.childName}>{item.email}</Text>
      </View>

      {/* LABELS */}
      <View style={styles.labels}>
        <Text style={styles.label}>{strings.userList.no}</Text>
        <Text style={styles.label}>{strings.userList.userName}</Text>
        <Text style={styles.label}>{strings.userList.phoneNumber}</Text>
        <Text style={styles.label}>{strings.userList.email}</Text>
      </View>

      {/* RIGHT */}
      <View style={styles.rightBox}>
        <TouchableOpacity
          onPress={() => toggleSelect(item.id)}
          style={[styles.checkbox, item.selected && styles.checkboxChecked]}
        >
          {item.selected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuDotss} onPress={() => toggleMenu(item.id)}>
          <Text style={styles.dotss}>⋮</Text>
        </TouchableOpacity>

        {openMenuId === item.id && (
          <View style={styles.popupMenu}>
            <TouchableOpacity
              onPress={() => {
                setOpenMenuId(null);
                // onEdit(item); // optional edit
              }}
            >
              <Text style={styles.menuItem}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOpenMenuId(null);
                handleDelete(item);
              }}
            >
              <Text style={[styles.menuItem, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder={strings.userList.searchPlaceholder}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>

        {/* Select All + Delete Selected */}
      <View style={{ flexDirection: "column", marginVertical: 10 }}>
  {/* Select All Row */}
  <View style={styles.selectAllRow}>
  <Text style={styles.selectAllText}>{strings.userList.selectAll}</Text>
    <TouchableOpacity
      onPress={toggleSelectAll}
      style={[styles.checkbox, selectAll && styles.checkboxChecked]}
    >
      {selectAll && <Ionicons name="checkmark" size={16} color="#fff" />}
    </TouchableOpacity>
  </View>

  {/* Delete Selected Button */}
 {Array.isArray(userList) && userList.some(user => user.selected)&& (
    <TouchableOpacity
      onPress={() => handleDelete()}
      style={{
        backgroundColor: "#A278F4",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: "flex-end",
       // marginTop: 10,
      }}
    >
  <Text style={{ color: "#fff", fontWeight: "bold" }}>{strings.userList.deleteSelected}</Text>
    </TouchableOpacity>
  )}

</View>


        {/* User List */}
        <FlatList
          data={paginatedData}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
                <Text style={{ fontSize: 16, color: "#888" }}>No data available</Text>
              </View>
            )}
        />

        {/* Pagination */}
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((prev) => prev - 1)}
            style={[
              styles.pageBtn,
              currentPage > 1 && { backgroundColor: "#A278F4" },
              currentPage === 1 && { opacity: 0.3 },
            ]}
          >
            <Ionicons
              name="chevron-back-outline"
              size={18}
              color={currentPage > 1 ? "#fff" : "#000"}
            />
          </TouchableOpacity>

          <Text style={styles.pageText}>
            {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage((prev) => prev + 1)}
            style={[
              styles.pageBtn,
              currentPage < totalPages && { backgroundColor: "#A278F4" },
              currentPage === totalPages && { opacity: 0.3 },
            ]}
          >
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={currentPage < totalPages ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
       <ViewAccountModal
        visible={showAccountModal}
        user={user}
        onClose={() =>{setShowAccountModal(false)}}
      />
    </SafeAreaView>
  );
}

// Keep your styles as is


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
  popupMenu: {
  position: "absolute",
  right: 10,
  top: 25,
  backgroundColor: "#fff",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 6,
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  zIndex: 99,
},

menuItem: {
  paddingVertical: 6,
  paddingHorizontal: 4,
  fontSize: 14,
},

menuDotss: {
  padding: 8,
},

dotss: {
  fontSize: 20,
  fontWeight: "bold",
},

});




