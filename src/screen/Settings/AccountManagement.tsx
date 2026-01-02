import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "https://testlink3.pillersofttechnologies.com/storage/";

export default function AccountManagementScreen({ user }) {
  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    secondname: user?.secondname || "",
    thirdname: user?.thirdname || "",
    fourthname: user?.fourthname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    national_id_number: user?.national_id_number || "",
    residency_card_number: user?.residency_card_number || ""
  });

  const [nationalIdImage, setNationalIdImage] = useState<any>(null);
  const [residencyImage, setResidencyImage] = useState<any>(null);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = (type: "national" | "residency") => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera", onPress: () => openCamera(type) },
      { text: "Gallery", onPress: () => openGallery(type) },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const openCamera = async (type: string) => {
    const res = await launchCamera({
      mediaType: "photo",
      quality: 0.8
    });

    if (res.didCancel || !res.assets?.length) return;

    type === "national"
      ? setNationalIdImage(res.assets[0])
      : setResidencyImage(res.assets[0]);
  };

  const openGallery = async (type: string) => {
    const res = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8
    });

    if (res.didCancel || !res.assets?.length) return;

    type === "national"
      ? setNationalIdImage(res.assets[0])
      : setResidencyImage(res.assets[0]);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (nationalIdImage) {
      formData.append("national_id_image", {
        uri: nationalIdImage.uri,
        name: nationalIdImage.fileName || "national_id.jpg",
        type: nationalIdImage.type || "image/jpeg"
      } as any);
    }

    if (residencyImage) {
      formData.append("residency_card_image", {
        uri: residencyImage.uri,
        name: residencyImage.fileName || "residency_card.jpg",
        type: residencyImage.type || "image/jpeg"
      } as any);
    }

    console.log("FORM DATA ===>", formData);

    Alert.alert("Success", "Account updated successfully");
    // 🔗 CALL UPDATE PROFILE API HERE
  };

  const renderPreview = (localImage: any, serverUrl?: string) => {
    if (localImage?.uri) {
      return <Image source={{ uri: localImage.uri }} style={styles.preview} />;
    }
    if (serverUrl) {
      return <Image source={{ uri: BASE_URL + serverUrl }} style={styles.preview} />;
    }
    return null;
  };

  return (
    <SafeAreaView style={{flex:1}}>
  <ScrollView style={styles.container}>
      <Text style={styles.header}>Account Management</Text>

      {/* AVATAR */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar} />
      </View>

      {/* PERSONAL INFO */}
      <Section title="Personal Information" />
      <Row>
        <Input label="Second Name" value={form.secondname} onChangeText={v => handleChange("secondname", v)} />
        <Input label="First Name" value={form.firstname} onChangeText={v => handleChange("firstname", v)} />
      </Row>

      <Row>
        <Input label="Fourth Name" value={form.fourthname} onChangeText={v => handleChange("fourthname", v)} />
        <Input label="Third Name" value={form.thirdname} onChangeText={v => handleChange("thirdname", v)} />
      </Row>

      <Input label="Last Name" value={form.lastname} onChangeText={v => handleChange("lastname", v)} />

      {/* LOGIN INFO */}
      <Section title="Login Information" />
      <Input label="Phone Number" value={form.phone} icon="call-outline" />
      <Input label="Email" value={form.email} icon="mail-outline" />

      {/* IDENTITY */}
      <Section title="Identity Information" />
      <Input label="National ID Number" value={form.national_id_number} />
      <Upload label="Upload National ID" onPress={() => pickImage("national")} />
      {renderPreview(nationalIdImage, user?.national_id_urls?.[0])}

      <Input label="Residency Card Number" value={form.residency_card_number} />
      <Upload label="Upload Residency Card" onPress={() => pickImage("residency")} />
      {renderPreview(residencyImage, user?.residency_card_urls?.[0])}

      {/* SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  
  );
}

/* ---------- UI HELPERS ---------- */

const Section = ({ title }: any) => <Text style={styles.section}>{title}</Text>;
const Row = ({ children }: any) => <View style={styles.row}>{children}</View>;

const Input = ({ label, icon, ...props }: any) => (
  <View style={styles.inputWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputBox}>
      {icon && <Ionicons name={icon} size={18} color="#999" />}
      <TextInput style={styles.input} {...props} />
    </View>
  </View>
);

const Upload = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
    <Ionicons name="cloud-upload-outline" size={24} color="#8B5CF6" />
    <Text style={styles.uploadText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 20, fontWeight: "700", textAlign: "center" },

  avatarWrap: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 120,
    height: 60,
    marginTop:50,
    backgroundColor: "#ccc",
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120
  },

  section: { fontSize: 16, fontWeight: "600", color: "#808080", marginVertical: 10,textAlign:'right' },
  row: { flexDirection: "row", justifyContent: "space-between" },

  inputWrap: { flex: 1, marginBottom: 14, marginHorizontal: 4 },
  label: { fontSize: 14, color: "#0D0D0D",fontWeight:'700', marginBottom: 4,textAlign:'right' },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10
  },
  input: { flex: 1, height: 42, marginLeft: 6 },

  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#8B5CF6",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginVertical: 8
  },
  uploadText: { marginTop: 6, color: "#8B5CF6", fontWeight: "600" },

  preview: {
    width: 120,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10
  },

  saveBtn: {
    backgroundColor: "#CFCFCF",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 20
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 }
});
