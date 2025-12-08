import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalstyles from '../../styles/globalstyles';
import { logoutUser,deleteUserAccount } from '../../features/auth/authSlice';
import Storage from '../../utils/storage';
import { useDispatch, useSelector } from "react-redux";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Dispatch } from '@reduxjs/toolkit';
import { uploadProfileImage } from '../../features/auth/SettingProfile/ProfileimageSlice';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);
  const [userData,setUserData]=useState({})


const userdata = useSelector(
  (state) => state.auth?.data?.login
);
 console.log(userdata,'userdata==>');

useEffect(() => {
  if (userdata?.data) {
    setUserData(userdata?.data)


  }
}, [userData]);
 console.log(userData,'usrdata');

  useEffect(() => {
    const loadRole = async () => {
      const r = await Storage.getItem('admin'); // contains "admin" or "user"
      setRole(r);
    };
    loadRole();
  }, []);
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigation.replace('Login'); // optional navigation
    });
  };
  const handleDelete = () => {
   

    dispatch(deleteUserAccount()).then(() => {
    navigation.replace('Login'); // optional navigation
    });
  };
const pickImage = () => {
  Alert.alert(
    "Select Option",
    "Choose image source",
    [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" }
    ]
  );
};

const openCamera = () => {
  launchCamera(
    {
      mediaType: 'photo',
      quality: 0.8,
    },
    response => handleImageResponse(response)
  );
};

const openGallery = () => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 0.8,
    },
    response => handleImageResponse(response)
  );
};


const handleImageResponse = (response) => {
  if (response.didCancel) return;
  if (response.errorMessage) {
    Alert.alert("Error", response.errorMessage);
    return;
  }

  const image = response.assets[0];

  dispatch(uploadProfileImage({image})).unwrap()
    .then((res: { status: any; data: { profile_image_url: any; }; }) => {
      console.log("res====================>",res);
      
      if (res.status) {
        
        Alert.alert("Success", "Profile updated successfully!");

        // update local user state
        setUserData({
          ...userData,
          profile_image: res.profile_image_url,
        });
      }
    })
    .catch(() => {});
};




  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.headerSpace} />
       {role === 'admin' && 
 <View style={styles.headerRow}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.userName}>Manage your account settings and preferences</Text>
      </View>
}

      {/* Profile Image */}
      {role != 'admin' && (
        <>
          <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
            <Image
            source={
      userData?.profile_image
        ? { uri: userData.profile_image }
        : require('../../../assets/images/setting_profile.png')
    }
              // source={require('../../../assets/images/setting_profile.png')}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={[
                globalstyles.regular_FontblackFontWeight,
                { margin: 5, textAlign: 'right', fontSize: 16 },
              ]}
            >
              {[userData?.firstname, userData.secondname, userData.thirdname, userData.fourthname]
    .filter(Boolean)   
    .join(" ")}
              {/* Sarah Saad Kadhem */}
            </Text>
            <Text
              style={[
                globalstyles.regular_Fontblack,
                { margin: 5, textAlign: 'right', fontSize: 12 },
              ]}
            >
              {userData?.email}
            </Text>
            <Text
              style={[
                globalstyles.regular_Fontblack,
                { marginRight: 5, textAlign: 'right', fontSize: 12 },
              ]}
            >
              {userData?.phone}
            </Text>
          </View>
        </>
      )}
      <View style={{ marginTop: 20 }}></View>
      {/* Options */}
      {role != 'admin' && (
        <TouchableOpacity onPress={()=>navigation.navigate("ChangePasswordScreen")}style={styles.row}>
          <View>
            <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                globalstyles.regular_FontblackFontWeight,
                { textAlign: 'right', fontSize: 18, marginRight: 20 },
              ]}
            >
              Change Password
            </Text>
            <Ionicons name="lock-closed-outline" size={22} color="#A78BFA" />
          </View>
        </TouchableOpacity>
      )}
      {role === 'admin' && 
      <TouchableOpacity style={styles.row}>
        <View>
          <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              globalstyles.regular_FontblackFontWeight,
              { textAlign: 'right', fontSize: 18, marginRight: 20 },
            ]}
          >
            Account Management
          </Text>
          <Ionicons name="person" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>}
       {role === 'admin' && 
      <TouchableOpacity onPress={()=>navigation.navigate('GameManagementScreen')} style={styles.row}>
        <View>
          <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              globalstyles.regular_FontblackFontWeight,
              { textAlign: 'right', fontSize: 18, marginRight: 20 },
            ]}
          >
            Game Management
          </Text>
          <Ionicons name="game-controller-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>}
       {role === 'admin' && 
      <TouchableOpacity style={styles.row}>
        <View>
          <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              globalstyles.regular_FontblackFontWeight,
              { textAlign: 'right', fontSize: 18, marginRight: 20 },
            ]}
          >
            Whatsapp Management
          </Text>
          <Ionicons name="call-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>}
       {role === 'admin' && 
      <TouchableOpacity style={styles.row}>
        <View>
          <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              globalstyles.regular_FontblackFontWeight,
              { textAlign: 'right', fontSize: 18, marginRight: 20 },
            ]}
          >
            Message Management
          </Text>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>}
      <TouchableOpacity onPress={()=>handleDelete()}style={styles.row}>
        <View>
          <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              globalstyles.regular_FontblackFontWeight,
              { textAlign: 'right', fontSize: 18, marginRight: 20 },
            ]}
          >
            Delete Account
          </Text>
          <Ionicons name="trash-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>

      {/* Logout */}
      {/* <TouchableOpacity style={styles.logoutRow}>
        <Text style={styles.logoutText}>Log Out</Text>
        <Ionicons name="log-out-outline" size={22} color="red" />
      </TouchableOpacity> */}

      <View style={styles.bottomSpace} />
      <TouchableOpacity onPress={() => handleLogout()} style={styles.row}>
        <View>
          <Ionicons name="chevron-back-outline" size={22} color="#A4A3A9" />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              globalstyles.regular_FontblackFontWeight,
              {
                textAlign: 'right',
                color: 'red',
                fontSize: 18,
                marginRight: 20,
              },
            ]}
          >
            Log Out
          </Text>
          <Ionicons name="log-out-outline" size={24} color="red" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
   headerRow: { marginTop: 5,marginRight:20 },
  title: { color: "#000", fontWeight: "bold", fontSize: 18,textAlign:'right' },
  userName: { marginTop: 3, color: "#444", fontSize: 16 ,textAlign:'right'},
  headerSpace: {
    height: 30,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EAEAEA',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 12,
    color: 'gray',
  },
  phone: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 15,
    marginTop: 20,
  },
  optionText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#000',
  },
  logoutRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    marginRight: 10,
  },
  bottomSpace: {
    height: '25%',
  },
});
