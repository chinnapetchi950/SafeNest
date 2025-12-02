// MessageScreens.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

// Simple small pill button
function Pill({ children, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, style]}>
      <Text style={styles.pillText}>{children}</Text>
    </TouchableOpacity>
  );
}

function MessageCard({ item, onEdit }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Pill style={styles.editPill} onPress={() => onEdit(item)}>
          Edit Message
        </Pill>
        <Text style={styles.cardTitle}>{item.message_name}</Text>
      </View>

      <Text style={styles.cardBody} numberOfLines={3}>
        {item.message_content}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          {formatSendingText(item)}
        </Text>
        <Text style={styles.sendingLabel}>Sending Time</Text>
      </View>
    </View>
  );
}

function formatSendingText(item) {
  // Example: "2 minutes before the session ends" or absolute time
  if (item.type === "alert") {
    const dir = item.offset_type === "before" ? "before" : "after";
    return `${item.offset_time} minutes ${dir} the session ends`;
  }
  if (item.type === "reward") {
    return `Sent on ${item.send_date || "—"} at ${item.send_time || "—"}`;
  }
  if (item.type === "working_hours") {
    return `At close ${item.when_place_closes ? "(when place closes)" : item.send_time || "—"}`;
  }
  return item.send_time || "—";
}

/* -------------------------
   API helpers (replace URL)
   ------------------------- */
const API_BASE = "https://api.example.com"; // <-- replace

async function fetchMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages`);
    if (!res.ok) throw new Error("Failed to load");
    const json = await res.json();
    return json;
  } catch (e) {
    console.warn("fetchMessages error", e);
    return { data: [] };
  }
}

async function createOrUpdateMessage(payload) {
  // if payload.id exists -> PUT else POST
  const method = payload.id ? "PUT" : "POST";
  const url = payload.id ? `${API_BASE}/messages/${payload.id}` : `${API_BASE}/messages`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("save failed");
  return await res.json();
}

/* -------------------------
   Saved Messages Screen
   ------------------------- */
export function SavedMessagesScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      fetchMessages()
        .then((r) => {
          if (!mounted) return;
          // normalize into array
          const data = r.data || [];
          setMessages(data);
        })
        .finally(() => mounted && setLoading(false));
      return () => (mounted = false);
    }, [])
  );

  function onEdit(item) {
    navigation.navigate("MessageForm", { mode: "edit", id: item.id });
  }

  const byCategory = messages; // assume already category sorted

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Message Management</Text>
      </View>

      <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.tabActive]}>Send Message</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateNew")}>
          <Text style={styles.tabText}>Create New Message</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={byCategory}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => <MessageCard item={item} onEdit={onEdit} />}
        ListEmptyComponent={<Text style={styles.empty}>No saved messages</Text>}
      />
    </View>
  );
}

/* -------------------------
   Message Form Screen (Create/Edit single message)
   ------------------------- */
export function MessageFormScreen({ navigation, route }) {
  const { mode = "create", id = null, initialType = "alert" } = route.params || {};
  const [type, setType] = useState(initialType); // alert/reward/general/working_hours
  const [messageName, setMessageName] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [offsetTime, setOffsetTime] = useState("2"); // minutes
  const [offsetType, setOffsetType] = useState("before"); // before / after
  const [sendDate, setSendDate] = useState(""); // YYYY-MM-DD
  const [sendTime, setSendTime] = useState(""); // HH:MM
  const [whenPlaceCloses, setWhenPlaceCloses] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      // load single message from API (simplified)
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/messages/${id}`);
          const json = await res.json();
          const m = json.data;
          if (!m) return;
          setType(m.type || initialType);
          setMessageName(m.message_name || "");
          setMessageContent(m.message_content || "");
          setOffsetTime(String(m.offset_time || "2"));
          setOffsetType(m.offset_type || "before");
          setSendDate(m.send_date || "");
          setSendTime(m.send_time || "");
          setWhenPlaceCloses(Boolean(m.when_place_closes));
        } catch (e) {
          console.warn("load message", e);
        }
      })();
    }
  }, [mode, id]);

  function validate() {
    if (!messageName.trim()) {
      Alert.alert("Validation", "Message name is required.");
      return false;
    }
    if (!messageContent.trim()) {
      Alert.alert("Validation", "Message content is required.");
      return false;
    }
    if (type === "alert" && (!offsetTime || Number(offsetTime) < 0)) {
      Alert.alert("Validation", "Please enter a valid sending offset.");
      return false;
    }
    if (type === "reward" && !sendDate) {
      Alert.alert("Validation", "Please choose a send date for reward messages.");
      return false;
    }
    return true;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      id: mode === "edit" ? id : undefined,
      type,
      message_name: messageName,
      message_content: messageContent,
      offset_time: type === "alert" ? Number(offsetTime) : undefined,
      offset_type: type === "alert" ? offsetType : undefined,
      send_date: type === "reward" ? sendDate : undefined,
      send_time: sendTime || undefined,
      when_place_closes: type === "working_hours" ? whenPlaceCloses : undefined,
    };

    try {
      await createOrUpdateMessage(payload);
      Alert.alert("Saved", "Message saved successfully");
      navigation.goBack();
    } catch (e) {
      console.warn("save error", e);
      Alert.alert("Error", "Could not save message");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : null}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.headerSpace}>
          <Text style={styles.headerTitle}>{mode === "edit" ? "Edit Message" : "Create Message"}</Text>
        </View>

        <Text style={styles.sectionTitle}>{capitalize(type)} Message</Text>

        <TextInput
          style={styles.input}
          placeholder="Message Name"
          value={messageName}
          onChangeText={setMessageName}
        />

        <TextInput
          style={[styles.textarea]}
          placeholder="Message Content"
          value={messageContent}
          onChangeText={setMessageContent}
          multiline
        />

        {type === "alert" && (
          <>
            <Text style={styles.helper}>Sending Time</Text>
            <View style={styles.row}>
              <Pill style={offsetType === "minute" ? styles.pillActive : null} onPress={() => setOffsetType("before")}>Minute</Pill>
              <TextInput
                style={[styles.smallInput]}
                keyboardType="number-pad"
                value={offsetTime}
                onChangeText={setOffsetTime}
                accessibilityLabel="offset minutes"
              />
              <View style={styles.checkboxRow}>
                <TouchableOpacity onPress={() => setOffsetType("after")} style={styles.fakeCheckbox}>
                  <Text style={offsetType === "after" ? styles.checkboxOn : styles.checkboxOff}>After</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {type === "reward" && (
          <>
            <Text style={styles.helper}>Sending Date & Time</Text>
            <TextInput style={styles.input} placeholder="YYYY/MM/DD" value={sendDate} onChangeText={setSendDate} />
            <TextInput style={styles.input} placeholder="HH:MM" value={sendTime} onChangeText={setSendTime} />
          </>
        )}

        {type === "working_hours" && (
          <>
            <Text style={styles.helper}>End of Working Hours Time</Text>
            <TextInput style={styles.input} placeholder="HH:MM" value={sendTime} onChangeText={setSendTime} />
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setWhenPlaceCloses((v) => !v)} style={styles.checkbox}>
                <Text>{whenPlaceCloses ? "☑" : "☐"}</Text>
              </TouchableOpacity>
              <Text style={styles.helper}>When the place closes</Text>
            </View>
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cta, !(messageName && messageContent) && styles.ctaDisabled]}
          onPress={onSave}
          disabled={saving || !(messageName && messageContent)}
        >
          <Text style={styles.ctaText}>{saving ? "Saving..." : "Save Message"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function capitalize(s) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

/* -------------------------
   Message Management Screen (Create New - long scroll)
   ------------------------- */
export function MessageManagementScreen({ navigation }) {
  // This screen mirrors your "Create New Message" long form where each section is independent.
  // For brevity, we'll show a condensed version with navigation into MessageForm for each type.
  const goCreate = (type) => {
    navigation.navigate("MessageForm", { mode: "create", initialType: type });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.headerTitle}>Message Management</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>End of Working Hours Messages</Text>
        <Text style={styles.cardBody}>Create messages that send at the end of service hours.</Text>
        <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("working_hours")}>
          <Text style={styles.smallBtnText}>Create End of Working Hours Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Alert Messages</Text>
        <Text style={styles.cardBody}>Messages sent automatically when playtime is ending.</Text>
        <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("alert")}>
          <Text style={styles.smallBtnText}>Create Alert Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reward Messages</Text>
        <Text style={styles.cardBody}>Messages to motivate children or provide discounts.</Text>
        <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("reward")}>
          <Text style={styles.smallBtnText}>Create Reward Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>General Messages</Text>
        <Text style={styles.cardBody}>Welcome messages or announcements.</Text>
        <TouchableOpacity style={styles.smallBtn} onPress={() => goCreate("general")}>
          <Text style={styles.smallBtnText}>Create General Message</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

