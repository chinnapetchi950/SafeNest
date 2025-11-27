import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // ✅ FIXED IMPORT
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTextField from "../components/TextFieldComponent";
import DropDownPicker from "react-native-dropdown-picker";
import globalstyles from "../../styles/globalstyles";

const FilterBottomSheet = ({
  visible,
  onClose,
  onApply,
  viewModel,

  minutes,
  hours,
  openHour,
  openMinute,
  selectedHour,
  selectedMinute,
  setOpenHour,
  setOpenMinute,
  setSelectedHour,
  setSelectedMinute,

  showDatePicker,
  setShowDatePicker,
  handleDateChange,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        {/* Tap Outside to Close */}
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={viewModel.resetFilter}>
              <Text style={styles.reset}>Reset</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Filter</Text>
          </View>

          <View style={styles.divider} />

          {/* Scroll Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Phone */}
            <CustomTextField
              value={viewModel.filters.phone}
              onChangeText={(text) => viewModel.handleInputChange("phone", text)}
              label="Phone Number"
              placeholder="xxxxxxxxxx"
              prefixIcon="call-outline"
              keyboardType="number-pad"
              error={viewModel.errors.phone}
            />

            {/* DOB Picker */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <CustomTextField
                value={viewModel.filters.date_of_birth}
                label="Date of Birth"
                placeholder="YYYY/MM/DD"
                prefixIcon="calendar-outline"
                editable={false}
                error={viewModel.errors.date_of_birth}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  viewModel.filters.date_of_birth
                    ? new Date(viewModel.filters.date_of_birth)
                    : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}

            {/* Price */}
            <CustomTextField
              value={viewModel.filters.price}
              onChangeText={(text) => viewModel.handleInputChange("price", text)}
              label="Session Price"
              placeholder="Enter price"
              error={viewModel.errors.price}
            />

            {/* Play Hours */}
            <Text style={styles.smallLabel}>Play Hours</Text>

            <View style={styles.timerRow}>
              {/* Minutes Dropdown */}
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  open={openMinute}
                  value={selectedMinute}
                  items={minutes}
                  setOpen={setOpenMinute}
                  setValue={(cb) => {
                    const val = cb(selectedMinute);
                    setSelectedMinute(val);
                    viewModel.handleInputChange("play_minutes", val);
                  }}
                  placeholder="Minutes"
                  listMode="SCROLLVIEW"
                   ArrowDownIconComponent={() => (
                    <Ionicons name="chevron-expand" size={22} color="#999" />
                  )}
                  ArrowUpIconComponent={() => (
                    <Ionicons name="chevron-expand" size={22} color="#999" />
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
                  placeholderStyle={[
                    globalstyles.regular_FontMediumblack,
                    {
                      color: "#999",
                      fontSize: 16,
                      textAlign: "right",
                    },
                  ]}
                  labelStyle={[
                    globalstyles.regular_FontMediumblack,
                    {
                      color: "#000",
                      fontSize: 18,
                      textAlign: "right",
                    },
                  ]}
                  arrowIconContainerStyle={{
                    position: "absolute",
                    left: 15,
                  }}
                />
              </View>

              {/* Hours Dropdown */}
              <View style={{ flex: 1 }}>
                <DropDownPicker
                  open={openHour}
                  value={selectedHour}
                  items={hours}
                  setOpen={setOpenHour}
                  setValue={(cb) => {
                    const val = cb(selectedHour);
                    setSelectedHour(val);
                    viewModel.handleInputChange("play_hours", val);
                  }}
                  placeholder="Hours"
                  listMode="SCROLLVIEW"
                  ArrowDownIconComponent={() => (
                    <Ionicons name="chevron-expand" size={20} color="#999" />
                  )}
                  ArrowUpIconComponent={() => (
                    <Ionicons name="chevron-expand" size={20} color="#999" />
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
                  placeholderStyle={[
                    globalstyles.regular_FontMediumblack,
                    {
                      color: "#999",
                      fontSize: 16,
                      textAlign: "right",
                    },
                  ]}
                  labelStyle={[
                    globalstyles.regular_FontMediumblack,
                    {
                      color: "#000",
                      fontSize: 18,
                      textAlign: "right",
                    },
                  ]}
                  arrowIconContainerStyle={{
                    position: "absolute",
                    left: 15,
                  }}
                />
              </View>
            </View>

            {/* Gender */}
            <Text style={styles.smallLabel}>Gender</Text>

            <View style={styles.genderRow}>
              {/* Female */}
              <TouchableOpacity
                style={styles.genderOption}
                onPress={() => viewModel.handleSelectGender("female")}
              >
                <Text style={styles.optionText}>Female</Text>
                <View
                  style={[
                    styles.checkbox,
                    viewModel.selectedGender === "female" &&
                      styles.checkboxSelected,
                  ]}
                >
                  {viewModel.selectedGender === "female" && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Male */}
              <TouchableOpacity
                style={[styles.genderOption, { marginLeft: 30 }]}
                onPress={() => viewModel.handleSelectGender("male")}
              >
                <Text style={styles.optionText}>Male</Text>
                <View
                  style={[
                    styles.checkbox,
                    viewModel.selectedGender === "male" &&
                      styles.checkboxSelected,
                  ]}
                >
                  {viewModel.selectedGender === "male" && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
              <Text style={styles.applyText}>Apply Filter</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterBottomSheet;


/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },
  reset: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    marginBottom: 20,
  },
  timerRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  smallLabel: {
    alignSelf: "flex-end",
    fontWeight: "700",
    marginRight: 6,
    marginTop: 15,
  },
  genderRow: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    marginRight: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  applyBtn: {
    backgroundColor: "#8B5CF6",
    padding: 14,
    borderRadius: 12,
    marginTop: 35,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
});
