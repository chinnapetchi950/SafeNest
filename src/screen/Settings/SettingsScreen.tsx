import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Alert ,ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../contexts/LanguageContext';
import globalstyles from '../../styles/globalstyles';
import { logoutUser,deleteUserAccount } from '../../features/auth/authSlice';
import Storage from '../../utils/storage';
import { useDispatch, useSelector } from "react-redux";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Dispatch } from '@reduxjs/toolkit';
import { uploadProfileImage } from '../../features/auth/SettingProfile/ProfileimageSlice';
import { updateLoginProfileImage } from '../../features/auth/authSlice';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);
  const [profileData,setUserprofileData]=useState({})
const [uploadingImage, setUploadingImage] = useState(false);


const userdata = useSelector(
  (state) => state.auth?.data?.login
);
//  console.log(userdata,'userdata==>');

useEffect(() => {
  if (userdata?.data) {
    setUserprofileData(userdata?.data);
  }
}, [profileData]);
 console.log(userdata,'usrdata');

  useEffect(() => {
    const loadRole = async () => {
      const r = await Storage.getItem('admin'); // contains "admin" or "user"
      setRole(r);
    };
    loadRole();
  }, []);
  const { t } = useTranslation();

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
    t('settings.selectOption'),
    t('settings.chooseImageSource'),
    [
      { text: t('common.camera'), onPress: openCamera },
      { text: t('common.gallery'), onPress: openGallery },
      { text: t('common.cancel'), style: "cancel" }
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
  Alert.alert(t('alerts.error') || 'Error', response.errorMessage || t('alerts.error'));
    return;
  }

  const image = response.assets[0];
  setUploadingImage(true); // start loader

  dispatch(uploadProfileImage({ image })).unwrap()
    .then((url) => {       // api returns URL string
      console.log("Uploaded Image URL:", url);

      if (url) {
        // update userData properly
              dispatch(updateLoginProfileImage(url));  // <--- UPDATE REDUX LOGIN DATA

        setUserprofileData(prev => ({
          ...prev,
          profile_image: url?.profile_image_url,   // full URL returned directly
        }));
  setUploadingImage(false); // start loader

  Alert.alert(t('alerts.success') || 'Success', t('settings.profileUpdatedSuccess') || 'Profile updated successfully!');
      }
    })
    .catch(() => {});
};


const BASE_URL = "https://testlink3.pillersofttechnologies.com/storage/";

const getFinalProfileImageUrl = (profile_image) => {
  if (!profile_image) return null;

  // CASE 1 — already full URL
  if (profile_image.startsWith("http")) {
    return profile_image;
  }

  // CASE 2 — relative path "users/profile_images/xxxx.jpg"
  return BASE_URL + profile_image;
};


  return (
    <SafeAreaView style={styles.container}>
     
      <View style={styles.headerSpace} />
       {role === 'admin' && 
 <View style={styles.headerRow}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        <Text style={styles.userName}>{t('settings.manageAccount')}</Text>
      </View>
}
{/* {console.log(profileData,'profileData')} */}

      {/* Profile Image */}
      {role != 'admin' && (
        <>
          <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
            {/* <Image
  //             source={
  //   userData?.profile_image
  //     ? { uri: `${userData.profile_image}?v=${Date.now()}` }
  //     : require('../../../assets/images/setting_profile.png')
  // }

            source={
      userData?.profile_image
        ? { uri: `${"https://testlink3.pillersofttechnologies.com/storage/"}${userData.profile_image}` }
        : require('../../../assets/images/setting_profile.png')
    }
              // source={require('../../../assets/images/setting_profile.png')}
              style={styles.profileImage}
            /> */}
            <View style={{ width: 120, height: 120, borderRadius: 60 }}>
  
            <Image
 source={
    profileData?.profile_image
      ? { uri: `${getFinalProfileImageUrl(profileData?.profile_image)}` }
      : require('../../../assets/images/setting_profile.png')
  }
  style={styles.profileImage}
/>

</View>
          </TouchableOpacity>

          <View style={{ marginHorizontal: 20 }}>
            <Text
              style={[
                globalstyles.regular_FontblackFontWeight,
                { margin: 5, textAlign: 'right', fontSize: 16 },
              ]}
            >
              {[profileData?.firstname, profileData.secondname, profileData.thirdname, profileData.fourthname]
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
              {profileData?.email}
            </Text>
            <Text
              style={[
                globalstyles.regular_Fontblack,
                { marginRight: 5, textAlign: 'right', fontSize: 12 },
              ]}
            >
              {profileData?.phone}
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
              {t('settings.changePassword')}
            </Text>
            <Ionicons name="lock-closed-outline" size={22} color="#A78BFA" />
          </View>
        </TouchableOpacity>
      )}
      {role === 'admin' && 
      <TouchableOpacity onPress={()=>navigation.navigate('AccountManagementScreen')}style={styles.row}>
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
            {t('settings.accountManagement')}
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
            {t('settings.gameManagement')}
          </Text>
          <Ionicons name="game-controller-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>}
       {role === 'admin' && 
      <TouchableOpacity  onPress={()=>navigation.navigate('WhatsAppManagementScreen')}                
       style={styles.row}>
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
            {t('settings.whatsappManagement')}
          </Text>
          <Ionicons name="call-outline" size={22} color="#A78BFA" />
        </View>
      </TouchableOpacity>}
       {role === 'admin' && 
      <TouchableOpacity 
      onPress={()=>navigation.navigate('MessageManagementScreen')} 
      style={styles.row}>
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
            {t('settings.messageManagement')}
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
            {t('settings.deleteAccount')}
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
            {t('settings.logout')}
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