/* -------------------------
   Styles (StyleSheet)
   ------------------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF8FF",
  },
  header: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  headerSpace: { paddingVertical: 6 },
  headerTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#222222",
    marginVertical: 8,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 14,
    color: "#B8A9DB",
    marginRight: 18,
  },
  tabActive: {
    color: "#A67BFF",
    textDecorationLine: "underline",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#8B8796",
    marginTop: 10,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDEAF7",
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },

  textarea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EDEAF7",
    padding: 14,
    height: 140,
    textAlignVertical: "top",
    marginBottom: 12,
    fontSize: 14,
  },

  helper: {
    fontSize: 12,
    color: "#8B8796",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F6F2FF",
    borderRadius: 20,
    borderWidth: 0,
    marginRight: 8,
  },
  pillText: { color: "#5A4B8A", fontSize: 13 },

  pillActive: {
    backgroundColor: "#EDE0FF",
    borderWidth: 0,
  },

  smallInput: {
    width: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#EDEAF7",
    borderWidth: 1,
    padding: 8,
    marginLeft: 8,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fakeCheckbox: {
    marginLeft: 12,
  },

  cta: {
    marginTop: 18,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A67BFF",
    shadowColor: "#A67BFF",
    shadowOpacity: 0.12,
    elevation: 2,
  },
  ctaDisabled: { backgroundColor: "#E6E0F7" },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editPill: { backgroundColor: "#F4F0FF", paddingVertical: 6, paddingHorizontal: 8 },
  cardTitle: { fontWeight: "700", color: "#222222", fontSize: 14 },
  cardBody: { marginTop: 8, color: "#4A4457", fontSize: 13 },
  cardFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { color: "#8B8796", fontSize: 12 },
  sendingLabel: { color: "#B8A9DB", fontSize: 12 },

  smallBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F8F6FF",
  },
  smallBtnText: { color: "#6B4FF2", fontWeight: "600" },

  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#8B8796",
  },
});
