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
import { useTranslation } from 'react-i18next'; } from '../../contexts/LanguageContext';

export function MessageFormScreen({ navigation, route }) {
  const { t } = useTranslation();
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
      Alert.alert(t('alerts.error') || t('alerts.error'), t('validation.required') || t('messageManagement.messageName') + ' is required');
      return false;
    }
    if (!messageContent.trim()) {
      Alert.alert(t('alerts.error') || t('alerts.error'), t('messageManagement.messageContent') + ' is required');
      return false;
    }
    if (type === "alert" && (!offsetTime || Number(offsetTime) < 0)) {
  Alert.alert(t('alerts.error') || t('alerts.error'), t('messageManagement.required'));
      return false;
    }
    if (type === "reward" && !sendDate) {
  Alert.alert(t('alerts.error') || t('alerts.error'), t('messageManagement.sendDate') + ' is required');
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
    Alert.alert(t('alerts.success') || t('alerts.success'), t('messageManagement.successSaved'));
      navigation.goBack();
    } catch (e) {
      console.warn("save error", e);
  Alert.alert(t('alerts.error') || t('alerts.error'), t('messageManagement.saveFailed'));
    } finally {
      setSaving(false);
    }
  }
function capitalize(s) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.headerSpace}>
          <Text style={styles.headerTitle}>{mode === "edit" ? strings.messageManagement.update : strings.messageManagement.createMessage}</Text>
        </View>

  <Text style={styles.sectionTitle}>{capitalize(type)} {strings.messageManagement.messageName.includes('Name')? 'Message': ''}</Text>

        <TextInput
          style={styles.input}
          placeholder={strings.messageManagement.messageName}
          value={messageName}
          onChangeText={setMessageName}
        />

        <TextInput
          style={[styles.textarea]}
          placeholder={strings.messageManagement.messageContent}
          value={messageContent}
          onChangeText={setMessageContent}
          multiline
        />

        {type === "alert" && (
          <>
            <Text style={styles.helper}>{strings.messageManagement.sendTime}</Text>
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
            <Text style={styles.helper}>{strings.messageManagement.sendDate} & Time</Text>
            <TextInput style={styles.input} placeholder="YYYY/MM/DD" value={sendDate} onChangeText={setSendDate} />
            <TextInput style={styles.input} placeholder="HH:MM" value={sendTime} onChangeText={setSendTime} />
          </>
        )}

        {type === "working_hours" && (
          <>
            <Text style={styles.helper}>{strings.messageManagement.endWork} Time</Text>
            <TextInput style={styles.input} placeholder="HH:MM" value={sendTime} onChangeText={setSendTime} />
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setWhenPlaceCloses((v) => !v)} style={styles.checkbox}>
                <Text>{whenPlaceCloses ? "☑" : "☐"}</Text>
              </TouchableOpacity>
              <Text style={styles.helper}>{strings.messageManagement.whenPlaceCloses}</Text>
            </View>
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cta, !(messageName && messageContent) && styles.ctaDisabled]}
          onPress={onSave}
          disabled={saving || !(messageName && messageContent)}
        >
          <Text style={styles.ctaText}>{saving ? strings.messageManagement.saving : strings.messageManagement.save}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}