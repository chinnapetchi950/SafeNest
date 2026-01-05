import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

const minutes = Array.from({ length: 60 }, (_, i) => i);

import { useTranslation } from 'react-i18next';
const MinuteOnlyPicker = ({ value = null, onChange }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const handleSelect = (minute) => {
    onChange(minute);
    setVisible(false);
  };

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.minuteInput}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.triggerText}>
          {value !== null ? `${value} ${t('common.minuteSuffix')}` : t('picker.selectMinute')}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modal}>
            <Text style={styles.title}>{t('picker.selectMinutes')}</Text>

            <FlatList
              data={minutes}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    value === item && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      value === item && styles.selectedText,
                    ]}
                  >
                    {item} {t('common.minuteSuffix')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default MinuteOnlyPicker;

const styles = StyleSheet.create({
  minuteInput: {
    width: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  triggerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingTop: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#374151",
  },
  item: {
    paddingVertical: 14,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#EDE9FE",
  },
  itemText: {
    fontSize: 15,
    color: "#374151",
  },
  selectedText: {
    color: "#7C3AED",
    fontWeight: "600",
  },
});

