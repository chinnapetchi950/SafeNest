import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ViewAccountModal({ visible, onClose, user }) {
  if (!user) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* CLOSE BUTTON */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#6B6B6B" />
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={styles.title}>Account Details</Text>

          {/* USER INFO BOX */}
          <View style={styles.infoBox}>
            {renderRow("First Name", user.firstname)}
            {renderRow("Second Name", user.secondname)}
            {renderRow("Third Name", user.thirdname)}
            {renderRow("Fourth Name", user.fourthname)}
            {renderRow("Nickname", user.nickname)}
            {renderRow("Email", user.email)}
            {renderRow("Phone", user.phone)}
            {renderRow("National ID", user.national_id_number)}
            {renderRow("Residency Card", user.residency_card_number)}

            {/* NATIONAL ID IMAGE */}
            <View style={styles.imageRow}>
              <Text style={styles.label}>National ID Image</Text>
              {Array.isArray(user.national_id_urls) && user.national_id_urls.length > 0 ? (
  user.national_id_urls.map((img, index) => (
    <Image
      key={index}
      source={{ uri: img }}
      style={styles.image}
      resizeMode="cover"
    />
  ))
) : (
  <Text style={styles.noImage}>-</Text>
)}
            </View>

            {/* RESIDENCY CARD IMAGE */}
            <View style={styles.imageRow}>
              <Text style={styles.label}>Residency Card Image</Text>
             {Array.isArray(user.residency_card_urls) && user.residency_card_urls.length > 0 ? (
  user.residency_card_urls.map((img, index) => (
    <Image
      key={index}
      source={{ uri: img }}
      style={styles.image}
      resizeMode="cover"
    />
  ))
) : (
  <Text style={styles.noImage}>-</Text>
)}
            </View>
          </View>

          {/* DONE BUTTON */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const renderRow = (label, value) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "-"}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    //borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1A1A1A",
  },
  infoBox: {
    width: "100%",
    paddingVertical: 10,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  imageRow: {
    marginTop: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  noImage: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#888",
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  doneBtn: {
    backgroundColor: "#4ED76C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  doneText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
