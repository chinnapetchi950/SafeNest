import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screen/login/splashscreen';
import Login from './src/screen/login/Login';
import LoginScreen from './src/screen/login/Login';
import Dashboard from './src/screen/staff/Dashboard';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import BottomTabs from './src/screen/bottomtab/bottomTabbar';
import AccountTypeScreen from './src/screen/bottomtab/adduser/AddUser';
import { UserInformationScreen } from './src/screen/bottomtab/adduser/UserInformationScreen';
import CommonLoader from './src/screen/components/CommanLoader';
import BottomTabsStaff from './src/screen/staff/BottomTabStaff';
import { RegisterChildScreen } from './src/screen/staff/registerchild/RegisterChild';
import SessionDetailsScreen from './src/screen/staff/registerchild/SessionDetailsScreen';


// Import your screens

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // ✅ Ensures SafeArea works across screens (top/bottom insets)
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="splashScreen"
            screenOptions={{
              headerShown: false, // Fullscreen, no top header
              animation: 'slide_from_right', // Smooth transition
              // You can also add: gestureEnabled: false, if you want to disable back swipe
            }}
          >
            <Stack.Screen
              name="UserInformationScreen"
              component={UserInformationScreen}
            />
            <Stack.Screen
              name="SessionDetailsScreen"
              component={SessionDetailsScreen}
            />
            <Stack.Screen
              name="AccountTypeScreen"
              component={AccountTypeScreen}
            />

            <Stack.Screen
              name="RegisterChildScreen"
              component={RegisterChildScreen}
            />

            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="BottomTabsStaff" component={BottomTabsStaff} />

            <Stack.Screen name="Login" component={LoginScreen} />

            <Stack.Screen name="splashScreen" component={SplashScreen} />
            {/* Add more screens here */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      <CommonLoader /> {/* ✅ Always visible, listens to Redux */}
    </Provider>
  );
}
