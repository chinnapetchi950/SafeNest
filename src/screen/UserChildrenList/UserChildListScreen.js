import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserChildListScreen = () => {
  const [filterVisible, setFilterVisible] = useState(false);

  const children = [
    {
      id: 1,
      name: "Noor Mohammed Ali",
      guardian: "Mohammed Ali Kadhem",
      phone: "077XXXXXXXX",
      address: "Baghdad - Al-Saydiya",
      playHours: "3 hours, 45 minutes",
      status: "Waiting",
    },
    {
      id: 2,
      name: "Noor Mohammed Ali",
      guardian: "Mohammed Ali Kadhem",
      phone: "077XXXXXXXX",
      address: "Baghdad - Al-Saydiya",
      playHours: "3 hours, 45 minutes",
      status: "Active",
    },
  ];

  return (
    <View style={styles.container}>

      {/* ---------------------- TOP SEARCH BAR ---------------------- */}
      <View style={styles.topRow}>
        {/* Filter button */}
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter-outline" size={18} color="#555" />
        </TouchableOpacity>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#777" />
          <TextInput
            placeholder="Search for a child"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Select All */}
      <View style={styles.selectAllRow}>
        <Text style={styles.selectAllText}>Select All</Text>
        <Ionicons name="square-outline" size={20} />
      </View>

      {/* ---------------------- CHILD LIST ---------------------- */}
      <ScrollView style={{ marginTop: 10 }}>
        {children.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.leftId}>1#</Text>
              <Ionicons name="square-outline" size={22} color="#333" />
              <TouchableOpacity style={{ marginLeft: "auto" }}>
                <Ionicons name="ellipsis-vertical" size={20} color="#777" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.value}>{item.guardian}</Text>
              <Text style={styles.value}>{item.phone}</Text>
              <Text style={styles.value}>{item.address}</Text>
              <Text style={styles.value}>{item.playHours}</Text>
            </View>

            {/* STATUS */}
            {item.status === "Active" ? (
              <View style={styles.activeStatus}>
                <Text style={styles.statusText}>Active Now</Text>
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
              </View>
            ) : (
              <View style={styles.waitingStatus}>
                <Text style={styles.waitingText}>Waiting</Text>
                <Ionicons name="warning" size={14} color="#D97706" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* ---------------------- FILTER MODAL ---------------------- */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Filter</Text>

            <TextInput
              style={styles.input}
              placeholder="Search"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
            />

            <TouchableOpacity style={styles.applyBtn}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={{ color: "#555" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default UserChildListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },

  topRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },

  filterBtn: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },

  selectAllRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    alignItems: "center",
  },

  selectAllText: {
    marginRight: 6,
    fontWeight: "600",
    color: "#444",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  leftId: {
    fontWeight: "700",
    marginRight: 10,
    color: "#333",
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },

  value: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },

  activeStatus: {
    marginTop: 10,
    backgroundColor: "#34D399",
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  statusText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  waitingStatus: {
    marginTop: 10,
    backgroundColor: "#FEF3C7",
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  waitingText: { color: "#B45309", fontSize: 13, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  applyBtn: {
    backgroundColor: "#8B5CF6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  cancelBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F5F5F5",
  },
});
