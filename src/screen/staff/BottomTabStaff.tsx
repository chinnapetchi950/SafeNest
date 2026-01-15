// import React, { useState } from "react";
// import { View, TouchableOpacity, StyleSheet } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LoginScreen from "../login/Login";
// import DashboardScreen from "./Dashboard";
// import AddMenuModal, { AddMenuModalStaff } from "../bottomtab/AddMenu";
// import Dashboard from "./Dashboard";
// import { RegisterChildScreen } from "./registerchild/RegisterChild";
// import { useNavigation } from "@react-navigation/native";
// import SettingsScreen from '../Settings/SettingsScreen'
// import ChildListscreen from '../ChildrenList/ChildListScreen' ;
// import NotificationScreen from "./NotificationList";


// const Tab = createBottomTabNavigator();

// const BottomTabsStaff = () => {
//   const [isMenuVisible, setMenuVisible] = useState(false);
//   const navigation=useNavigation()

//   const CenterButton = ({ children }) => (
//     <TouchableOpacity
//       style={styles.centerButtonWrapper}
//       activeOpacity={0.9}
//       onPress={() => navigation.navigate('RegisterChildScreen')}
//     >
//       <View style={styles.centerButton}>{children}</View>
//     </TouchableOpacity>
//   );

//   const TabIcon = ({ name, focused }) => (
//     <View style={styles.iconContainer}>
//       {focused && <View style={styles.dot} />}
//       <Ionicons
//         name={name}
//         size={24}
//         color={focused ? "#A594F9" : "#A1A1AA"}
//         style={styles.icon}
//       />
//     </View>
//   );

//   return (
//     <>
//       <Tab.Navigator
//         // initialRouteName="SettingsScreen"

//       initialRouteName="Dashboard"
//         screenOptions={{
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: styles.tabBar,
          
//         }}
//       >
//         <Tab.Screen
//           name="Settings"
//           component={SettingsScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon name="settings-outline" focused={focused} />
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Users"
//           component={ChildListscreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon name="person-add-outline" focused={focused} />
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Add"
//           component={RegisterChildScreen}
//           options={{
//             tabBarIcon: () => <Ionicons name="add" size={26} color="#fff" />,
//             tabBarButton: (props) => <CenterButton {...props} />,
//           }}
//         />

//         <Tab.Screen
//           name="Profile"
//           component={NotificationScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon name="notifications-outline" focused={focused} />
//             ),
//           }}
//         />

//         <Tab.Screen
//           name="Dashboard"
//           component={Dashboard}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon name="home-outline" focused={focused} />
//             ),
//           }}
//         />
//       </Tab.Navigator>

//       {/* 🔼 Add Menu Modal */}
//       <AddMenuModalStaff
//         visible={isMenuVisible}
//         onClose={() => setMenuVisible(false)}
//       />
//     </>
//   );
// };

// export default BottomTabsStaff;

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     height: 70,
//     borderRadius: 25,
//     backgroundColor: "#F7F4FF",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 5,
//     borderTopWidth: 0,
//   },
//   iconContainer: {
//     alignItems: "center",
//     marginTop:4
//     //justifyContent: "center",
  
//   },
//   dot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#A594F9",
//     marginBottom: 5,
//   },
//   icon: { marginTop: 2 },
//   centerButtonWrapper: {
//     justifyContent: "center",
//     alignItems: "center",
//     top: -3,
//   },
//   centerButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#A594F9",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#A594F9",
//     shadowOpacity: 0.4,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 6,
//   },
// });
import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import AddMenuModal, { AddMenuModalStaff } from "../bottomtab/AddMenu";
import Dashboard from "./Dashboard";
import { RegisterChildScreen } from "./registerchild/RegisterChild";
import SettingsScreen from "../Settings/SettingsScreen";
import ChildListscreen from "../ChildrenList/ChildListScreen";
import NotificationScreen from "./NotificationList";
import authService from "../../features/auth/authService";

import apiClient from "../../api/apiClient";

const Tab = createBottomTabNavigator();

const BottomTabsStaff = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigation = useNavigation();

  /* 🔔 FETCH UNREAD NOTIFICATION COUNT */
  const fetchUnreadCount = async () => {
    try {
      const res = await authService.notification_List();
      const list = res.data?.data || [];
      const unread = list.filter(item => !item.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log("Unread count error", err?.response?.data);
    }
  };

  /* 🔄 REFRESH COUNT WHEN TAB FOCUSES */
  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  /* ➕ CENTER BUTTON */
  const CenterButton = ({ children }) => (
    <TouchableOpacity
      style={styles.centerButtonWrapper}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("RegisterChildScreen")}
    >
      <View style={styles.centerButton}>{children}</View>
    </TouchableOpacity>
  );

  /* 🔔 TAB ICON WITH BADGE SUPPORT */
  const TabIcon = ({ name, focused, showBadge }) => (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.dot} />}

      <View style={{ position: "relative" }}>
        <Ionicons
          name={name}
          size={24}
          color={focused ? "#A594F9" : "#A1A1AA"}
          style={styles.icon}
        />

        {showBadge && unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Tab.Navigator
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
          component={ChildListscreen}
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

        {/* 🔔 NOTIFICATION TAB WITH BADGE */}
        <Tab.Screen
          name="Profile"
          component={NotificationScreen}
          listeners={{
    tabPress: () => {
      fetchUnreadCount(); // 🔥 FORCE REFRESH BADGE
    },
  }}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="notifications-outline"
                focused={focused}
                showBadge
              />
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

      {/* 🔼 ADD MENU MODAL */}
      <AddMenuModalStaff
        visible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
};

export default BottomTabsStaff;

/* 🎨 STYLES */
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
    marginTop: 4,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A594F9",
    marginBottom: 5,
  },

  icon: { marginTop: 2 },

  /* 🔴 BADGE */
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

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
