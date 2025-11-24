import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import globalstyles from "../../styles/globalstyles";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSpace} />

      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image source={require("../../../assets/images/setting_profile.png")} style={styles.profileImage} />
        
       
      </View>
      <View style={{marginHorizontal:20}}>
 <Text style={[globalstyles.regular_FontblackFontWeight,{margin:5,textAlign:'right',fontSize:18}]}>Sarah Saad Kadhem</Text>
        <Text style={[globalstyles.regular_Fontblack,{margin:5,textAlign:'right',fontSize:14}]}>sarasaad@gmail.com</Text>
        <Text style={[globalstyles.regular_Fontblack,{marginRight:5,textAlign:'right',fontSize:14}]}>077XXXXXXX</Text>
      </View>
<View style={{marginTop:20}}></View>
      {/* Options */}
      <TouchableOpacity style={styles.row}>
        <View>
        <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />

        </View>
        <View style={{flexDirection:'row'}}>
        <Text style={[globalstyles.regular_FontblackFontWeight,{textAlign:'right',fontSize:19,marginRight:20}]}>Change Password</Text>
        <Ionicons name="lock-closed-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View>
 <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
       <View style={{flexDirection:'row'}}>
        <Text style={[globalstyles.regular_FontblackFontWeight,{textAlign:'right',fontSize:19,marginRight:20}]}>Delete Account</Text>
        <Ionicons name="trash-outline" size={22} color="#A78BFA" />
       </View>

      </TouchableOpacity>

      {/* Logout */}
      {/* <TouchableOpacity style={styles.logoutRow}>
        <Text style={styles.logoutText}>Log Out</Text>
        <Ionicons name="log-out-outline" size={22} color="red" />
      </TouchableOpacity> */}

      <View style={styles.bottomSpace} />
      <TouchableOpacity style={styles.row}>
        <View>
   <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
       <View style={{flexDirection:'row'}}>
        <Text style={[globalstyles.regular_FontblackFontWeight,{textAlign:'right',color:'red',fontSize:19,marginRight:20}]}>Log Out</Text>
        <Ionicons name="log-out-outline" size={24} color="red" />
       </View>
       </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSpace: {
    height: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EAEAEA",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 12,
    color: "gray",
  },
  phone: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 15,
    marginTop:20,
  },
  optionText: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    color: "#000",
  },
  logoutRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  logoutText: {
    color: "red",
    fontSize: 16,
    marginRight: 10,
  },
  bottomSpace: {
    height: '25%',
  },
});
