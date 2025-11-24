import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const BottomModal = ({ visible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>

        {/* Click Outside to Close */}
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={26} color="#777" />
          </TouchableOpacity>

          {/* Your Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",

  },
  container: {
    backgroundColor: "#fff",
    height: "75%",

    paddingBottom: 35,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  closeIcon: {
    position: "absolute",
    right: 15,
    top: 12,
    zIndex: 100,
  },
});
