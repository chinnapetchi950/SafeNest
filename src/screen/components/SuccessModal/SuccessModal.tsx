import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useTranslation } from 'react-i18next';
interface SuccessModalProps {
  visible: boolean;
  onDone: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onDone }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.circleWrapper, { transform: [{ scale: scaleAnim }] }]}
          >
            <View style={styles.outerCircle}>
              <View style={styles.middleCircle}>
                <View style={styles.innerCircle}>
                  <Text style={styles.tick}>✓</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Text style={styles.successText}>
            {t("addGame.success")}
          </Text>

          <TouchableOpacity style={styles.doneButton} onPress={onDone}>
            <Text style={styles.doneText}>{t("common.done")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 110,
    alignItems: "center",
  },

  circleWrapper: {
    marginTop: -70,
  },

  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E7F7EE",
    justifyContent: "center",
    alignItems: "center",
  },
  middleCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#C6F0D8",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  tick: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },

  successText: {
    fontSize: 16,
    color: "#3C874A",
    textAlign: "center",
    marginTop: 20,
  },

  doneButton: {
    backgroundColor: "#28A745",
    width: "90%",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 30,
    alignItems: "center",
  },
  doneText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
