import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { colors } from "../../styles/colors";

const BarChartCard = ({ title, data }) => {
  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
      
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(165, 148, 249, ${opacity})`,
          labelColor: () => colors.textLight,
          barPercentage: 0.5,
        }}
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </View>
  );
};

export default BarChartCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 6,
  },
  chart: {
    borderRadius: 16,
  },
});
