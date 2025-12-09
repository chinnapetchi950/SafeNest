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
function capitalize(s) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
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