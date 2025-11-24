import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from "../login/Login";
import DashboardScreen from "./Dashboard";
import AddMenuModal, { AddMenuModalStaff } from "../bottomtab/AddMenu";
import Dashboard from "./Dashboard";
import { RegisterChildScreen } from "./registerchild/RegisterChild";
import { useNavigation } from "@react-navigation/native";
import SettingsScreen from '../Settings/SettingsScreen'

const Tab = createBottomTabNavigator();

const BottomTabsStaff = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const navigation=useNavigation()

  const CenterButton = ({ children }) => (
    <TouchableOpacity
      style={styles.centerButtonWrapper}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('RegisterChildScreen')}
    >
      <View style={styles.centerButton}>{children}</View>
    </TouchableOpacity>
  );

  const TabIcon = ({ name, focused }) => (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.dot} />}
      <Ionicons
        name={name}
        size={24}
        color={focused ? "#A594F9" : "#A1A1AA"}
        style={styles.icon}
      />
    </View>
  );

  return (
    <>
      <Tab.Navigator
        // initialRouteName="SettingsScreen"

      initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          
        }}
      >
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="settings-outline" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Users"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person-add-outline" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Add"
          component={RegisterChildScreen}
          options={{
            tabBarIcon: () => <Ionicons name="add" size={26} color="#fff" />,
            tabBarButton: (props) => <CenterButton {...props} />,
          }}
        />

        <Tab.Screen
          name="Profile"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person-outline" focused={focused} />
            ),
          }}
        />

        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home-outline" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* 🔼 Add Menu Modal */}
      <AddMenuModalStaff
        visible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
};

export default BottomTabsStaff;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 25,
    backgroundColor: "#F7F4FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    borderTopWidth: 0,
  },
  iconContainer: {
    alignItems: "center",
    marginTop:4
    //justifyContent: "center",
  
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A594F9",
    marginBottom: 5,
  },
  icon: { marginTop: 2 },
  centerButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    top: -3,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#A594F9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A594F9",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
});
