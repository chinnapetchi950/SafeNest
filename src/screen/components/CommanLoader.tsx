import { RootState } from "@reduxjs/toolkit/query";
import React from "react";
import { ActivityIndicator, View, StyleSheet, Modal } from "react-native";
import { useSelector } from "react-redux";

const CommonLoader = () => {
  const isLoading = useSelector((state: RootState) => state.loadingSlice.isLoading);

  return (
    <Modal visible={isLoading} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  loaderContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});

export default CommonLoader;
