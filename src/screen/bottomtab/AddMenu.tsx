// src/components/AddMenuModal.js
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions, TextInput } from "react-native";
import strings from "../../localization/en";
import { colors } from "../../styles/colors";
import globalstyles from "../../styles/globalstyles";
import { useNavigation } from "@react-navigation/native";
import CustomTextField from "../components/TextFieldComponent";
import useFilterBottomSheetViewModel from "../../viewmodels/staff/CreatingChildViewModel";
import { RegisterChildScreen } from '../staff/registerchild/RegisterChild';
const { height } = Dimensions.get("window");

const AddMenuModal = ({ visible, onClose }) => {
  const options = [
    { id: 1, label: strings.addMenu.addGame, icon: "game-controller-outline" , screen: "RegisterNewGame"},
    { id: 2, label: strings.addMenu.addUser, icon: "person-add-outline" , screen: "AccountTypeScreen"},
    { id: 3, label: strings.addMenu.registerChild, icon: "people-outline", screen: "RegisterChildScreen" },
  ];
  const navigation = useNavigation();
  const handleSelect = (item) => {
    onClose();
    navigation.navigate(item.screen);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === options.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => handleSelect(item)}
            >
              <Text style={[globalstyles.regular_FontMedium,styles.menuText]}>{item.label}</Text>
              <View style={{backgroundColor:colors.lightgrey,borderRadius:25,padding:8}}>
                <Ionicons name={item.icon} size={22} color="#A1A1AA" />
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.pointer} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default AddMenuModal;



export const AddMenuModalStaff = ({ visible, onClose }) => {
  const [showChildSheet, setShowChildSheet] = useState(false);
  const slideAnim = useState(new Animated.Value(height))[0];
  const navigation = useNavigation();

  const options = [
    {
      id: 1,
      label: "Add a new game",
      icon: "game-controller-outline",
      screen: "UserInformationScreen",
    },
    {
      id: 2,
      label: "Register a new child",
      icon: "people-outline",
       screen: "UserInformationScreen",
    },
  ];

  const handleSelect = (item) => {
    // Close main menu first
    onClose();

    if (item.id === 3) {
      // Wait for main modal to close before opening bottom sheet
      setTimeout(() => {
        openBottomSheet();
      }, 300); // Delay matches animationType="fade" duration
    } else {
      // Navigate for normal item
  label: strings.addMenu.addGame,
        navigation.navigate(item.screen);
      }, 300);
    }
  };

  label: strings.addMenu.registerChild,
    setShowChildSheet(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowChildSheet(false));
  };

  return (
    <>
      {/* 🟣 Floating Menu Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.menuContainer}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === options.length - 1 && styles.menuItemLast,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[globalstyles.regular_FontMedium, styles.menuText]}
                >
                  {item.label}
                </Text>
                <View
                  style={{
                    backgroundColor: colors.lightgrey,
                    borderRadius: 25,
                    padding: 8,
                  }}
                >
                  <Ionicons name={item.icon} size={22} color="#A1A1AA" />
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.pointer} />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 🟢 Child Registration Bottom Sheet */}
      <Modal transparent visible={showChildSheet} animationType="fade">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.backgroundTouch}
      {item.label}
            onPress={closeBottomSheet}
          />
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <ChildRegisterSheet onClose={closeBottomSheet} />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  genderRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  marginTop: 8,
},
genderOption: {
  flexDirection: "row",
  alignItems: "center",
},
genderText: {
  fontSize: 15,
  color: "#52525B",
  marginRight: 8,
  fontWeight: "500",
},
checkbox: {
  width: 18,
  height: 18,
  borderWidth: 1.2,
  borderColor: "#D1D5DB",
  borderRadius: 3,
  backgroundColor: "#FFF",
},

  playHoursRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
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

   overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    position: "absolute",
    bottom: 110, // 👈 just above the plus button
    alignSelf: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginVertical: 6,
    width: 210,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemLast: {
    marginBottom: 10,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
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
    container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reset: { color: "#7A5AF8", fontWeight: "600" },
  filter: { color: "#7A5AF8", fontWeight: "600" },
  field: { marginBottom: 15 },
  label: { color: "#6B6B6B", marginBottom: 5 },
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
  genderRow1: {
    marginTop: 15,
  },
 
  genderOptions1: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  genderOption1: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderText1: {
    fontSize: 16,
    color: "#777",
  },
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
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingHorizontal: 20,
    height: height * 0.85,
  }, backgroundTouch: {
    flex: 1,
  },
});

const ChildRegisterSheet = ({ onClose }) => {
  const viewModel=useFilterBottomSheetViewModel();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
        <Text style={styles.filter}>Filter</Text>
      </View>
<CustomTextField
                value={viewModel.form.phone}
                onChangeText={(text) => viewModel.handleInputChange("phone", text)}
                label="Phone Number"
                placeholder="xxxxxxxxxx"
                prefixIcon="call-outline"
                error={viewModel.errors.phone}
              />

              <CustomTextField
                value={viewModel.form.dob}
                onChangeText={(text) => viewModel.handleInputChange("dob", text)}
                label="Date of Birth"
                placeholder="YYYY/MM/DD"
                prefixIcon="calendar-outline"
                error={viewModel.errors.dob}
              />

              <CustomTextField
                value={viewModel.form.status}
                onChangeText={(text) =>
                  viewModel.handleInputChange("status", text)
                }
                label="Status"
                placeholder="Active / Inactive"
                prefixIcon="chevron-down-outline"
                error={viewModel.errors.status}
              />

              <CustomTextField
                value={viewModel.form.sessionPrice}
                onChangeText={(text) =>
                  viewModel.handleInputChange("sessionPrice", text)
                }
                label="Session Price"
                placeholder="0,000"
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




      <View style={{ marginTop: 15 }}>
  <Text style={styles.label}>Gender</Text>

  <View style={styles.genderRow}>
    <TouchableOpacity style={styles.genderOption}>
      <Text style={styles.genderText}>Female</Text>
      <View style={styles.checkbox} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.genderOption}>
      <Text style={styles.genderText}>Male</Text>
      <View style={styles.checkbox} />
    </TouchableOpacity>
  </View>
</View>


      {/* Add more fields like status, session price, gender, etc. */}
    </View>
  );
};





