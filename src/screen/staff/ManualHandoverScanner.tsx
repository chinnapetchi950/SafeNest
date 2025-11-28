import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Camera, useCameraDevices } from "react-native-vision-camera";
import { scanBarcodes, BarcodeFormat } from "@react-native-ml-kit/barcode-scanning";

const ManualHandoverScanner = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const devices = useCameraDevices();
  const device = devices.back;

  // ---------------------------
  // CAMERA PERMISSION
  // ---------------------------
  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === "granted");
    })();
  }, []);

  // ---------------------------
  // FRAME PROCESSOR (MLKit)
  // ---------------------------
  const onFrame = async (frame) => {
    if (scanned) return;

    try {
      const barcodes = await scanBarcodes(frame, [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.CODE_128,
        BarcodeFormat.EAN_13,
      ]);

      if (barcodes.length > 0) {
        const value = barcodes[0]?.displayValue;

        if (value) {
          setScanned(true);

          navigation.navigate("ChildHandoverConfirmation", {
            barcode: value,
          });

          setTimeout(() => setScanned(false), 2000);
        }
      }
    } catch (err) {
      console.log("Scan error:", err);
    }
  };

  // ---------------------------
  // PERMISSION NOT GIVEN
  // ---------------------------
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "#fff", fontSize: 16 }}>
          Camera permission denied.
        </Text>

        <TouchableOpacity
          onPress={() => Camera.requestCameraPermission()}
          style={styles.permissionBtn}
        >
          <Text style={{ color: "#fff" }}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (device == null || hasPermission === null) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "#fff", fontSize: 16 }}>Initializing camera...</Text>
      </SafeAreaView>
    );
  }

  // ---------------------------
  // MAIN UI
  // ---------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Manual Handover</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* CAMERA */}
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        onFrame={onFrame}
        frameProcessorFps={5}
      />

      {/* Overlay Scanner Frame */}
      <View style={styles.overlayCenter}>
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan Code</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManualHandoverScanner;

// ------------------------------------
// STYLES
// ------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3E3E3E",
  },

  headerRow: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  backText: {
    color: "#fff",
    marginRight: 4,
  },

  camera: {
    flex: 1,
  },

  overlayCenter: {
    position: "absolute",
    top: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  scanBox: {
    width: 250,
    height: 250,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
  },

  corner: {
    position: "absolute",
    width: 35,
    height: 35,
    borderColor: "#B072FF",
    borderWidth: 4,
  },

  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  scanButton: {
    margin: 20,
    backgroundColor: "#A96FFF",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  scanButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  center: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  permissionBtn: {
    marginTop: 15,
    backgroundColor: "#A96FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
