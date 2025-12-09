import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextField from '../components/TextFieldComponent';
import globalstyles from '../../styles/globalstyles';
import { loginViewModel } from '../../viewmodels/loginViewModel';

export default function LoginScreen() {
 

const viewModel=loginViewModel()
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Main content area */}
      <View style={styles.container}>
        <View style={styles.formWrapper}>
            <View style={{alignSelf:"center"}}>
 <Text style={[globalstyles.regular_FontMediumblack,styles.title]}>Welcome</Text>
          <Text style={[globalstyles.regular_FontMediumblack]}>Sign in to your account</Text>
            </View>
            <View style={{padding:8,width:"100%"}}>
 <CustomTextField
        value={viewModel.form.email}
        onChangeText={(text) => viewModel.handleInputChange("email", text)}
        label="Username"
        placeholder="Username"
        prefixIcon="person-outline"
        inputstyle={{marginLeft:10}}
      />
      {viewModel.formError.email ? (
        <Text style={{ color: "red", marginBottom: 8 }}>
          {viewModel.formError.email}
        </Text>
      ) : null}

      {/* Password Field */}
      {/* <CustomTextField
        value={viewModel.form.password}
        onChangeText={(text) => viewModel.handleInputChange("password", text)}
        label="Password"
        placeholder="Enter password"
        prefixIcon="eye-outline"
        onPrefixPress={() => console.log("Toggle password")}
        isPassword
      /> */}
      <CustomTextField
  value={viewModel.form.password}
  onChangeText={(text) => viewModel.handleInputChange("password", text)}
  label="Password"
  placeholder="Enter password"
  prefixIcon={showPassword ? "eye-off-outline" : "eye-outline"}
  onPrefixPress={() => setShowPassword(!showPassword)}
  isPassword
  secureTextEntry={!showPassword}
  inputstyle={{marginLeft:10}}
/>
      {viewModel.formError.password ? (
        <Text style={{ color: "red", marginBottom: 8 }}>
          {viewModel.formError.password}
        </Text>
      ) : null}


            </View>
            
        </View>
      </View>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
        onPress={viewModel?.handleLogin}
          style={[styles.button, viewModel.isButtonDisabled&&styles.buttonDisabled]}
           disabled={viewModel.isButtonDisabled}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  formWrapper: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 40 : 80,
    alignItems: 'flex-end', // 👈 moves all form elements to the right
    paddingRight: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'right',
    marginBottom: 50,
  },
  fieldContainer: {
    marginBottom: 24,
    width: '85%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-end', // 👈 ensures the box aligns right
  },
  icon: {
    marginRight: 8,
  },
 // bottom button
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '85%',
    backgroundColor: '#A278F4',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
