import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";


const DashboardCard = ({ title, subtitle, value, percent, trend }) => {
  const isPositive = trend === "up";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.trendRow}>
        <Ionicons
          name={isPositive ? "trending-up-outline" : "trending-down-outline"}
          size={16}
          color={isPositive ? colors.success : colors.danger}
        />
        <Text
          style={[
            styles.percent,
            { color: isPositive ? colors.success : colors.danger },
          ]}
        >
          {percent}
        </Text>
      </View>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    margin: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  percent: {
    fontSize: 12,
    marginLeft: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
    marginTop: 4,
  },
});
