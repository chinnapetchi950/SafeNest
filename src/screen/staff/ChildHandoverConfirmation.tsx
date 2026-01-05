import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import moment from "moment";
import strings from "../../localization/en";
import { useTranslation } from 'react-i18next';

const ChildHandoverConfirmation = ({ data, onClose,onconfirm }) => {
  const child = JSON.parse(data?.barcode)
  const { t } = useTranslation();

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.overlay} />

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetTitle}>{t('confirmation.title')}</Text>

          <View style={styles.infoCard}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>{t('child.guardianLabel')}</Text>
                <Text style={styles.value}>{child.guardian_name}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>{t('child.childNameLabel')}</Text>
                <Text style={styles.value}>{child.child_name}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>{t('child.sessionDateLabel') || t('session.sessionDate')}</Text>
                <Text style={styles.value}>{child.session_date}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>{t('child.dateOfBirth') || t('child.dateOfBirth')}</Text>
                <Text style={styles.value}>{moment(child.date_of_birth).format('YYYY-MM-DD')}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>{t('child.sessionPrice') || t('child.sessionPrice')}</Text>
                <Text style={styles.value}>{child.calculated_price}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>{t('child.sessionDuration') || t('child.sessionDuration')}</Text>
                <Text style={styles.value}>{child.total_play_duration}</Text>
              </View>
            </View>

            {/* <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Scanned Code</Text>
                <Text style={[styles.value, { color: "#A96FFF" }]}>
                  {child.barcode}
                </Text>
              </View>
            </View> */}
          </View>
<View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>


          <TouchableOpacity onPress={onconfirm} style={styles.confirmBtn}>
            <Text style={styles.confirmText}>{t('handover.confirm')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ChildHandoverConfirmation;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  sheet: {
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    position: "absolute",
    bottom: 0,
    maxHeight: "80%",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  confirmBtn: {
    backgroundColor: "#A278F4",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
        marginBottom: 15,

    flex:0.60,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",

  },
  cancelBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    marginTop: 20,
    marginBottom: 15,
            flex:0.38,

  },
  cancelText: {
    color: "#333",
    fontSize: 16,
  },
});
