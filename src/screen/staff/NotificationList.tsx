import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // -----------------------------
  // API FETCH (Dummy format shown)
  // -----------------------------
  const fetchNotifications = async () => {
    setLoading(true);

    // Replace this with your API call
    const fakeResponse = [
      {
        id: 1,
        child_name: "Child Maryam Hassan Kadhem",
        message:
          "The session has ended, please contact the guardian to safely hand over the child.",
        time: "1 min ago",
        is_new: true,
      },
      {
        id: 2,
        child_name: "Child Mohammed Hassan Kadhem",
        message:
          "The session has ended, please contact the guardian to safely hand over the child.",
        time: "1 min ago",
        is_new: true,
      },
      {
        id: 3,
        child_name: "Child Sarah Mohammed Kadhem",
        message:
          "The session has ended, please contact the guardian to safely hand over the child.",
        time: "1 min ago",
        is_new: false,
      },
      {
        id: 4,
        child_name: "Child Sarah Mohammed Kadhem",
        message:
          "The session has ended, please contact the guardian to safely hand over the child.",
        time: "1 min ago",
        is_new: false,
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setNotifications(fakeResponse);
      setLoading(false);
    }, 600);
  };

  // -----------------------------
  // Grouping by New & Today
  // -----------------------------
  const newNotifications = notifications.filter((n) => n.is_new);
  const todayNotifications = notifications.filter((n) => !n.is_new);

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.time}>{item.time}</Text>
        <View >
        {/* <Ionicons name="hourglass-outline" size={18} color="#C5A8FF" /> */}

        </View>
      </View>

      <Text style={styles.childName}>{item.child_name}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" ,marginTop:10}}>
        {/* <Text style={styles.time}>{item.time}</Text> */}
        <View >
                    </View>

        <Ionicons name="hourglass-outline" size={18} color="#C5A8FF" />

      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#764AF1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="options-outline" size={22} color="#333" />
        <Text style={styles.headerTitle}>Notifications</Text>
        <Ionicons name="notifications-outline" size={22} color="#764AF1" />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* -------------------- NEW SECTION -------------------- */}
            {newNotifications.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>New</Text>
                <FlatList
                  data={newNotifications}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderNotification}
                />
              </>
            )}

            {/* -------------------- TODAY SECTION -------------------- */}
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Today</Text>
          </>
        }
        data={todayNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        ListFooterComponent={
          <TouchableOpacity style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All Activities</Text>
          </TouchableOpacity>
        }
      />
    </View>
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop:10,
    elevation:3
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#764AF1",
    marginTop: 10,
    marginBottom: 10,
    textAlign:'right'
  },

  card: {
    backgroundColor: "#F8F5FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFE6FF",
  },

  time: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },

  childName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#764AF1",
    marginTop: 2,
    textAlign:'right'
  },

  message: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
        textAlign:'right'

  },

  viewAll: {
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#EEE",
    marginTop: 10,
  },

  viewAllText: {
    color: "#764AF1",
    fontSize: 15,
    fontWeight: "600",
  },
});
