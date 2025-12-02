import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { StatusBar } from "react-native";

const CustomHeader = ({
  title,
  showLanguage = true,
  onLanguagePress = () => {},
  leftComponent = null,
  rightComponent = null,
}) => {
  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
      {/* Status Bar Row */}
      {/* <View style={styles.statusRow}>
        <Text style={styles.time}>9:41</Text>

        <View style={styles.statusIcons}>
          <Ionicons name="cellular" size={18} color="#000" />
          <Ionicons name="wifi" size={18} color="#000" style={{ marginLeft: 6 }} />
          <Ionicons
            name="battery-full"
            size={22}
            color="#000"
            style={{ marginLeft: 6 }}
          />
        </View>
      </View> */}

      {/* Header Row */}
      <View style={styles.headerRow}>
        {/* Left Custom Component */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftComponent}
          <Text style={styles.title}>{title}</Text>
        </View>

      </View>
      
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    elevation:5
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  time: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: "#000",
  },

  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:15
  },

  title: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: "#000",
    marginLeft:20
  },

  langBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    width: 22,
    height: 22,
    borderRadius: 50,
    marginRight: 5,
  },

  langText: {
    fontSize: RFValue(14),
    marginRight: 4,
    color: "#000",
  },
});


{/* <CustomHeader
  title="Profile"
  leftComponent={
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={26} color="#000" />
    </TouchableOpacity>
  }
/>
🧩 4. Add Custom Right Button (Optional)
js
Copy code
<CustomHeader
  title="Messages"
  rightComponent={
    <TouchableOpacity onPress={openFilter}>
      <Ionicons name="filter" size={22} color="#000" />
    </TouchableOpacity>
  }
/> */}