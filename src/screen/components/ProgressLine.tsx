import React from "react";
import { View, StyleSheet, I18nManager } from "react-native";

const ProgressBarRTL = ({
  totalSteps = 3,
  currentStep = 1, // starts from 1 (rightmost)
  activeColor = "#8B5CF6", // violet/blue
  inactiveColor = "#D1D5DB", // gray
}) => {
  // Force right-to-left
  I18nManager.forceRTL(true);

  return (
    <View style={styles.container}>
      {/* Line container */}
      <View style={styles.lineWrapper}>
        {/* Inactive line */}
        <View style={[styles.line, { backgroundColor: inactiveColor }]} />

        {/* Active line - dynamic width */}
        <View
          style={[
            styles.line,
            {
              backgroundColor: activeColor,
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              right: 0, // RTL direction
              position: "absolute",
            },
          ]}
        />
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          // In RTL, rightmost is step 1
          const stepNumber = totalSteps - index;
          const isActive = stepNumber <= currentStep;

          return (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: isActive ? activeColor : inactiveColor },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ProgressBarRTL;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  lineWrapper: {
    position: "relative",
    height: 4,
    justifyContent: "center",
  },
  line: {
    height: 3,
    borderRadius: 3,
  },
  dotsRow: {
    flexDirection: "row-reverse", // RTL alignment
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -7,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
