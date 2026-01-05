

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "../../features/auth/authService";
import { images } from "../../utils/images";
import strings from "../../localization/en";
import { useTranslation } from 'react-i18next';

export default function WhatsAppManagementScreen({ navigation }) {
  const [enabled, setEnabled] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
const [showSetupFields, setShowSetupFields] = useState(false);
const { t } = useTranslation();

  /* ---------------- LOAD STATUS ---------------- */
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await authService.getSettings();
      console.log("ress===>",res);
      
      setEnabled(res?.data?.data?.is_enabled);
          setShowSetupFields(false);

    } catch (e) {
      console.log(e);
    }
  };

  /* ---------------- PHONE VALIDATION ---------------- */
  const isValidPhone = (value) => /^\+\d{10,15}$/.test(value);
// console.log(isValidPhone,"isValidPhone");

  /* ---------------- TOGGLE ---------------- */
  const handleToggle = async () => {
    try {
      setLoading(true);
      const newValue = !enabled;
      await authService.toggle(newValue);
      setEnabled(newValue);
if (newValue) {
      setShowSetupFields(true);
    } else {
      setShowSetupFields(false);
      setPhone("");
    }
  Alert.alert(t('alerts.success') || 'Success', newValue ? t('settings.whatsappEnabled') || 'WhatsApp enabled' : t('settings.whatsappDisabled') || 'WhatsApp disabled');
    } catch {
  Alert.alert(t('alerts.error') || 'Error', t('settings.whatsappUpdateFailed') || 'Failed to update WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEND OTP ---------------- */
  const sendActivationCode = async () => {
    if (!isValidPhone(phone)) {
      Alert.alert(t('alerts.error') || 'Error', t('settings.invalidPhoneNumber') || 'Enter valid phone number with country code');
      return;
    }

    try {
      setLoading(true);
      let formData=new FormData()
      formData.append('phone_number',phone)
      await authService.sendOtp(formData);

  Alert.alert(t('alerts.success') || 'Success', t('settings.otpSent') || 'OTP sent to WhatsApp');
  navigation.navigate("WhatsappOtpScreen");
    } catch (e) {
      console.log("e",e?.response?.data);

  Alert.alert(t('alerts.error') || 'Error', t('settings.otpSendFailed') || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings.whatsappManagementTitle') || 'WhatsApp Management'}</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: "#ddd", true: "#C9B6FF" }}
              thumbColor={enabled ? "#764AF1" : "#f4f3f4"}
            />

            <View style={styles.rowRight}>
              <Text style={styles.whatsappText}>{t('settings.whatsappText') || 'WhatsApp'}</Text>
              <Image source={images.whatApp} />
            </View>
          </View>

          <Text style={styles.subtitle}>
            {t('settings.whatsappSubtitle') || 'Connect the application to the WhatsApp service'}
          </Text>
        </View>

        {/* CONNECT */}
        {enabled && showSetupFields  && (
          <>
            <Text style={styles.infoText}>
              {t('settings.whatsappInfo') || 'Please enter the phone number linked to the WhatsApp service to complete the connection and receive the activation code.'}
            </Text>

            <Text style={styles.label}>Phone Number</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color="#888" />
              <TextInput
                placeholder={t('settings.phonePlaceholder') || '+91XXXXXXXXXX'}
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!isValidPhone(phone) || loading) && styles.disabled,
              ]}
              disabled={!isValidPhone(phone) || loading}
              onPress={sendActivationCode}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('settings.sendOtpButton') || 'Send OTP'}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    marginHorizontal:8
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFE6FF",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  whatsappText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  infoText: {
    fontSize: 14,
    color: "#777",
    marginTop: 20,
    textAlign:'right',
    lineHeight: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    textAlign:'right'
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth:1,
    borderColor:'#D9D9D9',
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    height: 44,
    marginLeft: 8,
  },

  button: {
    backgroundColor: "#764AF1",
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    bottom:20,
    position:'absolute',
    right:20,
    left:20
    
  },

  disabled: {
    backgroundColor: "#ccc",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});