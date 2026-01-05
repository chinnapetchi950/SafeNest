import React,{useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../../utils/images';
import { string } from '../../utils/String';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalstyles from '../../styles/globalstyles';
import Storage from '../../utils/storage';
//import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await Storage.getItem("token"); 
        const role=await Storage.getItem('role');
        // or saved user data key

        if (user) {
          // Already logged in ➜ Go to Dashboard
           if(role==='user'){
      navigation.navigate("BottomTabsStaff"); 

      }else{
        navigation.navigate("BottomTabs"); 

      }
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'Dashboard' }],
          // });
        } else {
          // No login → Stay in splash for 2 sec then show login
          // setTimeout(() => {
          //   navigation.navigate('Login');
          // }, 2000);
        }
      } catch (error) {
        console.log("Error reading storage:", error);
      }
    };

    checkLogin();
  }, []);
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="#A774F0"
        barStyle="light-content"
      />
      <LinearGradient colors={['#A774F0', '#8064E9']} style={styles.container}>
      <ImageBackground
  source={images.splash_screen}
  style={styles.centerImage1}
  resizeMode="center"
>
  <View style={styles.centerContent}>
    <Image
      source={images.applogo}
      style={{ width: '70%', height: '90%' }}
      resizeMode='stretch'
    />
  </View>
</ImageBackground>


  
{/* <Image
          source={images.splash_screen} // replace with your actual image
          style={styles.centerImage}
          resizeMode="center"
        /> */}

        <Text style={[globalstyles.regular_FontMedium, styles.title]}>
          {t("splash.splash_center1")}
        </Text>
        <Text style={[globalstyles.regular_Fontblack, styles.subtitle]}>
          {t("splash.splash_center2")}
        </Text>
        {/* Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          >
            <View style={styles.iconCircle}>
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="chevron-back-outline" size={18} color="#fff" />
              </View>
            </View>
            <Text style={[globalstyles.semibold_black, styles.buttonText]}>
              {t("splash.get_started")}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  iconCircle: {
    backgroundColor: '#9D7CF8',
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
  },

  buttonText: {
    color: '#9D7CF8',
    fontSize: 16,
    fontWeight: '700',
  },

  // Center Image
  centerImage: {
    width: width * 0.6,
    height: width * 0.6,
  },

  // Floating Icons
  iconWrapper: {
    position: 'absolute',
    backgroundColor: '#9D7CF8',
    padding: 10,
    borderRadius: 50,
  },
  iconTop: { top: -18 },
  iconLeft: { left: -18 },
  iconRight: { right: -18 },

  // Text
  title: {
    fontSize: width * 0.055,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    color: '#EDE7FF',
    fontSize: width * 0.035,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  
  overlayImage: {
    position: "absolute",
    width: 100,
    height: 100,
    marginBottom:40
  },
   centerImage1: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
