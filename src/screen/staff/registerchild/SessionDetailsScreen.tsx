import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from "react-native";
import CustomTextField, { CommonButton } from "../../components/TextFieldComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
import useFilterBottomSheetViewModel from "../../../viewmodels/staff/CreatingChildViewModel";

const SessionDetailsScreen = ({ navigation }) => {
 
      const viewModel=useFilterBottomSheetViewModel()

  const [picker, setPicker] = useState({
    show: false,
    mode: "date",
    field: "",
  });

 

  const openPicker = (mode, field) => {
    setPicker({ show: true, mode, field });
  };

  const handlePickerChange = (event, selectedValue) => {
    if (event.type === "dismissed") {
      setPicker({ ...picker, show: false });
      return;
    }

    setPicker({ ...picker, show: false });

    if (picker.mode === "date") {
      const date = new Date(selectedValue);
      const formatted = `${date.getFullYear()}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
      viewModel?.handleInputChangeForm("sessionDate", formatted);
    } else if (picker.mode === "time") {
      const time = new Date(selectedValue);
      const formatted = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      viewModel?.handleInputChangeForm(picker.field, formatted);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Session Details</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
      </View>

      <Text style={styles.sectionTitle}>Session Details</Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Type */}
        <CustomTextField
          label="Game Type"
          placeholder="Select Game Type"
          prefixIcon="chevron-down-outline"
          value={viewModel?.childform?.gameType}
          onChangeText={(text) => viewModel?.handleInputChangeForm("gameType", text)}
        />

        {/* Time Row */}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => openPicker("time", "playFrom")}
            style={styles.halfField}
          >
            <CustomTextField
              label="Play Time From"
              placeholder="HH/MM"
              value={viewModel?.childform?.playFrom}
              prefixIcon="time-outline"
              editable={false}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openPicker("time", "playTo")}
            style={styles.halfField}
          >
            <CustomTextField
              label="Play Time To"
              placeholder="HH/MM"
              value={viewModel?.childform?.playTo}
              prefixIcon="time-outline"
              editable={false}
            />
          </TouchableOpacity>
        </View>

        {/* Session Date */}
        <TouchableOpacity onPress={() => openPicker("date", "sessionDate")}>
          <CustomTextField
            label="Session Date"
            placeholder="YYYY/MM/DD"
            prefixIcon="calendar-outline"
            value={viewModel?.childform?.sessionDate}
            editable={false}
          />
        </TouchableOpacity>

        {picker.show && (
          <DateTimePicker
            value={new Date()}
            mode={picker.mode}
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handlePickerChange}
          />
        )}

        {/* Duration Buttons */}
        <Text style={styles.label}>Play Duration</Text>
        <View style={styles.durationContainer}>
          {["45 min", "30 min", "15 min"].map((dur) => (
            <TouchableOpacity
              key={dur}
              style={[
                styles.durationBox,
                viewModel?.childform?.duration === dur && styles.durationBoxActive,
              ]}
              onPress={() => viewModel?.handleInputChangeForm("duration", dur)}
            >
              <Text
                style={[
                  styles.durationText,
                  viewModel?.childform?.duration === dur && styles.durationTextActive,
                ]}
              >
                {dur}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
<View style={{marginTop:30}}>

    <CommonButton
                       title={ "Add" }
                       onPress={()=>{}}
                       style={{ flex: 1, }} textStyle={undefined}        />
</View>
        {/* Add Button */}
         
      </ScrollView>
    </View>
  );
};




export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  progressActive: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#A78BFA",
  },
  progressInactive: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#E4E4E7",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 15,
    color: "#A78BFA",
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfField: {
    flex: 0.48,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 16,
    marginBottom: 6,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationBox: {
    flex: 1,
    backgroundColor: "#E4E4E7",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  durationBoxActive: {
    backgroundColor: "#A78BFA",
  },
  durationText: {
    color: "#555",
    fontWeight: "500",
  },
  durationTextActive: {
    color: "#fff",
  },
  addBtn: {
    backgroundColor: "#A78BFA",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  addBtnDisabled: {
    backgroundColor: "#E4E4E7",
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});


export default SessionDetailsScreen;
