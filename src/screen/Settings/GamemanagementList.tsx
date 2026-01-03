import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import authService from "../../features/auth/authService";
import strings from '../../localization/en';
import moment from "moment";
import { useTranslation } from "../../contexts/LanguageContext";

export default function GameManagementScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("current");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { t } = useTranslation();

  // --------------------------
  // 📌 Fetch Games API
  // --------------------------
 const getGameData = async (reset = false) => {
  setLoading(true)
  try {
    const currentPage = reset ? 1 : page;

    const res = await authService.getGameList(currentPage);

    const data = res?.data?.data ?? [];
    const meta = res?.data?.meta;

    setLastPage(meta?.last_page || 1);

    if (reset) {
      setGames(data);
      setPage(1);
    } else {
      setGames(prev => [...prev, ...data]);
    }
setLoading(false)
  } catch (error) {
    setLoading(false)
    console.log("❌ Fetch error:", error);
  }
};


  useEffect(() => {
    getGameData(true);
  }, []);

  // --------------------------
  // 📌 Pull to Refresh
  // --------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await getGameData(true);
    setRefreshing(false);
  };

  // --------------------------
  // 📌 Pagination
  // --------------------------
  const loadMore = () => {
  if (page < lastPage) {
    const next = page + 1;
    setPage(next);
    getGameData();
  }
};

  // --------------------------
  // 📌 Delete Game
  // --------------------------
  const deleteGame = (id) => {
  Alert.alert(
    t('common.delete'),
    t('gameManagement.deleteConfirm') || "Are you sure you want to delete this game?",
    [
      { text: t('common.cancel') },
      {
        text: t('common.delete')  ,
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          try {
            await authService.deleteGame(id);

            setGames(prev => prev.filter(x => x.id !== id));
setLoading(false)
          } catch (err) {
            setLoading(false)
            console.log("❌ Delete error:", err?.response);
          }
        },
      },
    ]
  );
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/* Header */}
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text style={styles.headerTitle}>Game Management</Text>

          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-forward-outline"
            size={24}
            color="#111"
            style={{ marginLeft: 6 }}
          />
        </View>

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
        </View>

        {/* GAME LIST */}
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GameCard game={item} onDelete={() => deleteGame(item.id)} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            !loading && (
              <Text
                    style={{
                      textAlign: "center",
                      marginTop: 30,
                      color: "#888",
                    }}
                  >
                    {t('common.noData')}
                  </Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// CARD COMPONENT
// --------------------------------------------------
const GameCard = ({ game, onDelete }) => {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          //marginTop: 8,
          alignItems:'center'
        }}
      >
        <View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.dateLabel}>Game Name</Text>
          <Text style={styles.cardTitle}>{game.name}</Text>
          {/* <Text style={styles.dateLabel}>Game Joining Date</Text> */}
          {/* <Text style={styles.date}>{moment(game.date).format('yyyy mmm DD')}</Text> */}
        </View>
      </View>

      <View style={styles.line} />

      {/* SESSIONS */}
      {game.sessions?.map((s, i) => (
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
            <Text style={styles.time}>{`${s.duration} ${ "Min"}`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// --------------------------------------------------
// STYLES
// --------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  headerTitle: {
    fontSize: 18,
    color: "#111",
    fontWeight: "600",
    marginRight: 60,
  },
  tabsWrapper: {
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 30,
  },
  tabText: { fontSize: 16, color: "#999", textAlign: "right" },
  activeTabText: { fontSize: 16, color: "#6C4BEE", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    borderWidth: 0.2,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },

  editBtn: {
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  editText: { color: "#888" },

  deleteBtn: { marginTop: 8, padding: 5 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    //marginTop: -30,
  },
  dateLabel: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 5 },
  date: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  line: { height: 2, backgroundColor: "#EEE", marginVertical: 12 },

  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: { color: "#777", fontSize: 13 },
  price: { fontSize: 14, fontWeight: "600" },
  time: { fontSize: 14, fontWeight: "600", color: "#8D55F6",textAlign:'right' },
});
