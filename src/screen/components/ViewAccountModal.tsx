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
import strings from '../../localization/en';

export default function ViewAccountModal({ visible, onClose, user }) {
  if (!user) return null;

  const BASE_URL = "https://testlink3.pillersofttechnologies.com/storage/";

  const getFinalProfileImageUrl = (profile_image) => {
    if (!profile_image) return null;
    if (profile_image.startsWith("http")) return profile_image;
    return BASE_URL + profile_image;
  };

  const renderImageRow = (label, urls) => (
    <View style={styles.imageRow}>
      <Text style={styles.label}>{label}</Text>
      {Array.isArray(urls) && urls.length > 0 ? (
        urls.map((img, index) => (
          <Image
            key={index}
            source={{ uri: getFinalProfileImageUrl(img) }}
            style={styles.image}
            resizeMode="cover"
          />
        ))
      ) : (
        <Text style={styles.noImage}>-</Text>
      )}
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* CLOSE BUTTON */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#6B6B6B" />
          </TouchableOpacity>

          {/* TITLE */}
          <Text style={styles.title}>{strings.modal.accountDetails}</Text>

          {/* USER INFO */}
          <View style={styles.infoBox}>
            {renderRow(strings.user.firstName || 'First Name', user.firstname)}
            {renderRow(strings.user.secondName || 'Second Name', user.secondname)}
            {renderRow(strings.user.thirdName || 'Third Name', user.thirdname)}
            {renderRow(strings.user.fourthName || 'Fourth Name', user.fourthname)}
            {renderRow(strings.user.nickname || 'Nickname', user.nickname)}
            {renderRow(strings.user.email || 'Email', user.email)}
            {renderRow(strings.user.phoneNumber || 'Phone', user.phone)}
            {renderRow(strings.user.nationalId || 'National ID', user.national_id_number)}
            {renderRow(strings.user.residenceCard || 'Residency Card', user.residency_card_number)}

            {renderImageRow("National ID Image", user.national_id_urls)}
            {renderImageRow("Residency Card Image", user.residency_card_urls)}
          </View>

          {/* DONE BUTTON */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>{strings.modal.done}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Helper to render label + value row
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
