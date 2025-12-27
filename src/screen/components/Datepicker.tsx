import React, { useState } from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { height } from "../../styles/globalstyles";

const DatePickerInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShow(true)}
      >
        <Text style={{  fontSize: 13,
    color: "#6B7280",}}>
          {value instanceof Date
            ? value.toISOString().split("T")[0]
            : "YYYY / MM / DD"}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </>
  );
};

const styles = {
  dateInput: {
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//    borderRadius: 999,
//     padding: 15,
//      width: 180,
//     alignItems: "center",
  width: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingVertical: 8,
    height:50,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop:8,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
};

export default DatePickerInput;
