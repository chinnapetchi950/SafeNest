import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import authService from "../../features/auth/authService";
import strings from "../../localization/en";

export default function WhatsappOtpScreen({ navigation }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    let timer;

    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [resendTimer]);

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    if (otp.length < 4) {
      Alert.alert(strings.alerts.error || 'Error', strings.validation.required || 'Please enter a valid OTP');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOtp(otp);
  Alert.alert(strings.alerts.success || 'Success', strings.settings.whatsappConnectedSuccess || 'WhatsApp connected successfully');
      navigation.goBack();
    } catch (e) {
  Alert.alert(strings.alerts.error || 'Error', strings.settings.whatsappInvalidOtp || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    try {
      setResendLoading(true);
      await authService.resendOtp(); // 🔁 API call
  Alert.alert(strings.alerts.success || 'Success', strings.settings.otpSent || 'A new OTP has been sent');
      setResendTimer(60); // restart timer
    } catch (e) {
  Alert.alert(strings.alerts.error || 'Error', strings.settings.otpResendFailed || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ width: 22 }} />
          <Text style={styles.headerTitle}>{strings.settings.verifyOtpTitle || 'Verify OTP'}</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#333"
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* CONTENT */}
        <Text style={styles.title}>{strings.settings.enterOtpTitle || 'Enter OTP'}</Text>
        <Text style={styles.subtitle}>
          {strings.settings.enterOtpSubtitle || 'Please enter the OTP sent to your WhatsApp number'}
        </Text>

        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          placeholder={strings.settings.enterOtpPlaceholder || 'Enter OTP'}
          placeholderTextColor="#999"
        />

        {/* RESEND SECTION */}
        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in {resendTimer}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={resendOtp}
              disabled={resendLoading}
            >
              <Text style={styles.resendText}>
                {resendLoading ? strings.messageManagement.saving : strings.settings.resendOtp || 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={verifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{strings.settings.verifyOtpButton || 'Verify OTP'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  header: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#333",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
  },

  otpInput: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 20,
  },

  resendContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  timerText: {
    color: "#999",
    fontSize: 14,
  },

  resendText: {
    color: "#764AF1",
    fontSize: 15,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#764AF1",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  disabled: {
    backgroundColor: "#C7B8F5",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
