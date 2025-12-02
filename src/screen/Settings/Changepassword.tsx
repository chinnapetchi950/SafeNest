import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../components/CustomHeader";
// import SuccessModal from "../components/SuccessModal";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../features/auth/authSlice";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.auth.loading.changePassword);

  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [reNew, setReNew] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = () => {
    if (!current || !newPwd || !reNew) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (newPwd !== reNew) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
 dispatch(changePassword({
      current_password: current,
      new_password: newPwd,
      new_password_confirmation:reNew
    })).then(() => {
      setCurrent("");
          setNewPwd("");
          setReNew("");
      //navigation.replace('Login'); // optional navigation
    });
    // dispatch(changePassword({
    //   current_password: current,
    //   new_password: newPwd,
    //   new_password_confirmation:reNew
    // }))
    //   .unwrap()
    //   .then((res) => {
    //     console.log(res,'res==>');
        
    //     if (res.data?.status===true) {
    //         navigation.navigate('Login')

    //       //setModalVisible(true);
    //       setCurrent("");
    //       setNewPwd("");
    //       setReNew("");
    //     }
    //   })
    //   .catch(() => {});
  };

  return (
    <View >

      <CustomHeader
        title="Change Password"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: wp("5%"), paddingTop: hp("3%") }}>

        {/* CURRENT PASSWORD */}
        <Text style={{ fontSize: 16 }}>Current Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Enter Password"
            secureTextEntry={!showCurrent}
            value={current}
            onChangeText={setCurrent}
            style={{
              borderWidth: 1,
              borderColor: "#C9C9C9",
              borderRadius: 10,
              padding: wp("4%"),
              marginTop: hp("1%")
            }}
          />
          <TouchableOpacity
            onPress={() => setShowCurrent(!showCurrent)}
            style={{ position: "absolute", right: wp("4%"), top: hp("3%") }}
          >
            <Ionicons size={20} name={showCurrent ? "eye" : "eye-off"} />
          </TouchableOpacity>
        </View>

        {/* NEW PASSWORD */}
        <Text style={{ marginTop: hp("2%"), fontSize: 16 }}>New Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Enter Password"
            secureTextEntry={!showNew}
            value={newPwd}
            onChangeText={setNewPwd}
            style={{
              borderWidth: 1,
              borderColor: "#C9C9C9",
              borderRadius: 10,
              padding: wp("4%"),
              marginTop: hp("1%")
            }}
          />
          <TouchableOpacity
            onPress={() => setShowNew(!showNew)}
            style={{ position: "absolute", right: wp("4%"), top: hp("3%") }}
          >
            <Ionicons size={20} name={showNew ? "eye" : "eye-off"} />
          </TouchableOpacity>
        </View>

        {/* RE PASSWORD */}
        <Text style={{ marginTop: hp("2%"), fontSize: 16 }}>Re-Enter Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Enter Password"
            secureTextEntry={!showRe}
            value={reNew}
            onChangeText={setReNew}
            style={{
              borderWidth: 1,
              borderColor: "#C9C9C9",
              borderRadius: 10,
              padding: wp("4%"),
              marginTop: hp("1%")
            }}
          />
          <TouchableOpacity
            onPress={() => setShowRe(!showRe)}
            style={{ position: "absolute", right: wp("4%"), top: hp("3%") }}
          >
            <Ionicons size={20} name={showRe ? "eye" : "eye-off"} />
          </TouchableOpacity>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={{
            backgroundColor: "#A278F4",
            paddingVertical: hp("2%"),
            borderRadius: 30,
            marginTop: hp("4%"),
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {loading ? "Updating..." : "Change Password"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <SuccessModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="Your password has been updated successfully!"
      /> */}

    </View>
  );
};

export default ChangePasswordScreen;
