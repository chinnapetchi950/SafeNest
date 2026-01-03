import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  I18nManager,
  Text,
  Animated,
  Easing,
} from "react-native";
import { useTranslation } from "../../contexts/LanguageContext";
const ProgressBarRTL = ({
  totalSteps = 3,
  currentStep = 1, // starts from right
  activeColor = "#8B5CF6",
  inactiveColor = "#D1D5DB",
}) => {
  // --- Animated value for line width ---
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // --- Animate when step changes ---
  useEffect(() => {
    const percentage = (currentStep - 1) / (totalSteps - 1);

    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [currentStep]);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Line container */}
      <View style={styles.lineWrapper}>
        {/* Inactive line */}
        <View style={[styles.line, { backgroundColor: inactiveColor }]} />

        {/* Active animated line */}
        <Animated.View
          style={[
            styles.line,
            {
              backgroundColor: inactiveColor,
              position: "absolute",
              right: 0,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = totalSteps - i;
          const isActive = stepNumber <= currentStep;

          const scale = new Animated.Value(isActive ? 1.2 : 1);

          useEffect(() => {
            Animated.spring(scale, {
              toValue: isActive ? 1.2 : 1,
              useNativeDriver: true,
            }).start();
          }, [currentStep]);

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? activeColor : inactiveColor,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* Titles */}
      <View style={styles.titleRow}>
        <Text style={styles.dotTitle}>{t("user.identityInformation")}</Text>
        <Text style={styles.dotTitle}>{t("user.userInformation")}</Text>
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
    height: 4,
    borderRadius: 3,
  },
  dotsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  dotTitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});
