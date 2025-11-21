import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from "react-native";
import CustomTextField, { CommonButton } from "../../components/TextFieldComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
import useFilterBottomSheetViewModel from "../../../viewmodels/staff/CreatingChildViewModel";
import { SafeAreaView } from 'react-native-safe-area-context';
import { height } from '../../../styles/globalstyles';
import DropDownPicker from 'react-native-dropdown-picker';
const SessionDetailsScreen = ({ navigation }) => {
 
      const viewModel=useFilterBottomSheetViewModel()
      const options = ["45 min", "30 min", "15 min"]
      const [selected, setSelected] = useState("30 min");

  const [picker, setPicker] = useState({
    show: false,
    mode: "date",
    field: "",
  });
const [open, setOpen] = useState(false);
const [gameType, setGameType] = useState(null);

const [items, setItems] = useState([
  { label: "Football", value: "Football" },
  { label: "Cricket", value: "Cricket" },
  { label: "Badminton", value: "Badminton" },
  { label: "Chess", value: "Chess" },
]);
 
const handleSelect = (item) => {
    setSelected(item);
   // if (onSelect) onSelect(item);
  };
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
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Session Details</Text>
        <Ionicons name="chevron-forward" size={22} color="#000" />
      </View>

      {/* Progress Bar */}
       <View style={styles.progressWrapper}>
              {/* Left Circle */}
              <View style={styles.activeCircle} />
      
              {/* Line */}
              <View style={styles.line} />
      
              {/* Right Active Circle */}
              <View style={styles.leftCircle} />

            </View>
      
            {/* Texts Under Progress Bar */}
            <View style={styles.labelRow}>
              <Text style={styles.inactiveLabel}></Text>
              <Text style={styles.activeLabel}>Child Details</Text>
            </View>
      

      <Text style={styles.sectionTitle}>Session Details</Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Game Type */}
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 10, textAlign: "right" }}>
  Game Type
</Text>

<DropDownPicker
  open={open}
  value={gameType}
  items={items}
  setOpen={setOpen}
  setValue={(callback) => {
    const val = callback(gameType);
    setGameType(val);
    viewModel?.handleInputChangeForm("gameType", val);
  }}
  setItems={setItems}
  placeholder="Select Game Type"
  style={{
    borderColor: "#D0D0D0",
    borderRadius: 10,
    height: 55,
  }}
  dropDownContainerStyle={{
    borderColor: "#D0D0D0",
    borderRadius: 10,
  }}
 placeholderStyle={{
    color: "#999",
    fontSize: 14,
    textAlign: "right",
  }}

  /** 🔥 Label text style */
  labelStyle={{
    color: "#333",
    fontSize: 14,
    textAlign: "right",
  }}

  /** 🔥 Move arrow to right side */
  arrowIconContainerStyle={{
    position: "absolute",
    left: 15,
    //textAlign: "left",
  }}

  /** 🔥 Rotate arrow if needed */
  arrowIconStyle={{
    //transform: [{ rotate: "180deg" }],
  }}
/>

        {/* Time Row */}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => openPicker("time", "playFrom")}
            style={styles.halfField1}
          >
            <CustomTextField
              label="Play Time To"
              placeholder="HH/MM"
              value={viewModel?.childform?.playFrom}
              //prefixIcon="time-outline"
              editable={false}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openPicker("time", "playTo")}
            //style={styles.halfField2}
          >
            <CustomTextField
              label="Play Time From"
              placeholder="HH/MM"
              value={viewModel?.childform?.playTo}
              //prefixIcon="time-outline"
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity  style={styles.halfField} onPress={() => openPicker("date", "sessionDate")}>
          <CustomTextField
            label="Session Date"
            placeholder="YYYY/MM/DD"
            prefixIcon="calendar-outline"
            value={viewModel?.childform?.sessionDate}
            editable={false}
          />
        </TouchableOpacity>
        </View>

        {/* Session Date */}
        

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
        <Text style={[styles.labelplay,{flex:1,flexDirection:'row',justifyContent:'flex-end',textAlign: "right"}]}>Play Duration</Text>
        {/* <View style={styles.durationContainer}>
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
        </View> */}
        <View style={styles.containerslot}>
      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.item,
            selected === item && styles.activeItem
          ]}
          onPress={() => handleSelect(item)}
        >
          <Text style={[styles.text, selected === item && styles.activeText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

        {/* Add Button */}
         <View style={{ flex: 1, padding: 20 }}>

  {/* your screen content here */}

   

</View>
      </ScrollView>
      <View style={styles.bottomButtonWrapper}>
        <CommonButton
          title="Add"
          onPress={() => {}}
          style={{ width: "100%" ,height:50}}
        />
      </View>
    </View>
        </SafeAreaView>

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
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginRight:10
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
    fontSize: 18,
    color: "#A78BFA",
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 12,
    textAlign:'center'
  },
  row: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:10
  },
  halfField: {
    flex: 0.88,
       // marginHorizontal:10,

  },
  halfField1: {
    //flex: 0.01,
    //width:110,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 16,
    marginBottom: 6,
  },
  labelplay: {
    fontSize: 14,
    color: "#555",
    marginTop: 16,
    marginBottom: 8,
    flexDirection:'row',justifyContent:'flex-end'
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
   progressWrapper: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 15,
    marginHorizontal:50,
    marginVertical:10
  },

  leftCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    backgroundColor: "#fff",
  },

  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },

  activeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#A278F4",
  },

  /* labels below bar */
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },

  inactiveLabel: {
    fontSize: 11,
    color: "#C4C4C4",
  },

  activeLabel: {
    fontSize: 13,
    color: "#C4C4C4",
    fontWeight: "600",
  },
  containerslot: {
    backgroundColor: "#EDEDF0",
    padding: 5,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  activeItem: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: "#B0B0B0",   
    fontWeight: "600",
  },
  activeText: {
    color: "#000",
  },
  bottomButtonWrapper: {
  //padding: 20,
  backgroundColor: "#fff",
  borderTopWidth: 1,
  //height:45,
  borderColor: "#eee",
},
});


export default SessionDetailsScreen;
