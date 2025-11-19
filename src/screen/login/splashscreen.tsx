import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { images } from "../../utils/images";
import { string } from "../../utils/String";
import Ionicons from "@react-native-vector-icons/ionicons";
import globalstyles from "../../styles/globalstyles";
import { SafeAreaView } from "react-native-safe-area-context";


const { width } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <SafeAreaView style={{flex:1}}>
    <LinearGradient colors={["#A774F0", "#8064E9"]} style={styles.container}>
   
          <Image
            source={images.splash_screen} // replace with your actual image
            style={styles.centerImage}
            resizeMode="center"
          />

      <Text style={[globalstyles.regular_FontMedium,styles.title]}>{string.splash_center1}</Text>
      <Text style={[,globalstyles.  regular_Fontblack
,styles.subtitle]}>
    {string.splash_cente}
      </Text>
      {/* Button */}
      <View style={styles.bottomContainer}>
  <TouchableOpacity style={styles.button}>
    <View style={styles.iconCircle}>
        <View style={{flexDirection:"row"}}>
   <Ionicons name="chevron-back-outline" size={18} color="#fff" />

        </View>
  
    </View>
    <Text style={[globalstyles.semibold_black,styles.buttonText]}>Start Now</Text>
  </TouchableOpacity>
</View>

    </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

 bottomContainer: {
  position: "absolute",
  bottom: 40,
  width: "100%",
  alignItems: "center",
},

button: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 50,
  paddingVertical: 12,
  paddingHorizontal: 20,
  width: "80%",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 3,
},

iconCircle: {
  backgroundColor: "#9D7CF8",
  width: 35,
  height: 35,
  borderRadius: 35 / 2,
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  left: 10,
},

buttonText: {
  color: "#9D7CF8",
  fontSize: 16,
  fontWeight: "700",
},


  // Center Image
  centerImage: {
    width: width * 0.6,
    height: width * 0.6,
  },

  // Floating Icons
  iconWrapper: {
    position: "absolute",
    backgroundColor: "#9D7CF8",
    padding: 10,
    borderRadius: 50,
  },
  iconTop: { top: -18 },
  iconLeft: { left: -18 },
  iconRight: { right: -18 },

  // Text
  title: {
    fontSize: width * 0.055,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 40,
  },
  subtitle: {
    color: "#EDE7FF",
    fontSize: width * 0.035,
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 22,
  },

 
});
