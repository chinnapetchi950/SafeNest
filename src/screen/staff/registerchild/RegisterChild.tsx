import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import CustomTextField, { CommonButton } from "../../components/TextFieldComponent";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useNavigation } from "@react-navigation/native";
import useFilterBottomSheetViewModel from "../../../viewmodels/staff/CreatingChildViewModel";
import DateTimePicker from "@react-native-community/datetimepicker";
import globalstyles from "../../../styles/globalstyles";


export const RegisterChildScreen = () => {
    const navigation=useNavigation()
    const viewModel=useFilterBottomSheetViewModel()
  const handleNext = () => {
    navigation.navigate("SessionDetailsScreen");
  };
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    const date = new Date(selectedDate);
    const formatted = `${date.getFullYear()}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
    viewModel.handleInputChange("dob", formatted);
  }
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Register New Child</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>

      {/* Step Progress */}
      <View style={styles.stepContainer}>
        <View style={styles.stepBarActive} />
        <View style={styles.stepBarInactive} />
      </View>

      <Text style={styles.sectionTitle}>Child Details</Text>

     <CustomTextField
                value={viewModel.form.phone}
                onChangeText={(text) => viewModel.handleInputChange("phone", text)}
                label="Phone Number"
                placeholder="xxxxxxxxxx"
                prefixIcon="call-outline"
                error={viewModel.errors.phone}
              />


              <CustomTextField
                value={viewModel.form.status}
                onChangeText={(text) =>
                  viewModel.handleInputChange("status", text)
                }
                label="Guardian Name"
                placeholder="Guardian Name"
                prefixIcon="account"
                error={viewModel.errors.status}
              />

              <CustomTextField
                value={viewModel.form.sessionPrice}
                onChangeText={(text) =>
                  viewModel.handleInputChange("Child_name", text)
                }
                label="Child Name"
                placeholder="Child Name"
                prefixIcon="cash-outline"
                error={viewModel.errors.sessionPrice}
              />

              <CustomTextField
                value={viewModel.form.playHours}
                onChangeText={(text) =>
                  viewModel.handleInputChange("playHours", text)
                }
                label="Play Hours"
                placeholder="Hour / Minute"
                prefixIcon="time-outline"
                error={viewModel.errors.playHours}
              />

<TouchableOpacity activeOpacity={0.9} onPress={() => setShowDatePicker(true)}>
  <CustomTextField
    value={viewModel.form.dob}
    label="Date of Birth"
    placeholder="YYYY/MM/DD"
    prefixIcon="calendar-outline"
    error={viewModel.errors.dob}
    editable={false} // disable manual typing
  />
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={viewModel.form.dob ? new Date(viewModel.form.dob) : new Date()}
    mode="date"
    display={Platform.OS === "ios" ? "spinner" : "default"}
    onChange={handleDateChange}
  />
)}


      
<View style={{ marginTop: 15 }}>
  <Text style={styles.label}>Play Hours</Text>
  <View style={styles.playHoursRow}>
    <View style={styles.playBox}>
      <Ionicons name="caret-up-outline" size={12} color="#A1A1AA" style={styles.arrowUp} />
      <Ionicons name="caret-down-outline" size={12} color="#A1A1AA" style={styles.arrowDown} />
      <Text style={styles.playText}>Minute</Text>
    </View>

    <View style={styles.playBox}>
      <Ionicons name="caret-up-outline" size={12} color="#A1A1AA" style={styles.arrowUp} />
      <Ionicons name="caret-down-outline" size={12} color="#A1A1AA" style={styles.arrowDown} />
      <Text style={styles.playText}>Hour</Text>
    </View>
  </View>
</View>
<Text style={[globalstyles.semibold_black,{alignSelf:"flex-end",fontWeight:"700"}]}>
  Gender

</Text>
 <View style={styles.genderRow}>
        {/* Female */}
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() =>viewModel?. handleSelectGender("Female")}
        >
          <Text style={styles.optionText}>Female</Text>
          <View
            style={[
              styles.checkbox,
              viewModel?.selectedGender === "Female" && styles.checkboxSelected,
            ]}
          >
            {viewModel?.selectedGender === "Female" && (
              <Ionicons name="checkmark" size={14} color="#fff" />
            )}
          </View>
        </TouchableOpacity>

        {/* Male */}
        <TouchableOpacity
          style={styles.genderOption}
          onPress={() => viewModel?.handleSelectGender("Male")}
        >
          <Text style={styles.optionText}>Male</Text>
          <View
            style={[
              styles.checkbox,
              viewModel?.selectedGender === "Male" && styles.checkboxSelected,
            ]}
          >
            {viewModel?.selectedGender === "Male" && (
              <Ionicons name="checkmark" size={14} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </View>

     <CommonButton
               title={ "Next" }
               onPress={()=>{navigation.navigate("SessionDetailsScreen")}}
               style={{}} textStyle={undefined}        />
    </View>
  );
};

const styles = StyleSheet.create({
    arrowUp: {
  position: "absolute",
  top: 5,
  right: 10,
},
arrowDown: {
  position: "absolute",
  bottom: 5,
  right: 10,
},
  options: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 15,
    color: "#555",
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  playHoursRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
  alignSelf:"flex-end"
},

playBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#E4E4E7",
  borderRadius: 8,
  backgroundColor: "#FAFAFA",
  paddingVertical: 10,
  alignItems: "center",
  marginRight: 8,
  position: "relative",
},
playText: {
  fontSize: 14,
  color: "#6B7280",
  fontWeight: "500",
},
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  stepBarActive: {
    flex: 1,
    height: 4,
    backgroundColor: "#A37BFF",
    borderRadius: 10,
  },
  stepBarInactive: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginLeft: 5,
  },
  sectionTitle: {
    color: "#A37BFF",
    fontWeight: "600",
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    color: "#333",
    fontWeight: "500",
  },
  genderRow: {
    flexDirection: "row",
    alignSelf:"flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  genderOption: {
   
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  genderOptionActive: {
    backgroundColor: "#A37BFF",
  },
  genderText: {
    color: "#999",
    fontWeight: "500",
  },
  genderTextActive: {
    color: "#fff",
  },
  uploadBox: {
    marginVertical: 15,
  },
  addImageBtn: {
    borderWidth: 1,
    borderColor: "#A37BFF",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  addImageText: {
    color: "#A37BFF",
    fontWeight: "500",
  },
  nextBtn: {
    backgroundColor: "#A37BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextBtnDisabled: {
    backgroundColor: "#E0D4FF",
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },






    pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    marginTop: -1,
  },
    
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reset: { color: "#7A5AF8", fontWeight: "600" },
  filter: { color: "#7A5AF8", fontWeight: "600" },
  field: { marginBottom: 15 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  input: { flex: 1, marginLeft: 8 },

  //  filter: {
  //   color: "#000",
  //   fontWeight: "600",
  // },

  selected: {
    color: "#4CAF50",
    fontWeight: "700",
  },
  // overlay: {
  //   flex: 1,
  //   justifyContent: "flex-start",
  //   alignItems: "flex-end",
  //   backgroundColor: "rgba(0,0,0,0.2)",
  //   paddingTop: 60,
  //   paddingRight: 20,
  // },
  // menuContainer: {
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   width: 220,
  //   elevation: 5,
  //   paddingVertical: 5,
  // },
  // menuItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingVertical: 12,
  //   paddingHorizontal: 15,
  // },
  // menuItemLast: {
  //   borderTopWidth: 0.5,
  //   borderTopColor: "#E5E5E5",
  // },
  // menuText: { color: "#000" },
  // pointer: {
  //   position: "absolute",
  //   top: -8,
  //   right: 15,
  //   width: 15,
  //   height: 15,
  //   backgroundColor: "#fff",
  //   transform: [{ rotate: "45deg" }],
  // },

});
