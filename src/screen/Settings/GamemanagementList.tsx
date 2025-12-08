import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

const mockGames = [
  {
    id: 1,
    name: "Jumping Game",
    date: "2025 April 15",
    sessions: [
      { price: "5,000 IQD", time: "15:00 Min" },
      { price: "7,000 IQD", time: "30:00 Min" },
      { price: "10,000 IQD", time: "45:00 Min" },
    ],
  },
  {
    id: 2,
    name: "Jumping Game",
    date: "2025 April 15",
    sessions: [
      { price: "5,000 IQD", time: "15:00 Min" },
      { price: "7,000 IQD", time: "30:00 Min" },
      { price: "10,000 IQD", time: "45:00 Min" },
    ],
  },
];

export default function GameManagementScreen({navigation}) {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
        <View
          style={{
            //flex: 1,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end', // 👈 pushes BOTH to the right
            alignItems: 'center',
          }}
        >
          <Text style={styles.headerTitle}>Game Management</Text>
        
          <Ionicons
          onPress={()=>navigation.goBack()}
            name="chevron-forward-outline"
            size={24}
            color="#111"
            style={{ marginLeft: 6 }} // spacing between text & icon
          />
        </View>
      {/* Header */}

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity onPress={() => setActiveTab("current")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeTabText,
            ]}
          >
            Current Games
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("previous")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "previous" && styles.activeTabText,
            ]}
          >
            Previously Registered Games
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cards List */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15 }}>
        {mockGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </ScrollView>
    </View>
        </SafeAreaView>

  );
}

const GameCard = ({ game }) => {
  return (
    <View style={styles.card}>
      {/* Edit Button */}
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>

      
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <View>
 <Text style={styles.cardTitle}>{game.name}</Text>

      <Text style={styles.dateLabel}>Game Joining Date</Text>
      <Text style={styles.date}>{game.date}</Text>

      </View>
      </View>
     
      <View style={styles.line} />

      {/* Session List */}
      {game.sessions.map((s, i) => (
        <View key={i} style={styles.sessionRow}>
          <View>
            <Text style={styles.label}>Session Price</Text>
            <Text style={styles.price}>{s.price}</Text>
          </View>

          <View>
            <Text style={styles.label}>
              {i === 0
                ? "First Session"
                : i === 1
                ? "Second Session"
                : "Third Session"}
            </Text>
            <Text style={styles.time}>{s.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
 headerTitle: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    textAlign:'left',
    marginRight:60,
  },
  tabsWrapper: {
    flexDirection: "column",
    justifyContent: 'flex-end',
    gap: 20,
    marginTop:30
  },

  tabText: {
    fontSize: 16,
    color: "#999",
    textAlign:'right'
  },

  activeTabText: {
    fontSize: 16,
    color: "#6C4BEE",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },

  editBtn: {
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingVertical: 5,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    borderRadius: 20,
    marginBottom: 5,
  },

  editText: { color: "#888" },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginTop: -30,
  },

  dateLabel: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },

  date: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  line: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },

  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    color: "#777",
    fontSize: 13,
  },

  price: {
    fontSize: 14,
    fontWeight: "600",
  },

  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8D55F6",
  },
});
