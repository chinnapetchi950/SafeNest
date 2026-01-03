
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { BarcodeScanner, CameraView } from "@pushpendersingh/react-native-scanner";
import strings from "../../localization/en";

const ManualHandoverScanner = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: strings.manualHandover.title || 'Camera Permission',
              message: strings.manualHandover.cameraRequired || 'App needs access to your camera to scan barcodes',
              buttonNeutral: strings.common.askMeLater || 'Ask Me Later',
              buttonNegative: strings.common.cancel || 'Cancel',
              buttonPositive: strings.common.ok || 'OK',
            }
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(strings.alerts.error || 'Permission Denied', strings.manualHandover.cameraRequired || 'Camera permission is required to scan barcodes.');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        setHasPermission(true); // iOS
      }
    };

    requestCameraPermission();
  }, []);

  // Start scanning automatically when permission is granted
  useEffect(() => {
    if (hasPermission) {
      startScanning();
    }
  }, [hasPermission]);

  const startScanning = async () => {
    if (!hasPermission) return;

    try {
      setScanning(true);
      await BarcodeScanner.startScanning((barcodes) => {
        console.log(barcodes,"barcodes");
        
        if (barcodes.length > 0 && !scanned) {
          const barcode = barcodes[0];
          console.log(barcode.data,"barcode.databarcode.databarcode.databarcode.data");
          
          setBarcodeData(barcode.data);
          setScanned(true);
          stopScanning();
        }
      });
    } catch (error) {
      console.error("Failed to start scanning:", error);
    }
  };

  const stopScanning = async () => {
    try {
      await BarcodeScanner.stopScanning();
      setScanning(false);
    } catch (error) {
      console.error("Failed to stop scanning:", error);
    }
  };

  const handleProceed = () => {
    if (!scanned) return;

    navigation.navigate("BottomTabsStaff", {
      screen: "Dashboard",
      params: {
        scannedBarcode: barcodeData,
        showHandoverModal: true,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{strings.manualHandover.title}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{strings.common.back}</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {hasPermission ? (
        <CameraView
          style={styles.camera}
          onBarcodeDetected={(barcode) => {
            if (!scanned) {
              setBarcodeData(barcode.data);
              setScanned(true);
              stopScanning();
            }
          }}
        />
      ) : (
        <View style={[styles.camera, { justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "#fff" }}>{strings.manualHandover.cameraRequired}</Text>
        </View>
      )}

      <View style={styles.overlayCenter}>
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
     <TouchableOpacity
     onPress={()=>handleProceed()}
  style={[
    styles.scanButton,
    scanned && { backgroundColor: "#A278F4" }  // grey after scan
  ]}
disabled={scanned?false:true}   // disable button
>
  <Text
    style={[
      styles.scanButtonText,
      scanned && { color: "#ccc" }  // lighter text when disabled
    ]}
  >
  {scanned ? strings.manualHandover.scanCode : strings.manualHandover.scanCode}
  </Text>
</TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default ManualHandoverScanner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00000080" },
  headerRow: { paddingHorizontal: 20, paddingVertical: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#fff", marginRight: 4 },
  camera: { flex: 0.9 },
  overlayCenter: { position: "absolute", top: "25%", width: "100%", justifyContent: "center", alignItems: "center" },
  scanBox: { width: 260, height: 260, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 15 },
  corner: { position: "absolute", width: 40, height: 40, borderWidth: 4, borderColor: "#A278F4" },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
   scanButton: {
    margin: 50,
    backgroundColor: "#CFCFCF",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },

  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight:'600'
  },
});






