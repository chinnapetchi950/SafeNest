import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import strings from '../../localization/en';
import { useTranslation } from 'react-i18next';

export default function SuccessModal({
  visible,
  onClose,
  onDone,
  onViewAccount,
}) {
  const { t } = useTranslation();
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>

        {/* CARD */}
        <View style={styles.card}>

          {/* GREEN HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("modal.accountCreationCard")}</Text>

            <TouchableOpacity onPress={onClose} style={styles.headerCloseBtn}>
              <Ionicons name="close" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* CHECK ICON */}
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={38} color="#fff" />
          </View>

          {/* MAIN TITLE */}
          <Text style={styles.mainTitle}>{t("modal.accountCreatedTitle")}</Text>

          {/* DESCRIPTION */}
          <Text style={styles.description}>{t("modal.accountCreatedDesc1")}</Text>
          <Text style={styles.description}>{t("modal.accountCreatedDesc2")}</Text>

          {/* DIVIDER */}
          <View style={styles.divider} />

          {/* BUTTONS */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
              <Text style={styles.doneText}>{t("modal.done")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.viewBtn} onPress={onViewAccount}>
              <Text style={styles.viewText}>{t("modal.viewAccount")}</Text>
            </TouchableOpacity>
          </View>

          {/* GREEN FOOTER STRIP */}
          <View style={styles.bottomStrip} />

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.40)",
    justifyContent: 'flex-end',
    alignItems: "center",
  },

  card: {
    width: "100%",
    //paddingTop:10,
    backgroundColor: "#fff",
    borderTopRightRadius:18,
    borderTopLeftRadius:18,
    // borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  /* HEADER */
  header: {
    backgroundColor: "#D7F8D7",
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "600",
  },

  headerCloseBtn: {
    position: "absolute",
    right: 15,
    top: 12,
  },

  /* SUCCESS ICON */
  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#3AB54A",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },

  /* MAIN TITLE */
  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#2E7D32",
    marginTop: 8,
  },

  /* DESCRIPTION */
  description: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 20,
  },

  /* DIVIDER */
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "100%",
    marginTop: 20,
  },

  /* BUTTONS */
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 20,
  },

  doneBtn: {
    backgroundColor: "#D7F8D7",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },

  doneText: {
    color: "#3AB54A",
    fontSize: 15,
    fontWeight: "600",
  },

  viewBtn: {
    borderColor: "#D9D9D9",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    backgroundColor: "#fff",
  },

  viewText: {
    color: "#6B6B6B",
    fontSize: 15,
    fontWeight: "600",
  },

  /* FOOTER GREEN STRIP */
  bottomStrip: {
    height: 18,
    backgroundColor: "#D7F8D7",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
});
