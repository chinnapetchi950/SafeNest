
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import globalstyles from "../../../styles/globalstyles";
import DropDownPicker from "react-native-dropdown-picker";
import { useRegisterGameViewModel } from "../../../viewmodels/registerNewgameViewmodal";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

export default function RegisterNewGame({navigation}) {
  const viewModel = useRegisterGameViewModel();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <Text style={[globalstyles.semibold_black, styles.sectionTitle]}>
          Register a new game
        </Text>

        <Text style={styles.sectionSubtitle}>
          Please fill in the game details to add it to the system
        </Text>

        {/* GAME NAME */}
        <Text style={styles.label}>Game name</Text>
        <View style={styles.textBox}>
          <TextInput
            placeholder="Cricket"
            value={viewModel.gameName}
            onChangeText={viewModel.setGameName}
            style={styles.textInput}
          />
        </View>

        {/* SESSION LIST */}
        {viewModel.sessions.map((item, index) => (
          <View key={index} style={styles.sessionContainer}>

            {/* LEFT BUTTONS */}
            <View style={styles.sideButtons}>
              {index === 0 ? (
                <TouchableOpacity
                  onPress={viewModel.addSession}
                  disabled={viewModel.sessions.length >= 3}
                  style={styles.circleBtn}
                >
                  <Ionicons name="add" size={20} color="#A259FF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => viewModel.deleteSession(index)}
                  style={styles.circleBtn}
                >
                  <Ionicons name="trash" size={20} color="#ff4d4d" />
                </TouchableOpacity>
              )}
            </View>

            {/* DURATION + PRICE */}
            <View style={styles.sessionRight}>
              <Text style={styles.sublabel}>Session duration</Text>
              <Text style={styles.sublabelRight}>Session price</Text>

              <View style={styles.row}>

                {/* DURATION DROPDOWN */}
                <View style={{ flex: 1 }}>
                 <DropDownPicker
  open={item.open}   // ✅ FIXED
  value={item.duration}
  items={viewModel.minutes}
  setOpen={(val) => viewModel.handleOpenChange(index, val)}
  onSelectItem={(val) => viewModel.handleDurationChange(index, val.value)}
  placeholder="Duration"
  listMode="SCROLLVIEW"
  ArrowDownIconComponent={() => (
    <Ionicons name="chevron-down" size={22} color="#999" />
  )}
  ArrowUpIconComponent={() => (
    <Ionicons name="chevron-up" size={22} color="#999" />
  )}
  style={{
    borderColor: "#D0D0D0",
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
  }}
  dropDownContainerStyle={{
    borderColor: "#D0D0D0",
    borderRadius: 10,
  }}
  placeholderStyle={{
    color: "#999",
    fontSize: 16,
    textAlign: "right",
  }}
  labelStyle={{
    color: "#000",
    fontSize: 16,
    textAlign: "right",
  }}
  arrowIconContainerStyle={{
    position: "absolute",
    left: 15,
  }}
/>

                </View>

                {/* PRICE */}
                <View style={styles.priceBox}>
                  <Text style={styles.currency}>IQD</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={item.price}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      viewModel.handlePriceChange(index, text)
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* MESSAGE SELECT */}
        <Text style={styles.addMsgTitle}>Add message</Text>

        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.msgInputBox}>
            <Ionicons
              name={modalVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color="#999"
            />
            <Text style={{ color:viewModel.messageLabel?"#000": "#888" }}>
              {viewModel.messageLabel || "Select message"}
            </Text>
          </View>
        </TouchableOpacity>

        {modalVisible && (
          <View style={styles.messageBox}>
            {viewModel.messageList.map((msg) => (
  <View key={msg.id} style={styles.msgRow}>
    <Text style={styles.msgLabel}>{msg.name}</Text> {/* use name */}
    <TouchableOpacity
      onPress={() => {
        viewModel.handleMessageSelect(msg);
        setModalVisible(false); // close modal on select
      }}
      style={[
        styles.checkbox,
        viewModel.selectedMessageId === msg.id && styles.checkboxChecked,
      ]}
    >
      {viewModel.selectedMessageId === msg.id && (
        <Ionicons name="checkmark" size={15} color="#fff" />
      )}
    </TouchableOpacity>
  </View>
))}

          </View>
        )}
      </ScrollView>

      {/* SUBMIT BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          disabled={viewModel.isButtonDisabled}
          onPress={viewModel.registerGame}
          style={[
            styles.button,
            viewModel.isButtonDisabled && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Register a new game</Text>
        </TouchableOpacity>
      </View>
      <SuccessModal
  visible={viewModel?.successModal}
  onDone={() => {viewModel?.setSuccessModal(false),navigation.navigate("BottomTabsStaff");}}
/>
    </SafeAreaView>
  );
}

// STYLES BELOW...


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  sectionTitle: { fontSize: 18, marginTop: 10, textAlign: "right" },
  sectionSubtitle: { fontSize: 14, color: "#808080", textAlign: "right", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", textAlign: "right", color: "#000" },
  textBox: {
    marginTop: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    paddingHorizontal: 14, height: 50, justifyContent: "center", marginBottom: 20
  },
  textInput: { fontSize: 16, color: "#000", textAlign: "right" },
  sessionContainer: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  sideButtons: { width: 40, marginTop: 25 },
  circleBtn: {
    width: 32, height: 32, borderRadius: 17,
    borderWidth:0.6,
    borderColor:'#bbb',
    justifyContent: "center", alignItems: "center", marginTop: 8
  },
  sessionRight: { flex: 1 },
  sublabel: { fontSize: 14, color: "#000", fontWeight: "600" },
  sublabelRight: { fontSize: 13, color: "#808080", position: "absolute", right: 0, top: 0 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  priceBox: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12,
    paddingHorizontal: 12, height: 48, marginLeft: 10
  },
  currency: { color: "#A259FF", fontWeight: "700", marginRight: 8 },
  priceInput: { width: 70, fontSize: 16, color: "#000" },
  addMsgTitle: { fontSize: 14, marginTop: 10, fontWeight: "600", textAlign: "right" },
  msgInputBox: {
    marginTop: 5, borderWidth: 1, borderColor: "#ddd", borderRadius: 15,
    paddingHorizontal: 14, height: 48, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between"
  },
  messageBox: {
    marginTop: 14, padding: 14, borderWidth: 1,
    borderColor: "#EAEAEA", borderRadius: 12, backgroundColor: "#FAFAFA"
  },
  msgRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginVertical: 8,
  },
  msgLabel: { fontSize: 15, color: "#444", textAlign: "right" },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: "#bbb", justifyContent: "center", alignItems: "center"
  },
  checkboxChecked: { backgroundColor: "#A259FF", borderColor: "#A259FF" },
  bottomContainer: {
    position: "absolute", bottom: 40, width: "100%",
    alignItems: "center"
  },
  button: {
    width: "85%", backgroundColor: "#A278F4", borderRadius: 25,
    paddingVertical: 14, alignItems: "center"
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
   buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
